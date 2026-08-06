<div align="center">

# 📅 Consulting Services Procurement Scheduler

### Based on the 2016 Revised IRR of Republic Act No. 9184 (Annex "C")

A web-based procurement scheduling system for **Consulting Services** that automatically generates compliant procurement timelines while considering weekends, holidays, and procurement regulations. It is one of three procurement tools reachable from the project's landing page.

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

# Table of Contents

- [Overview](#overview)
- [Related Procurement Tools](#related-procurement-tools)
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

Opening [`index.html`](index.html) loads a landing page that lets users choose between this scheduler and two companion procurement tools — see [Related Procurement Tools](#related-procurement-tools).

---

# Related Procurement Tools

The landing page (`index.html`) is the entry point for a small suite of TUP Manila procurement tools:

| Tool | Description | Link |
| --- | --- | --- |
| **Consulting Services Procurement Scheduler** | This application — generates RA 9184/RA 12009-compliant schedules for consulting services. | [`consulting.html`](consulting.html) |
| **Goods, Services, and Infrastructure Scheduler** | A companion scheduler for goods, services, and infrastructure procurement. | [goodsscheduler.netlify.app](https://goodsscheduler.netlify.app/) |
| **Project Procurement Management Plan (PPMP) Web Application** | A centralized platform for creating, managing, and consolidating Project Procurement Management Plans, ensuring consistency, accurate budget calculation, and standardized formatting across all implementing units. | [tupngpappmp.netlify.app](https://tupngpappmp.netlify.app/) |

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

## 📱 Fully Responsive, Fit-to-Screen Layout

The landing page and scheduler scale fluidly to the viewport instead of relying on fixed breakpoints:

- Fluid spacing, type, and card sizing using `vmin`/`dvh`-based scaling, so layout adapts to both narrow **and** short screens
- No horizontal overflow on any screen width
- Verified across:
  - Desktop and ultrawide monitors
  - Laptops
  - Tablets
  - Mobile devices (portrait and landscape)

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
Open Landing Page
          │
          ▼
Choose Consulting Services Scheduler
          │
          ▼
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

Add screenshots inside a **docs/images** folder (kept separate from the app's own `assets/images`).

Example:

```
docs/images/
│
├── home.png
├── generated-schedule.png
├── holiday-management.png
└── print-preview.png
```

Then display them:

```markdown
## Home Page

![Home](docs/images/home.png)

## Generated Schedule

![Schedule](docs/images/generated-schedule.png)

## Print Preview

![Print](docs/images/print-preview.png)
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/JstMadz/ConsultingV6.git
```

Open the project folder and launch the landing page.

```
index.html
```

Or open the scheduler directly.

```
consulting.html
```

Recommended:

- Visual Studio Code
- Live Server Extension

---

# How to Use

1. Open `index.html` and select **Consulting Services**.
2. Enter the Project Title.
3. Enter the Approved Budget for the Contract (ABC).
4. Select the Starting Activity.
5. Select the Start Date.
6. Add holidays if necessary.
7. Click **Add project schedule**.
8. Adjust working days if needed.
9. Print or Export to PDF.

---

# Project Structure

```
ConsultingV6
│
├── index.html              # Landing page / scheduler picker
├── consulting.html         # Consulting Services Procurement Scheduler
├── README.md
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
- CSS3 (fluid, `vmin`/`dvh`-based responsive layout)
- JavaScript (Vanilla)
- Local Storage API

No external libraries or build tooling required.

---

# Future Improvements

- Support for Republic Act No. 12009 (New Government Procurement Act)
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
