# Walkthrough

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
