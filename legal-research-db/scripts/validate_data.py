#!/usr/bin/env python3
"""Validate the verified legal database (Member 2).

Rules enforced (errors make the script exit with status 1):
  * every law / contact / rate has a verification block with a level (A/B/C),
    a valid verified_on date (not in the future) and at least one source URL;
  * "official" sources must come from an allow-listed government domain;
  * Level A laws must have an official text URL and an official/court source;
  * every key provision points to a non-secondary source of the same law;
  * Level C items may not be displayed (laws.json may not contain Level C);
  * every route step that claims a legal basis cites a law_id + ref that
    really exists in laws.json key_provisions (no invented sections);
  * every referenced contact / law id exists.

Warnings (no failure): stale entries (older than --max-age-days), Level B laws
with no extracted provisions, contacts not yet call-tested.

Usage:
  python3 scripts/validate_data.py
  python3 scripts/validate_data.py --max-age-days 60 --write-call-checklist CALL_CHECKLIST.md
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

LEVELS = {"A", "B", "C"}
SOURCE_KINDS = {
    "official_text",      # law text published by a government body
    "official_page",      # a page on a government website
    "official_listing",   # a government page listing laws or other organisations' numbers
    "court",              # High Court / court library publication or judgment
    "org_own_site",       # the organisation's own website (for its own contact details)
    "un_or_state_media",  # UNDP, APP, PID-type sources
    "secondary",          # news, NGO directories, law-firm blogs
}
OFFICIAL_KINDS = {"official_text", "official_page", "official_listing", "court"}
OFFICIAL_SUFFIXES = (".gov.pk", ".gos.pk")
# Statutory bodies whose sites are not on .gov.pk / .gos.pk
OFFICIAL_EXCEPTIONS = {"shrc.org.pk", "pakistanbarcouncil.org"}
STATE_MEDIA_DOMAINS = {"undp.org", "app.com.pk"}

JURISDICTIONS = {"sindh", "federal", "federal_ict", "national"}
CATEGORIES = {
    "employment", "harassment", "tenancy", "legal_aid", "human_rights",
    "government_complaints", "children", "cyber", "family", "women",
    "police", "emergency", "general",
}
CONTACT_TYPES = {
    "emergency", "government_helpline", "government_complaint_cell", "government_department",
    "government_service", "ombudsperson", "statutory_commission", "law_enforcement", "police_liaison",
    "legal_aid_ngo", "legal_aid_helpline", "legal_aid_mechanism", "ngo_helpline",
}
STEP_TYPES = {"legal", "practical_tip", "contact"}
EXCLUDED_STATUSES = {"pending", "rejected", "watch", "gap"}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
PHONE_RE = re.compile(r"^[0-9][0-9-]*$")


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.info: list[str] = []

    def error(self, where: str, msg: str) -> None:
        self.errors.append(f"[ERROR] {where}: {msg}")

    def warn(self, where: str, msg: str) -> None:
        self.warnings.append(f"[WARN]  {where}: {msg}")

    def note(self, where: str, msg: str) -> None:
        self.info.append(f"[INFO]  {where}: {msg}")


def host_of(url: str) -> str:
    host = (urlparse(url).hostname or "").lower()
    return host[4:] if host.startswith("www.") else host


def is_official_host(url: str) -> bool:
    host = host_of(url)
    return host.endswith(OFFICIAL_SUFFIXES) or host in OFFICIAL_EXCEPTIONS


def valid_url(url: object) -> bool:
    if not isinstance(url, str):
        return False
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def parse_date(value: object) -> dt.date | None:
    if not isinstance(value, str):
        return None
    try:
        return dt.date.fromisoformat(value)
    except ValueError:
        return None


def load(path: Path, rep: Report) -> dict | None:
    try:
        with path.open(encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        rep.error(path.name, "file not found")
    except json.JSONDecodeError as exc:
        rep.error(path.name, f"invalid JSON: {exc}")
    return None


def check_sources(where: str, ver: dict, rep: Report) -> list[dict]:
    sources = ver.get("sources")
    if not isinstance(sources, list) or not sources:
        rep.error(where, "verification.sources must be a non-empty list")
        return []
    for i, src in enumerate(sources):
        w = f"{where} source[{i}]"
        if not isinstance(src, dict):
            rep.error(w, "must be an object")
            continue
        url, kind = src.get("url"), src.get("kind")
        if not valid_url(url):
            rep.error(w, f"invalid url {url!r}")
            continue
        if kind not in SOURCE_KINDS:
            rep.error(w, f"unknown kind {kind!r}")
        if not src.get("publisher"):
            rep.error(w, "publisher missing")
        if kind in OFFICIAL_KINDS and not is_official_host(url):
            rep.error(w, f"kind '{kind}' but host '{host_of(url)}' is not an allow-listed official domain")
        if kind == "un_or_state_media" and host_of(url) not in STATE_MEDIA_DOMAINS:
            rep.warn(w, f"host '{host_of(url)}' is not in the UN/state media list - check the kind")
    return sources


def check_verification(where: str, item: dict, rep: Report, today: dt.date, max_age: int) -> dict:
    ver = item.get("verification")
    if not isinstance(ver, dict):
        rep.error(where, "verification block missing")
        return {}
    if ver.get("level") not in LEVELS:
        rep.error(where, f"verification.level must be one of {sorted(LEVELS)}")
    vdate = parse_date(ver.get("verified_on"))
    if vdate is None:
        rep.error(where, "verification.verified_on must be YYYY-MM-DD")
    elif vdate > today:
        rep.error(where, f"verified_on {vdate} is in the future")
    elif (today - vdate).days > max_age:
        rep.warn(where, f"stale: verified {(today - vdate).days} days ago (limit {max_age}) - re-verify")
    check_sources(where, ver, rep)
    return ver


def check_laws(data: dict, rep: Report, today: dt.date, max_age: int) -> dict[str, dict]:
    laws = data.get("laws")
    if not isinstance(laws, list) or not laws:
        rep.error("laws.json", "'laws' must be a non-empty list")
        return {}
    index: dict[str, dict] = {}
    for law in laws:
        lid = law.get("id", "<no id>")
        where = f"laws.json:{lid}"
        if not isinstance(lid, str) or not ID_RE.match(lid):
            rep.error(where, "id must be lowercase letters, digits and hyphens")
        if lid in index:
            rep.error(where, "duplicate id")
        index[lid] = law
        for field in ("title", "jurisdiction", "categories", "key_provisions"):
            if field not in law:
                rep.error(where, f"missing field '{field}'")
        if law.get("jurisdiction") not in JURISDICTIONS:
            rep.error(where, f"jurisdiction must be one of {sorted(JURISDICTIONS)}")
        bad_cats = set(law.get("categories") or []) - CATEGORIES
        if bad_cats:
            rep.error(where, f"unknown categories {sorted(bad_cats)}")

        ver = check_verification(where, law, rep, today, max_age)
        level = ver.get("level")
        sources = ver.get("sources") or []
        kinds = {s.get("kind") for s in sources if isinstance(s, dict)}

        if level == "C":
            rep.error(where, "Level C laws belong in excluded.json, not laws.json")
        if level == "A":
            if not law.get("official_text_url"):
                rep.error(where, "Level A requires official_text_url")
            if not kinds & {"official_text", "court"}:
                rep.error(where, "Level A requires an official_text or court source")
        if level == "B" and not kinds & (OFFICIAL_KINDS | {"un_or_state_media"}):
            rep.error(where, "Level B requires an official, court or UN/state-media source")

        text_url = law.get("official_text_url")
        if text_url is not None and (not valid_url(text_url) or not is_official_host(text_url)):
            rep.error(where, f"official_text_url must be an official URL, got {text_url!r}")
        for url in law.get("other_official_urls") or []:
            if not valid_url(url) or not is_official_host(url):
                rep.error(where, f"other_official_urls entry is not an official URL: {url!r}")

        for j, amd in enumerate(law.get("amendments") or []):
            if not amd.get("title"):
                rep.error(f"{where} amendment[{j}]", "title missing")
            if not isinstance(amd.get("reviewed"), bool):
                rep.error(f"{where} amendment[{j}]", "reviewed must be true/false")
            if amd.get("url") is not None and not valid_url(amd["url"]):
                rep.error(f"{where} amendment[{j}]", f"invalid url {amd['url']!r}")
            if amd.get("reviewed") is False:
                rep.note(where, f"amendment not reviewed yet: {amd.get('title')}")

        provisions = law.get("key_provisions") or []
        refs_seen: set[str] = set()
        for k, prov in enumerate(provisions):
            pw = f"{where} provision[{k}]"
            ref, point, src = prov.get("ref"), prov.get("point"), prov.get("source")
            if not ref or not isinstance(ref, str):
                rep.error(pw, "ref missing")
            elif ref in refs_seen:
                rep.error(pw, f"duplicate ref '{ref}'")
            refs_seen.add(ref or "")
            if not point:
                rep.error(pw, "point missing")
            src_ids = src if isinstance(src, list) else [src]
            for sid in src_ids:
                if not isinstance(sid, int) or not 0 <= sid < len(sources):
                    rep.error(pw, f"source index {sid!r} out of range")
                elif sources[sid].get("kind") == "secondary":
                    rep.error(pw, "provisions may not rely on a secondary source")
        if level == "B" and not provisions:
            rep.note(where, "Level B without provisions - agent may only name and link this law")
    return index


def check_contacts(data: dict, laws: dict[str, dict], rep: Report, today: dt.date, max_age: int) -> dict[str, dict]:
    contacts = data.get("contacts")
    if not isinstance(contacts, list) or not contacts:
        rep.error("support_contacts.json", "'contacts' must be a non-empty list")
        return {}
    index: dict[str, dict] = {}
    for c in contacts:
        cid = c.get("id", "<no id>")
        where = f"support_contacts.json:{cid}"
        if not isinstance(cid, str) or not ID_RE.match(cid):
            rep.error(where, "id must be lowercase letters, digits and hyphens")
        if cid in index:
            rep.error(where, "duplicate id")
        index[cid] = c
        for field in ("name", "type", "jurisdiction", "categories", "phones", "display"):
            if field not in c:
                rep.error(where, f"missing field '{field}'")
        if c.get("jurisdiction") not in JURISDICTIONS:
            rep.error(where, f"jurisdiction must be one of {sorted(JURISDICTIONS)}")
        if c.get("type") not in CONTACT_TYPES:
            rep.error(where, f"type must be one of {sorted(CONTACT_TYPES)}")
        bad_cats = set(c.get("categories") or []) - CATEGORIES
        if bad_cats:
            rep.error(where, f"unknown categories {sorted(bad_cats)}")

        phones = c.get("phones") or []
        for p in phones:
            num = p.get("number")
            if not isinstance(num, str) or not PHONE_RE.match(num):
                rep.error(where, f"phone number must contain only digits and hyphens: {num!r}")
        shown_numbers = {p.get("number") for p in phones}
        for p in c.get("unverified_phones") or []:
            num = p.get("number")
            if not isinstance(num, str) or not PHONE_RE.match(num):
                rep.error(where, f"unverified phone must contain only digits and hyphens: {num!r}")
            if not p.get("why_unverified"):
                rep.error(where, f"unverified phone {num!r} needs why_unverified")
            if num in shown_numbers:
                rep.error(where, f"{num!r} is in both phones and unverified_phones")
            rep.note(where, f"{num} is hidden until call-tested")
        reachable = phones or c.get("complaint_url") or c.get("how_to_access") or c.get("website")
        if not reachable:
            rep.error(where, "needs at least a phone, complaint_url, website or how_to_access")
        for key in ("website", "complaint_url"):
            if c.get(key) is not None and not valid_url(c[key]):
                rep.error(where, f"{key} is not a valid URL: {c[key]!r}")
        for url in c.get("online_links") or []:
            if not valid_url(url):
                rep.error(where, f"online_links entry is not a valid URL: {url!r}")

        ver = check_verification(where, c, rep, today, max_age)
        level = ver.get("level")
        kinds = {s.get("kind") for s in ver.get("sources") or [] if isinstance(s, dict)}
        if level == "C" and c.get("display") is not False:
            rep.error(where, "Level C contacts must have display = false")
        if level == "A" and not kinds & {"official_page", "official_text", "org_own_site"}:
            rep.error(where, "Level A requires the organisation's own site or an official page")
        if level == "B" and not kinds & (OFFICIAL_KINDS | {"un_or_state_media"}):
            rep.error(where, "Level B requires an official listing/page, court or UN/state-media source")
        if ver.get("call_tested") is True and parse_date(ver.get("call_tested_on")) is None:
            rep.error(where, "call_tested is true but call_tested_on is not a date")
        if ver.get("call_tested") is not True:
            rep.note(where, "not call-tested yet")

        for lid in c.get("related_law_ids") or []:
            if lid not in laws:
                rep.error(where, f"related_law_ids references unknown law '{lid}'")
    return index


def check_routes(data: dict, laws: dict[str, dict], contacts: dict[str, dict], rep: Report) -> int:
    routes = data.get("routes")
    if not isinstance(routes, list) or not routes:
        rep.error("issue_routes.json", "'routes' must be a non-empty list")
        return 0
    refs_by_law = {
        lid: {p.get("ref") for p in law.get("key_provisions") or []}
        for lid, law in laws.items()
    }

    def check_basis(where: str, basis: dict) -> None:
        lid, ref = basis.get("law_id"), basis.get("ref")
        if lid not in laws:
            rep.error(where, f"unknown law_id '{lid}'")
            return
        if (laws[lid].get("verification") or {}).get("level") not in {"A", "B"}:
            rep.error(where, f"law '{lid}' is not Level A/B")
        if ref not in refs_by_law[lid]:
            rep.error(where, f"ref '{ref}' is not a verified key_provision of '{lid}'")

    def check_contact_ids(where: str, ids: list) -> None:
        for cid in ids or []:
            if cid not in contacts:
                rep.error(where, f"unknown contact id '{cid}'")
            elif contacts[cid].get("display") is not True:
                rep.error(where, f"contact '{cid}' is not displayable")

    fb = data.get("fallback") or {}
    check_contact_ids("issue_routes.json:fallback", fb.get("contact_ids"))

    seen: set[str] = set()
    for r in routes:
        rid = r.get("id", "<no id>")
        where = f"issue_routes.json:{rid}"
        if not isinstance(rid, str) or not ID_RE.match(rid):
            rep.error(where, "id must be lowercase letters, digits and hyphens")
        if rid in seen:
            rep.error(where, "duplicate id")
        seen.add(rid)
        bad_cats = set(r.get("categories") or []) - CATEGORIES
        if bad_cats:
            rep.error(where, f"unknown categories {sorted(bad_cats)}")
        steps = r.get("steps") or []
        if not steps:
            rep.error(where, "route has no steps")
        for i, step in enumerate(steps, start=1):
            sw = f"{where} step {i}"
            if step.get("order") != i:
                rep.error(sw, f"order should be {i}")
            stype = step.get("type")
            if stype not in STEP_TYPES:
                rep.error(sw, f"type must be one of {sorted(STEP_TYPES)}")
            basis = step.get("legal_basis") or []
            if stype == "legal" and not basis:
                rep.error(sw, "legal step needs at least one legal_basis")
            if stype in {"practical_tip", "contact"} and basis:
                rep.error(sw, f"{stype} step must not claim a legal_basis")
            if stype == "contact" and not step.get("contact_ids"):
                rep.error(sw, "contact step needs contact_ids")
            for b in basis:
                check_basis(sw, b)
            check_contact_ids(sw, step.get("contact_ids"))
        for d in r.get("deadlines") or []:
            check_basis(f"{where} deadline '{d.get('what')}'", d.get("legal_basis") or {})
        check_contact_ids(where, r.get("contact_ids"))
        if not r.get("contact_ids"):
            rep.error(where, "route needs at least one contact")
    return len(routes)


def check_rates(data: dict, laws: dict[str, dict], rep: Report, today: dt.date, max_age: int) -> int:
    rates = data.get("rates") or []
    for rate in rates:
        rid = rate.get("id", "<no id>")
        where = f"current_rates.json:{rid}"
        if rate.get("law_id") not in laws:
            rep.error(where, f"unknown law_id '{rate.get('law_id')}'")
        if parse_date(rate.get("effective_from")) is None:
            rep.error(where, "effective_from must be YYYY-MM-DD")
        for row in rate.get("rates") or []:
            if not isinstance(row.get("amount"), int) or row["amount"] <= 0:
                rep.error(where, f"amount must be a positive integer: {row!r}")
        ver = check_verification(where, rate, rep, today, max_age)
        kinds = {s.get("kind") for s in ver.get("sources") or [] if isinstance(s, dict)}
        if not kinds & OFFICIAL_KINDS:
            rep.error(where, "a current rate needs at least one official source")
        unverified = rate.get("unverified_details") or {}
        if unverified and unverified.get("display") is not False:
            rep.error(where, "unverified_details must have display = false")
    return len(rates)


def check_excluded(data: dict, rep: Report) -> int:
    items = data.get("items") or []
    for i, it in enumerate(items):
        where = f"excluded.json item[{i}]"
        if not it.get("item") or not it.get("reason"):
            rep.error(where, "item and reason are required")
        if it.get("status") not in EXCLUDED_STATUSES:
            rep.error(where, f"status must be one of {sorted(EXCLUDED_STATUSES)}")
    return len(items)


def write_call_checklist(path: Path, contacts: dict[str, dict]) -> None:
    rows = []
    for c in contacts.values():
        ver = c.get("verification") or {}
        if c.get("type") == "emergency":
            continue  # never test emergency lines
        for p in c.get("unverified_phones") or []:
            rows.append((0, "HIGH - hidden until tested", c["name"], p["number"], p.get("label") or "",
                         p.get("why_unverified") or ""))
        if not c.get("display") or ver.get("call_tested") is True:
            continue
        prio = "HIGH" if c.get("priority_call_test") else "normal"
        for p in c.get("phones") or []:
            rows.append((1 if prio == "HIGH" else 2, prio, c["name"], p["number"], p.get("label") or "", p.get("note") or ""))
    rows.sort(key=lambda r: (r[0], r[2]))
    lines = [
        "# Phone verification checklist",
        "",
        f"Generated by scripts/validate_data.py on {dt.date.today().isoformat()}.",
        "Call during office hours (09:00-17:00) on a working day. Ask: (1) Is this the right number for",
        "<organisation>? (2) What hours does it work? (3) Is the call free? (4) Which complaints does it take,",
        "and does it cover Karachi / all of Sindh? Then set call_tested = true and call_tested_on in",
        "data/support_contacts.json, or move the number to data/excluded.json if it fails.",
        "Rows marked 'hidden until tested' come from unverified_phones and are NOT shown to users yet: if the",
        "call confirms the number, move it from unverified_phones into phones and set call_tested.",
        "Emergency lines (15) are deliberately left out.",
        "",
        "Roman Urdu: Har number kisi working day par 9 se 5 ke beech khud call karein aur poochein: kya ye",
        "<idara> ka sahi number hai, kis waqt chalta hai, call free hai ya nahi, aur kaun si complaints leta",
        "hai (Karachi / poore Sindh ke liye?). Number chale to JSON mein call_tested = true aur date likhein;",
        "na chale to us number ko excluded.json mein daal dein. HIGH wale pehle karein. 'hidden until tested'",
        "wale numbers abhi users ko nahi dikhte - call se confirm hon to unhein unverified_phones se phones mein le aayein.",
        "",
        "| Priority | Organisation | Number | Label | Note | Works? (Y/N) | Hours / free? | Tested on |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for _, prio, name, number, label, note in rows:
        safe_note = note.replace("|", "/")
        lines.append(f"| {prio} | {name} | {number} | {label} | {safe_note} |  |  |  |")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    root = Path(__file__).resolve().parent.parent
    parser.add_argument("--data-dir", type=Path, default=root / "data")
    parser.add_argument("--max-age-days", type=int, default=90)
    parser.add_argument("--today", type=str, default=None, help="override today's date (YYYY-MM-DD) for testing")
    parser.add_argument("--write-call-checklist", type=Path, default=None)
    parser.add_argument("--verbose", action="store_true", help="also print INFO lines")
    args = parser.parse_args()

    today = parse_date(args.today) if args.today else dt.date.today()
    if today is None:
        print("--today must be YYYY-MM-DD", file=sys.stderr)
        return 2

    rep = Report()
    d = args.data_dir
    laws_data = load(d / "laws.json", rep) or {}
    contacts_data = load(d / "support_contacts.json", rep) or {}
    routes_data = load(d / "issue_routes.json", rep) or {}
    rates_data = load(d / "current_rates.json", rep) or {}
    excluded_data = load(d / "excluded.json", rep) or {}
    load(d / "sources.json", rep)

    laws = check_laws(laws_data, rep, today, args.max_age_days) if laws_data else {}
    contacts = check_contacts(contacts_data, laws, rep, today, args.max_age_days) if contacts_data else {}
    n_routes = check_routes(routes_data, laws, contacts, rep) if routes_data else 0
    n_rates = check_rates(rates_data, laws, rep, today, args.max_age_days) if rates_data else 0
    n_excluded = check_excluded(excluded_data, rep) if excluded_data else 0

    def by_level(items: dict[str, dict]) -> str:
        counts: dict[str, int] = {}
        for it in items.values():
            lvl = (it.get("verification") or {}).get("level", "?")
            counts[lvl] = counts.get(lvl, 0) + 1
        return ", ".join(f"{k}={v}" for k, v in sorted(counts.items()))

    n_provisions = sum(len(law.get("key_provisions") or []) for law in laws.values())
    print("Verified legal database - validation report")
    print(f"  today: {today}   stale after: {args.max_age_days} days")
    print(f"  laws: {len(laws)} ({by_level(laws)}), verified provisions: {n_provisions}")
    print(f"  contacts: {len(contacts)} ({by_level(contacts)})")
    print(f"  routes: {n_routes}   current rates: {n_rates}   excluded items: {n_excluded}")
    print()
    for line in rep.errors + rep.warnings:
        print(line)
    if args.verbose:
        for line in rep.info:
            print(line)
    print()
    print(f"{len(rep.errors)} error(s), {len(rep.warnings)} warning(s), {len(rep.info)} info note(s)"
          + ("" if args.verbose else " (use --verbose to list info notes)"))

    if args.write_call_checklist and contacts:
        write_call_checklist(args.write_call_checklist, contacts)
        print(f"Call checklist written to {args.write_call_checklist}")

    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())
