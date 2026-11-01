# AGENTS.md: ConsultingV6 (TUP Consulting Services Procurement Scheduler)

> Instructions for any AI agent (Claude Code, Codex, Gemini, Copilot, OpenCode…) working in this repo.
> Owner: Madz Amador. House rules: `~/.claude/skills/dev-playbook/SKILL.md`; global agent rules: `~/Documents/KnowledgeGraph/AGENTS.md`. This file overrides them where they differ.

## 1. What this is
A browser-only scheduler for the TUP BAC's **Consulting Services** procurements under **RA 12009** and its IRR: from the Pre-Procurement Conference it computes REOI posting, short-listing, bidding, evaluation, ranking, negotiation, post-qualification, award and contract dates, skipping weekends and user-set non-working dates. `index.html` is a landing page linking the TUP procurement tools; the scheduler is `consulting.html`. See [README.md](README.md).

## 2. Stack & commands
- Stack A: plain HTML/CSS/JS (`assets/css/`, `assets/js/`). No build, no tests.
- Run: open `index.html` or `consulting.html`, or `npx serve .`
- Verify: create projects starting at different activities, add non-working dates, change "Additional days"; compare every date before and after your change in Chrome; print.
- Deploy: Netlify (static repo root).

## 3. Project memory
- `walkthrough.md`: dated log. **Add an entry at the top after every change.**
- Working branch: **`ra12009-fixes`** (not `main`).

## 4. Domain rules (non-negotiable)
1. **Same fix, three apps:** this scheduler, GoodsAndServicesV6 and the scheduler built into bidDocsGenerator (`src/lib/schedule/`). A rule fix here is made there too.
2. Durations follow the GPPB copy of the RA 12009 IRR: short-listing 20 CD (53.1.4), deadline ≤ 75 CD after the last REOI posting day (54.5), evaluation 21 CD (62.4), ranking approval 2 CD and notice 3 CD (62.2.1), negotiation 10 CD (62.2.5), post-qualification 12 CD up to 30 (63.8), award ≤ 10 CD of the resolution (66.2), signing 10 CD (66.5). Cite the IRR section in the commit.
3. Clarification (10 CD) and bid bulletin (7 CD) are counted back from the bid deadline to the previous working day (51.5.1).
4. The IRR-break list under each schedule is **screen only**: hidden in print.

## 5. Key files
- `assets/js/consulting.js`: activities and durations, date math, IRR checks, storage (`localStorage` keys `consultingProjects`, `consultingHolidays`), rendering.
- `assets/js/visitor-counter.js`, `assets/css/consulting.css`, `assets/css/landing.css`.

## 6. Gotchas specific to this repo
- **Saved projects store activity indexes** (`startActivity`, `adjustments`). Add new rows as derived rows (no "Additional days" input) so existing indexes stay valid.
- Re-render the table after an input's blur, not during it (replacing the table inside blur threw `NotFoundError`).

## 7. Before you finish
- [ ] Dates checked before/after in Chrome; print checked
- [ ] Same rule change made in GoodsAndServicesV6 (if it applies) and bidDocsGenerator
- [ ] `walkthrough.md` updated; commit on `ra12009-fixes` citing the IRR section
