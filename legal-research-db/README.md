# Legal Rights Agent — Verified Legal Database (Member 2)

The source of truth for the Legal Rights Agent: Sindh and federal laws on **employment, harassment and tenancy**, plus **free legal aid, government complaint cells and helplines** — every entry with its official source URL and the date it was verified.

It is built so the agent **never cites a fake law or an unsupported helpline**: anything that could not be confirmed on an official source is kept out (see `data/excluded.json`), and a validator fails the build if a route cites a section that was not verified.

> Legal information for awareness, not legal advice. Summaries are paraphrased; the official Gazette text prevails.

---

## Roman Urdu quick guide (team ke liye)

- **Ye kya hai:** Agent ka "verified database". Agent sirf wahi law aur helpline batayega jo is folder mein hai.
- **Kaun si file kis kaam ki:**
  - `laws.json` — laws aur unke verified sections (`key_provisions`). Agent sirf inhi sections ki baat kare.
  - `support_contacts.json` — helplines, complaint cells, free legal aid (number + official source + verified date).
  - `issue_routes.json` — user ka masla → steps → kaun sa section → kis ko call kare. Chatbot ka main logic yahin se.
  - `current_rates.json` — minimum wage (har saal July mein badalti hai — code mein hardcode na karein).
  - `excluded.json` — jo cheezein verify nahi huin aur is liye add nahi kin.
- **RAG/backend member:** `python3 scripts/export_chunks.py` chalayein → `exports/chunks.jsonl` mil jayega (har chunk ke saath source URL aur date).
- **Kuch bhi badla?** Pehle `python3 scripts/validate_data.py` chalayein. Error aaye to commit na karein.
- **Demo se pehle:** `CALL_CHECKLIST.md` ke numbers khud call karke check karein — abhi tak koi number call-test nahi hua.

---

## What's inside (researched 16 October 2026, independently re-checked 17 October 2026)

| File | Contents |
|---|---|
| `data/laws.json` | 31 laws — 8 Level A (full official text read), 23 Level B (confirmed on an official source) — with 173 verified provisions |
| `data/support_contacts.json` | 22 contacts — 14 Level A, 8 Level B — helplines, complaint cells, ombudspersons, free legal aid |
| `data/issue_routes.json` | 17 routes from a user's problem to steps, legal basis, deadlines and contacts, plus a fallback |
| `data/current_rates.json` | Sindh minimum wages from 1 July 2026 (official) and history since 2016 |
| `data/sources.json` | The official portals used, how to navigate them, and their quirks |
| `data/excluded.json` | 21 items found but **not** added (bills, drafts, unconfirmed numbers, dead links, dissolved bodies) |
| `schema/*.schema.json` | JSON Schemas for laws, contacts and routes (draft 2020-12) |
| `scripts/validate_data.py` | Dependency-free validator; exits with status 1 on any error |
| `scripts/export_chunks.py` | Writes `exports/chunks.jsonl` — 244 RAG-ready chunks |
| `CALL_CHECKLIST.md` | Numbers to call-test before the demo |

### Independent re-check (17 October 2026)

A second pass, done separately from the original research, re-opened every cited source:

- **Contacts:** 16 of 22 confirmed in full. Three dead links were replaced (HRD and SCPA complaint forms) or removed (IGP portal, LHRLA website). The Sindh harassment Ombudsperson's phone numbers are now hidden until call-tested, because the official site prints the head-office number one digit short. DRF, PLUS and CPLC moved up to Level A after their own sites confirmed the numbers. PLUS's name was corrected to "Pakistan Legal United Society", and its Hyderabad and Sukkur offices were added.
- **Deadlines:** 25 of 26 time limits matched the official text word for word. The one gap was the representation against the Sindh Ombudsman's decision. It is now cited as s.32: 30 days from the date of the decision, not from receipt. The missing 3-month limit for complaining to the Ombudsman was added as s.10(3).
- **Wage rates:** all four 2026-27 amounts confirmed on lhr.sindh.gov.pk.

**Coverage**

- **Employment (Sindh):** Standing Orders Act 2015, Payment of Wages Act 2015, Minimum Wages Act 2015, Industrial Relations Act 2013, Domestic Workers Welfare Act 2025 (Sindh Act No. XVIII of 2026), Prohibition of Employment of Children Act 2017 — all Level A; Home-Based Workers, Shops, Factories, Workers' Compensation, Social Security, Old-Age Benefits, Bonded Labour, OSH, Women Agricultural Workers, Workers Welfare Fund, Workers' Participation — Level B. Federal IRA 2012 for trans-provincial establishments.
- **Harassment:** Protection against Harassment of Women at the Workplace Act 2010 (Level A), PPC s.509, PECA 2016, Sindh Domestic Violence Act 2013.
- **Tenancy:** Sindh Rented Premises Ordinance 1979 (Level A), Sindh Information of Temporary Residents Act 2015 (tenant registration), Cantonments Rent Restriction Act 1963, Islamabad Rent Restriction Ordinance 2001.
- **Complaints, rights and legal aid:** Sindh Ombudsman Act 1991, Sindh Protection of Human Rights Act 2011, Legal Aid and Justice Authority Act 2020, Pakistan Bar Council Free Legal Aid Rules 1999, District Legal Empowerment Committees Rules 2011.

**Routes:** unpaid or late wages · paid below minimum wage · fired or terminated · no appointment letter · workplace harassment · online harassment · domestic worker rights · child labour · eviction threat · utilities cut by landlord · landlord refuses rent or receipt · rent increase / fair rent · rent agreement and tenant registration · need a free lawyer · complaint against a government department · police complaint · domestic violence / woman in danger.

---

## Verification policy

### Laws

| Level | Meaning | What the agent may say |
|---|---|---|
| **A** | The official full text was read; every `key_provision` was checked against it. | Any listed provision, with its `ref` and source URL. |
| **B** | An official source (government listing or PDF, court judgment, department page, UN/state media) confirms the law. | Only the listed `key_provisions`. If the list is empty: name the law and link it — nothing more. |
| **C** | Secondary sources only. | Nothing. Level C laws are not allowed in `laws.json`; they go to `excluded.json`. |

### Contacts

| Level | Meaning |
|---|---|
| **A** | The number appears on the organisation's own official website (or the government department that runs the service). |
| **B** | The number appears on an official government listing or document, but the organisation's own site was not checked. |
| **C** | Secondary sources only — `display` must be `false`. |

`call_tested` is `false` for every contact until someone actually calls the number (see `CALL_CHECKLIST.md`).

A number that was found but is not confirmed by an official source, or is contradicted by one, goes into the contact's `unverified_phones` with a `why_unverified` note. These numbers are **never shown to users**. They are listed first in `CALL_CHECKLIST.md`, and move into `phones` only after a successful call-test.

### Official domains

Sources of kind `official_text`, `official_page`, `official_listing` and `court` must be on `*.gov.pk`, `*.gos.pk`, `shrc.org.pk` (Sindh Human Rights Commission) or `pakistanbarcouncil.org`. Main portals: sindhlaws.gov.pk, pakistancode.gov.pk, humanrights.sindh.gov.pk, lhr.sindh.gov.pk, pas.gov.pk, sja.gos.pk, caselaw.shc.gov.pk.

### What is never added

- Bills and drafts (a bill is not a law) — e.g. Sindh Harassment and Workplace Bill 2018, Sindh Labour Code (draft).
- Numbers found only in NGO directories, blogs or news.
- Numbers of bodies that no longer exist — e.g. FIA Cyber Crime Wing (replaced by NCCIA, helpline 1799).
- Anything recalled from memory without a source.

---

## Rules for the agent (Members building the LLM / RAG / backend)

1. **Legal statements only from `key_provisions`.** Cite the law title, the `ref` (e.g. "SRPO 1979, s.15(2)") and the source URL. Never let the model add sections from its own knowledge.
2. **Level B with no provisions:** only name the law and link it, and say the details are not verified.
3. **Contacts:** show only `display: true` entries and only the numbers in `phones` (never `unverified_phones`); always show `verified_on`; say the number has not been call-tested while `call_tested` is `false`.
4. **Wage rates:** read `current_rates.json`; never hardcode them; never show `unverified_details`.
5. **Emergency first:** if `route.emergency` is `true` or the user is in danger, show police 15 first (then 1094 / 1098 as in the route).
6. **Check jurisdiction before answering:** this data is Sindh-focused. Cantonment areas → Cantonments Rent Restriction Act 1963, not the SRPO. Establishments in more than one province → federal IRA 2012 / NIRC. The Standing Orders Act applies only with 10 or more workers. Outside Sindh, or no matching route → use `fallback` (SLACC 0800-70806 and the Human Rights helpline 1099).
7. **Steps of type `practical_tip`** are common-sense guidance, not law — do not present them as legal requirements.
8. **Always show the disclaimer:** "Ye legal information hai, legal advice nahi. Apne case ke liye free legal aid se raabta karein."

### Example (Python)

```python
import json

routes = json.load(open("data/issue_routes.json", encoding="utf-8"))
contacts = {c["id"]: c for c in json.load(open("data/support_contacts.json", encoding="utf-8"))["contacts"]
            if c["display"]}

route = next(r for r in routes["routes"] if r["id"] == "wages-unpaid-or-late")
for step in route["steps"]:
    print(step["order"], step["action"])
    for basis in step["legal_basis"]:
        print("   legal basis:", basis["law_id"], basis["ref"])
for cid in route["contact_ids"]:
    c = contacts[cid]
    print(c["name"], [p["number"] for p in c["phones"]], "verified on", c["verification"]["verified_on"])
```

`user_phrases` in each route (Roman Urdu and English) can be used for intent matching or as few-shot examples.

---

## Validate and export

```bash
python3 scripts/validate_data.py                       # errors -> exit code 1
python3 scripts/validate_data.py --verbose             # also lists unreviewed amendments and untested numbers
python3 scripts/validate_data.py --write-call-checklist CALL_CHECKLIST.md
python3 scripts/export_chunks.py                       # -> exports/chunks.jsonl
```

The validator checks: valid JSON; required fields; unique ids; levels; `verified_on` dates (warns after 90 days); official domains; Level A laws have an official text; provisions point to a non-secondary source; Level C contacts are hidden; phone format; every route `law_id` + `ref` exists in `key_provisions`; every contact id exists and is displayable; wage rates have an official source.

No Python packages are needed. To also check the JSON Schemas: `pip install jsonschema`.

---

## Adding or updating an entry

1. Find the item on an **official** source (see `data/sources.json` for where to look). If it is only on secondary sources, add it to `data/excluded.json` with `status: "pending"` instead.
2. Add it with a `verification` block: `level`, `verified_on` (today, `YYYY-MM-DD`), and `sources` (url, publisher, kind).
3. For a law provision, set `source` to the index of the source it was checked against. Write `point` as a plain paraphrase; do not add anything the text does not say.
4. For a new route, cite only refs that exist in `key_provisions`; use `practical_tip` for non-legal advice.
5. Run the validator and the export, then commit.

## Maintenance

- **Every 90 days:** re-verify entries (the validator warns when an entry is older).
- **Every July:** check the Sindh Labour Department for the new minimum wage notification.
- **Before the demo:** call-test the numbers in `CALL_CHECKLIST.md`, then set `call_tested` and `call_tested_on`.
- **Watch:** Sindh Labour Code (draft), new amendments listed on sindhlaws.gov.pk and pas.gov.pk.

## Known gaps

- No contact has been call-tested yet. Start with the rows marked HIGH in `CALL_CHECKLIST.md`:
  - **Sindh harassment Ombudsperson:** the head-office number is hidden for now, because the official site prints it one digit short. Until it is confirmed, users get the email address and the online form.
  - **NCCIA:** only 1799 is shown. The Karachi and Hyderabad office numbers are hidden (in `unverified_phones`) because they were read from a search-engine copy of complaint.nccia.gov.pk, which refuses automated access; confirm them in a browser and by phone. The office addresses and the Karachi email were removed, and the helpline is not described as 24/7.
  - **Sindh Labour Department.**
  - **PLUS:** its fees are not stated.
- The Sindh Ombudsman Act's own text could not be opened. Its s.10(3) and s.32 come from the 1991 Ordinance that preceded it and match the Ombudsman's official flyer.
- 9 Level B labour laws have no extracted provisions (Factories, Workers' Compensation, Social Security, Old-Age Benefits, Bonded Labour, OSH, Women Agricultural Workers, Workers Welfare Fund, Workers' Participation) — the agent can only name and link them.
- Amendments not yet reviewed: run `validate_data.py --verbose` for the list (e.g. PECA 2023 and 2025, Factories 2021 and 2026).
- Not confirmed: whether every 2022 amendment of the Workplace Harassment Act is applied identically by the Sindh provincial Ombudsperson.
- No security-deposit refund rule exists in the SRPO 1979 (s.6 was omitted in 1984) — no route was created.
- PECA offence sections and punishments, the Sindh per-day / per-hour minimum wage, and the Islamabad minimum wage are pending (see `excluded.json`).

---

## Git workflow (Member 2 branch)

```bash
git clone <repo-url> && cd <repo>
git checkout -b member2-legal-data
# copy this folder into the repo, e.g. as legal-research-db/
python3 legal-research-db/scripts/validate_data.py
git add legal-research-db
git commit -m "Add verified legal database (laws, contacts, routes, validator)"
git push -u origin member2-legal-data
# then open a Pull Request into main (or the team's integration branch)
```
