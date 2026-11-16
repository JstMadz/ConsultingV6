# Walkthrough

## 2026-11-16 — Short-listing deadline and HoPE approval rows; start activity on its own date

- **Owner's report (via bidDocsGenerator):** the schedule put "Eligibility Check and Shortlisting" one working day after the REI posting date, inside the 7 calendar days of posting (RA 12009 IRR 50.3.1), so the REI's deadline and the schedule disagreed. The owner also explained that the HoPE's approvals (short-list, ranking, award) have no known date: the schedule after them is tentative, and staff continue it from the approval once the HoPE acts.
- **Rows (version 2):** new row 2 "Deadline of Submission and Opening of Short-listing Documents" (at least the day after the 7 CD posting, IRR 50.3.1) and row 4 "Approval of Short-list by the HOPE" (IRR 53.1.4, marked tentative like the ranking and award approvals). Pre-bid now counts its 7 CD from the short-list approval (IRR 51.2, "from the determination of the shortlisted consultants"); IRR 53.1.4 counts 20 CD from the documents deadline. New note for IRR 50.3.1.
- **Start date:** the starting activity now falls on the start date ("Date of the starting activity"); additional days on later rows are added after the IRR floors, so + always moves a date. The starting row's additional days are disabled.
- **Saved projects:** `upgrade()` moves version 1 indexes (`startActivity`, `adjustments`) to the new rows and turns the old start date into the first activity's date, so their dates do not change.
- **Checked:** `calculate()` run in Node with the same holidays gives the same dates as bidDocsGenerator for three cases (from the conference, with additional days, from the pre-bid); an old saved project opens in Chromium with its dates unchanged and no console errors. Same change in bidDocsGenerator; GoodsAndServicesV6 has no short-listing, so nothing to change there.

## 2026-11-15 — RA 12009 Sec. 66: contract approval and Notice to Proceed (branch `ra12009-fixes`)

- Same fix as the Bidding Document Generator (d277b59), by the three-apps rule. The 2026-10-26 entry said no period applies to these two activities; the IRR indeed sets none, but **RA 12009 Sec. 66** does: approval by higher authority within 15 CD of receipt of the contract, the NTP within 3 CD of approval (checked against the GPPB IRR of RA 12009, 1st Edition, March 30, 2026).
- Maximum columns corrected: approval 30 → 15, NTP 7 → 3. The minimums (1 working day each) already fit, so the dates don't change.
- Two new on-screen checks (RA 12009 Sec. 66): approval within 15 CD of signing, NTP within 3 CD of approval.
- Verified headless in Chromium: start Oct 22, 2026 gives signing Thu Dec 3, approval Fri Dec 4 and NTP Mon Dec 7, the same as the Bidding Document Generator, with no findings; adding 20 days to the approval shows the new Sec. 66 note. No page errors.

## 2026-10-26 — Durations and header follow RA 12009 (branch `ra12009-fixes`)

- Reviewed every activity against the GPPB copy of the RA 12009 IRR. Changed: "Approval of Resolution/Issuance of Notice of Award" maximum 15 → 10 CD (IRR 66.2). Confirmed: short-listing 20 CD (53.1.4), deadline at most 75 CD after the last day of REOI posting (54.5), evaluation 21 CD (62.4), ranking approval 2 CD and notice 3 CD (62.2.1), negotiation 10 CD (62.2.5), post-qualification 12 CD, up to 30 (63.8), signing 10 CD (66.5). The new IRR sets no period for approval by higher authority or the Notice to Proceed; those durations are kept.
- The sheet header and README now cite RA 12009 and its IRR instead of the 2016 IRR of RA 9184.
- Each schedule lists the IRR periods it breaks, on screen only (hidden in print and the PDF), the same checks as the Bidding Document Generator.
- Bug: changing "Additional days" and moving focus threw `NotFoundError` (the table was replaced inside the input's blur). The re-render is now deferred, as GoodsAndServicesV6 already did. The error also happened before this change.
- Dates are unchanged (checked in Chrome before and after).

## 2026-10-25 — Clarification and bid bulletin dates (RA 12009 IRR 51.5.1)

- Added two rows counted back from the bid deadline: "Last Day of Clarification from Bidders" (10 CD before) and "Posting of Supplemental Bid Bulletin" (7 CD before), each moved to the previous working day. The schedule had no clarification or bulletin dates.
- They are derived rows (no "Additional days" input) inserted after the Pre-Bid Conference, so the saved `startActivity` and `adjustments` indexes in browsers stay valid.
- Still to review: the other activity durations follow the 2016 IRR of RA 9184 (Annex C), as the header says; they need a check against RA 12009.
