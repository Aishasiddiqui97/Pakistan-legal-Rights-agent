#!/usr/bin/env python3
"""Export the verified database as RAG-ready chunks (one JSON object per line).

Only displayable, verified content is exported:
  * one chunk per key provision of Level A/B laws (the only legal statements the agent may make);
  * one overview chunk per law (name, number, scope, official link, caveats - no extra legal claims);
  * one chunk per contact with display = true;
  * one chunk per issue route (steps, deadlines, contacts resolved to names and numbers);
  * one chunk per current rate (unverified_details are never exported).

Every chunk carries its source URL(s), verification level and verified_on date in "metadata",
so the agent can cite them and show the date to the user.

Usage:
  python3 scripts/validate_data.py && python3 scripts/export_chunks.py
  python3 scripts/export_chunks.py --out exports/chunks.jsonl
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load(data_dir: Path, name: str) -> dict:
    with (data_dir / name).open(encoding="utf-8") as fh:
        return json.load(fh)


def law_label(law: dict) -> str:
    return f"{law['title']} ({law['act_number']})" if law.get("act_number") else law["title"]


def provision_sources(law: dict, prov: dict) -> list[str]:
    sources = law["verification"]["sources"]
    ids = prov["source"] if isinstance(prov["source"], list) else [prov["source"]]
    return [sources[i]["url"] for i in ids]


def phone_text(contact: dict) -> str:
    parts = []
    for p in contact.get("phones") or []:
        extra = []
        if p.get("toll_free") and "toll" not in (p.get("label") or "").lower():
            extra.append("toll-free")
        if p.get("hours"):
            extra.append(p["hours"])
        parts.append(f"{p['number']} ({p['label']}{', ' + ', '.join(extra) if extra else ''})")
    return "; ".join(parts)


def build_chunks(data_dir: Path) -> list[dict]:
    laws = load(data_dir, "laws.json")["laws"]
    contacts = load(data_dir, "support_contacts.json")["contacts"]
    routes_data = load(data_dir, "issue_routes.json")
    rates = load(data_dir, "current_rates.json").get("rates") or []

    law_by_id = {law["id"]: law for law in laws}
    shown = {c["id"]: c for c in contacts if c.get("display") is True}
    chunks: list[dict] = []

    for law in laws:
        ver = law["verification"]
        if ver["level"] not in {"A", "B"}:
            continue
        base_meta = {
            "law_id": law["id"],
            "jurisdiction": law["jurisdiction"],
            "categories": law["categories"],
            "level": ver["level"],
            "verified_on": ver["verified_on"],
            "keywords": law.get("keywords") or [],
        }
        overview = [f"{law_label(law)}.", law.get("scope") or ""]
        if law.get("official_text_url"):
            overview.append(f"Official text: {law['official_text_url']}")
        if ver["level"] == "B" and not law["key_provisions"]:
            overview.append("Only the existence and scope of this law are verified; do not describe its sections.")
        if law.get("caveats"):
            overview.append("Caveats: " + " ".join(law["caveats"]))
        chunks.append({
            "id": f"law:{law['id']}",
            "type": "law_overview",
            "text": " ".join(x for x in overview if x),
            "metadata": {**base_meta, "source_urls": [s["url"] for s in ver["sources"] if s["kind"] != "secondary"]},
        })
        for prov in law["key_provisions"]:
            text = f"{law_label(law)}, {prov['ref']}: {prov['point']}"
            if prov.get("note"):
                text += f" Note: {prov['note']}"
            chunks.append({
                "id": f"law:{law['id']}:{prov['ref']}",
                "type": "law_provision",
                "text": text,
                "metadata": {**base_meta, "ref": prov["ref"], "source_urls": provision_sources(law, prov)},
            })

    for c in shown.values():
        ver = c["verification"]
        bits = [f"{c['name']}."]
        if c.get("phones"):
            bits.append(f"Phone: {phone_text(c)}.")
        if c.get("email"):
            bits.append("Email: " + ", ".join(c["email"]) + ".")
        if c.get("website"):
            bits.append(f"Website: {c['website']}.")
        if c.get("complaint_url"):
            bits.append(f"Online complaint: {c['complaint_url']}.")
        for key, label in (("services", "Services"), ("how_to_access", "How to access"), ("hours", "Hours"),
                           ("cost", "Cost"), ("address", "Address")):
            if c.get(key):
                value = c[key].rstrip()
                bits.append(f"{label}: {value}" + ("" if value.endswith((".", "!", "?")) else "."))
        bits.append(f"Details verified on {ver['verified_on']}"
                    + (f"; call-tested on {ver['call_tested_on']}." if ver.get("call_tested") else "; not yet call-tested."))
        chunks.append({
            "id": f"contact:{c['id']}",
            "type": "contact",
            "text": " ".join(bits),
            "metadata": {
                "contact_id": c["id"],
                "contact_type": c["type"],
                "jurisdiction": c["jurisdiction"],
                "categories": c["categories"],
                "level": ver["level"],
                "verified_on": ver["verified_on"],
                "call_tested": ver.get("call_tested", False),
                "related_law_ids": c.get("related_law_ids") or [],
                "source_urls": [s["url"] for s in ver["sources"]],
            },
        })

    for r in routes_data["routes"]:
        lines = [f"{r['title']}. Applies when: {r['applies_when']}"]
        cited: set[str] = set()
        for s in r["steps"]:
            line = f"Step {s['order']} ({s['type'].replace('_', ' ')}): {s['action']}"
            if s["legal_basis"]:
                refs = []
                for b in s["legal_basis"]:
                    refs.append(f"{law_by_id[b['law_id']]['short_name'] or law_by_id[b['law_id']]['title']} {b['ref']}")
                    cited.add(f"{b['law_id']}:{b['ref']}")
                line += f" [Legal basis: {'; '.join(refs)}]"
            if s["contact_ids"]:
                line += " [Contact: " + "; ".join(
                    f"{shown[cid]['name']}" + (f" {shown[cid]['phones'][0]['number']}" if shown[cid].get("phones") else "")
                    for cid in s["contact_ids"] if cid in shown) + "]"
            lines.append(line)
        for d in r.get("deadlines") or []:
            b = d["legal_basis"]
            cited.add(f"{b['law_id']}:{b['ref']}")
            lines.append(f"Deadline - {d['what']}: {d['limit']} "
                         f"[{law_by_id[b['law_id']]['short_name'] or law_by_id[b['law_id']]['title']} {b['ref']}]")
        if r.get("caveats"):
            lines.append("Caveats: " + " ".join(r["caveats"]))
        # Sources of the cited provisions, then of the route's contacts (deduplicated, order kept)
        urls: dict[str, None] = {}
        for key in sorted(cited):
            lid, ref = key.split(":", 1)
            prov = next(p for p in law_by_id[lid]["key_provisions"] if p["ref"] == ref)
            urls.update(dict.fromkeys(provision_sources(law_by_id[lid], prov)))
        for cid in r["contact_ids"] + [cid for s in r["steps"] for cid in s["contact_ids"]]:
            if cid in shown:
                urls.update(dict.fromkeys(src["url"] for src in shown[cid]["verification"]["sources"]))
        chunks.append({
            "id": f"route:{r['id']}",
            "type": "issue_route",
            "text": "\n".join(lines),
            "metadata": {
                "route_id": r["id"],
                "categories": r["categories"],
                "emergency": r["emergency"],
                "user_phrases": r["user_phrases"],
                "contact_ids": r["contact_ids"],
                "cited_provisions": sorted(cited),
                "source_urls": list(urls),
            },
        })

    for rate in rates:
        ver = rate["verification"]
        amounts = ", ".join(f"{row['category'].replace('_', '-')} Rs {row['amount']:,}" for row in rate["rates"])
        chunks.append({
            "id": f"rate:{rate['id']}",
            "type": "current_rate",
            "text": f"{rate['title']}: {amounts} ({rate['period']}), effective {rate['effective_from']}. "
                    f"Set under {law_label(law_by_id[rate['law_id']])}. Check the Sindh Labour Department for newer notifications.",
            "metadata": {
                "rate_id": rate["id"],
                "law_id": rate["law_id"],
                "jurisdiction": rate["jurisdiction"],
                "categories": ["employment"],
                "level": ver["level"],
                "verified_on": ver["verified_on"],
                "effective_from": rate["effective_from"],
                "source_urls": [s["url"] for s in ver["sources"] if s["kind"] != "secondary"] + rate.get("notification_pdfs", []),
            },
        })
    return chunks


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--data-dir", type=Path, default=ROOT / "data")
    parser.add_argument("--out", type=Path, default=ROOT / "exports" / "chunks.jsonl")
    args = parser.parse_args()

    chunks = build_chunks(args.data_dir)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.out.open("w", encoding="utf-8") as fh:
        for ch in chunks:
            fh.write(json.dumps(ch, ensure_ascii=False) + "\n")
    counts: dict[str, int] = {}
    for ch in chunks:
        counts[ch["type"]] = counts.get(ch["type"], 0) + 1
    print(f"Wrote {len(chunks)} chunks to {args.out}: " + ", ".join(f"{k}={v}" for k, v in sorted(counts.items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
