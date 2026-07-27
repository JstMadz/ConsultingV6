# Consulting Services Procurement Scheduler
### Based on the 2016 Revised IRR of Republic Act No. 9184 (Annex "C")

A web-based procurement scheduling application developed to assist Procurement Management Offices (PMOs), BAC Secretariats, faculty researchers, and government agencies in generating compliant procurement timelines for **Consulting Services**. The application automatically computes procurement schedules while considering government procurement rules, weekends, holidays, and user-defined adjustments.

---

## Features

### Procurement Schedule Generation
- Generates the procurement timeline based on the selected starting activity and start date.
- Supports the following starting activities:
  - Pre-Procurement Conference
  - Advertisement/Posting of Request for Expression of Interest
  - Eligibility Check and Shortlisting

### Automatic Date Computation
- Calculates succeeding procurement activities automatically.
- Excludes:
  - Saturdays
  - Sundays
  - User-defined Holidays

### Government Procurement Compliance
Implements the mandatory scheduling requirements under the 2016 Revised IRR of RA 9184 (Annex "C"), including:

- Pre-Bid Conference shall be scheduled at least **7 Calendar Days** after Eligibility Check and Shortlisting.
- Deadline for Submission and Opening of Bids shall be scheduled at least **12 Calendar Days** after the Pre-Bid Conference.
- Automatically adjusts dates that fall on weekends or declared holidays.

---

## Procurement Activities Included

1. Pre-Procurement Conference
2. Advertisement / Posting of Request for Expression of Interest
3. Eligibility Check and Shortlisting
4. Pre-Bid Conference
5. Deadline of Submission and Opening of Bids
6. Bid Evaluation
7. Approval of Ranking by the HOPE
8. Notification for Negotiation
9. Negotiation
10. Post Qualification
11. Approval of Resolution / Issuance of Notice of Award
12. Contract Preparation and Signing
13. Approval of Contract by Higher Authority
14. Issuance of Notice to Proceed

---

## Dynamic Schedule Adjustment

Each procurement activity includes:

- Minimum allowable working days
- Maximum allowable working days
- User-adjustable additional working days

Whenever adjustments are made, the system automatically:

- Recalculates all succeeding schedules
- Updates total calendar days
- Validates procurement rules
- Highlights rule violations

---

## Rule Validation

The system continuously validates the generated schedule.

If a procurement rule is violated:

- The affected row is highlighted.
- A warning message is displayed.
- A **Restore** button is provided to restore the default compliant schedule.

---

## Holiday Management

The application supports custom holidays.

Users may:

- Add holidays
- Delete holidays
- Save holidays to a JSON file
- Load holidays from a JSON file

Holiday data is automatically stored using Local Storage for future sessions.

---

## Project Information

The application allows users to enter:

- Project Title
- Approved Budget for the Contract (ABC)

Features include:

- Automatic Local Storage
- Automatic loading when reopening the application
- Included in printed reports
- Included in PDF exports

---

## Print and PDF Export

The application includes a print-friendly layout.

When printing or exporting to PDF, the report contains:

- University Header
- Application Title
- Project Title
- Approved Budget for the Contract (ABC)
- Complete Procurement Schedule
- Total Calendar Days

The printed report preserves:

- Table colors
- Header colors
- Rule violation highlighting
- Professional formatting

---

## Responsive Design

The interface is optimized for:

- Desktop Computers
- Laptops
- Tablets
- Mobile Devices

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JavaScript)
- Local Storage API

No external libraries or frameworks are required.

---

## Folder Structure

```
project-folder/
│
├── consulting.html
├── consulting.css
├── consulting.js
├── README.md
└── holidays.json (optional)
```

---

## Browser Compatibility

Tested on:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

Recommended Browser:
- Google Chrome (latest version)

---

## How to Use

### 1. Download the Project

Clone the repository.

```bash
git clone https://github.com/yourusername/consulting-procurement-scheduler.git
```

or download the ZIP file.

---

### 2. Open the Application

Open

```
consulting.html
```

using your preferred web browser.

For development, it is recommended to use:

- Visual Studio Code
- Live Server Extension

---

### 3. Generate a Schedule

1. Enter the Project Title.
2. Enter the Approved Budget for the Contract (ABC).
3. Select the Starting Activity.
4. Select the Start Date.
5. Add holidays if necessary.
6. Click **Generate Schedule**.

---

### 4. Adjust the Schedule

Modify the **Adjust (+ Days)** column whenever additional working days are required.

The application automatically recalculates all succeeding activities.

---

### 5. Print or Export to PDF

Click

```
Print / Export PDF
```

to generate a printable procurement schedule.

For best results, enable:

> Print Background Graphics

in your browser's print settings.

---

## Future Enhancements

Possible future improvements include:

- Support for Republic Act No. 12009 (New Government Procurement Act)
- Goods Procurement Scheduler
- Infrastructure Procurement Scheduler
- Non-Consulting Services Scheduler
- Automatic Gantt Chart Generation
- Excel Export
- PDF Report Generation without Browser Print Dialog
- Electronic Signature Section
- Agency Logo Upload
- BAC Resolution Number
- Project Identification Number
- Calendar View
- Procurement Monitoring Dashboard

---

## License

This project is intended for educational, research, and government procurement planning purposes.

Users are encouraged to verify generated schedules against the latest Government Procurement Policy Board (GPPB) issuances and applicable procurement laws before official use.

---

## Author

Developed for academic research and government procurement scheduling.

**Consulting Services Procurement Scheduler**
Based on the 2016 Revised IRR of Republic Act No. 9184 (Annex "C").
