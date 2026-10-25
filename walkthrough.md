# Walkthrough

## 2026-10-25 — Clarification and bid bulletin dates (RA 12009 IRR 51.5.1)

- Added two rows counted back from the bid deadline: "Last Day of Clarification from Bidders" (10 CD before) and "Posting of Supplemental Bid Bulletin" (7 CD before), each moved to the previous working day. The schedule had no clarification or bulletin dates.
- They are derived rows (no "Additional days" input) inserted after the Pre-Bid Conference, so the saved `startActivity` and `adjustments` indexes in browsers stay valid.
- Still to review: the other activity durations follow the 2016 IRR of RA 9184 (Annex C), as the header says; they need a check against RA 12009.
