<div align="center">

# 📅 Consulting Services Procurement Scheduler

### Based on the 2016 Revised IRR of Republic Act No. 9184 (Annex "C")

A web-based procurement scheduling system for **Consulting Services** that automatically generates compliant procurement timelines while considering weekends, holidays, and procurement regulations.

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

# Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Procurement Activities](#procurement-activities)
- [System Workflow](#system-workflow)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Future Improvements](#future-improvements)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

# Overview

The **Consulting Services Procurement Scheduler** is a browser-based application designed to assist Procurement Management Offices (PMOs), Bids and Awards Committees (BACs), faculty researchers, and government agencies in preparing procurement schedules that comply with the **2016 Revised Implementing Rules and Regulations (IRR) of Republic Act No. 9184, Annex "C"**.

The system automates procurement scheduling, minimizes manual computation errors, skips weekends and holidays, validates mandatory procurement timelines, and generates professional printable reports.

---

# Features

## 📅 Procurement Schedule Generation

- Automatic procurement timeline generation
- Multiple starting activity options
- Working-day computation
- Automatic schedule recalculation

---

## ⚖ Government Procurement Compliance

Implements scheduling rules including:

- Minimum procurement durations
- Maximum allowable durations
- Seven-calendar-day rule for Pre-Bid Conference
- Twelve-calendar-day rule before Bid Submission
- Automatic working-day adjustment

---

## 📆 Holiday Management

- Add Holidays
- Remove Holidays
- Save Holidays (.json)
- Load Holidays (.json)
- Local Storage support

---

## 🔄 Dynamic Schedule Adjustment

Users may add additional working days for every procurement activity.

Whenever adjustments are made, the application automatically:

- Updates succeeding schedules
- Updates total calendar days
- Checks procurement compliance
- Highlights rule violations

---

## 🚨 Rule Validation

The system automatically detects violations.

Features include:

- Warning messages
- Highlighted rows
- Restore Default Schedule button

---

## 📁 Project Information

The application stores:

- Project Title
- Approved Budget for the Contract (ABC)

Features:

- Auto-save using Local Storage
- Auto-load upon reopening
- Included in printed reports
- Included in PDF exports

---

## 🖨 Print / Export to PDF

The printable report includes:

- University Header
- Application Title
- Project Title
- Approved Budget for the Contract (ABC)
- Procurement Schedule
- Total Calendar Days

Supports:

- Colored tables
- Colored headers
- Rule highlighting
- Professional report layout

---

## 📱 Responsive Design

Compatible with:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# Procurement Activities

The scheduler currently supports:

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

# System Workflow

```text
Input Project Information
          │
          ▼
Select Starting Activity
          │
          ▼
Choose Start Date
          │
          ▼
Add Holidays (Optional)
          │
          ▼
Generate Schedule
          │
          ▼
Adjust Working Days
          │
          ▼
Rule Validation
          │
          ▼
Print / Export PDF
```

---

# Screenshots

Add screenshots inside the **images** folder.

Example:

```
images/
│
├── home.png
├── generated-schedule.png
├── holiday-management.png
└── print-preview.png
```

Then display them:

```markdown
## Home Page

![Home](images/home.png)

## Generated Schedule

![Schedule](images/generated-schedule.png)

## Print Preview

![Print](images/print-preview.png)
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/yourusername/consulting-procurement-scheduler.git
```

Open the project folder.

```
consulting.html
```

Recommended:

- Visual Studio Code
- Live Server Extension

---

# How to Use

1. Enter the Project Title.
2. Enter the Approved Budget for the Contract (ABC).
3. Select the Starting Activity.
4. Select the Start Date.
5. Add holidays if necessary.
6. Click **Generate Schedule**.
7. Adjust working days if needed.
8. Print or Export to PDF.

---

# Project Structure

```
ConsultingV6
│
├── index.html              # Landing page / scheduler picker
├── consulting.html         # Consulting Services Procurement Scheduler
├── README.md
├── LICENSE
│
└── assets
    ├── css
    │   ├── landing.css     # Styles for index.html
    │   └── consulting.css  # Styles for consulting.html
    ├── js
    │   ├── consulting.js       # Scheduler logic for consulting.html
    │   └── visitor-counter.js  # Shared visitor counter widget
    └── images
        └── tup-logo.png
```

---

# Technology Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Local Storage API

No external libraries required.

---

# Future Improvements

- Support for Republic Act No. 12009 (New Government Procurement Act)
- Goods Procurement Scheduler
- Infrastructure Procurement Scheduler
- Non-Consulting Services Scheduler
- Automatic Gantt Chart
- Excel Export
- Native PDF Generation
- Agency Logo Upload
- BAC Resolution Number
- Project ID
- Dashboard Analytics
- Procurement Monitoring
- Calendar View
- Dark Mode

---

# Acknowledgements

This project was inspired by the procurement procedures prescribed under:

- Republic Act No. 9184
- 2016 Revised IRR of RA 9184
- Government Procurement Policy Board (GPPB)
- Technological University of the Philippines – Manila

---

# License

This project is released for **educational**, **research**, and **government planning** purposes.

Users should always verify generated schedules against the latest Government Procurement Policy Board (GPPB) issuances and applicable procurement laws before official implementation.

---

<div align="center">

## Developed By

**Madz Amador**

Master in Information Technology  
Doctor of Technology Management (Candidate)

Technological University of the Philippines – Manila

---

⭐ If you found this project useful, consider giving it a star on GitHub!

</div>
