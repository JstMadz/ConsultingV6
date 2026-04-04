// consulting.js - Full file (original logic preserved + requested improvements)
// ---------------------------------------------------------------
// Event listeners (generate, print, holidays, save/load)
// ---------------------------------------------------------------
document.getElementById("generateBtn").addEventListener("click", generateSchedule);
// ✅ Updated: now call handlePrint to include date/time & formatted ABC in print
document.getElementById("printBtn").addEventListener("click", handlePrint);
document.getElementById("addHolidayBtn").addEventListener("click", addHoliday);
document.getElementById("saveHolidaysBtn").addEventListener("click", saveHolidaysToFile);
document.getElementById("loadHolidaysBtn").addEventListener("click", loadHolidaysFromFile);

const consultingActivities = [
  { name: "Pre-Procurement Conference", min: 1, max: 1 },
  {
    name: "Advertisement/Posting of Request for Expression of Interest",
    min: 7,
    max: 7,
  },
  { name: "Eligibility Check and Shortlisting", min: 1, max: 20 },
  { name: "Pre-Bid Conference", min: 1, max: 12 },
  { name: "Deadline of Submission and Opening of Bids", min: 1, max: 75 },
  { name: "Bid Evaluation", min: 1, max: 21 },
  { name: "Approval of Ranking by the HOPE", min: 1, max: 2 },
  { name: "Notification for Negotiation", min: 1, max: 3 },
  { name: "Negotiation", min: 1, max: 10 },
  { name: "Post-Qualification", min: 2, max: 30 },
  {
    name: "Approval of Resolution/Issuance of Notice of Award",
    min: 1,
    max: 15,
  },
  { name: "Contract Preparation and Signing", min: 1, max: 10 },
  { name: "Approval of Contract by Higher Authority", min: 1, max: 30 },
  { name: "Issuance of Notice to Proceed", min: 1, max: 7 },
];

let holidays = [];

// ---------------- HOLIDAY MANAGEMENT ----------------
function updateHolidayList() {
  const div = document.getElementById("holidayList");
  div.innerHTML = "<h4>Current Holidays:</h4>";
  if (!holidays.length) {
    div.innerHTML += "<p><i>No holidays added.</i></p>";
    return;
  }

  const ul = document.createElement("ul");
  holidays.forEach((h, i) => {
    const li = document.createElement("li");
    li.textContent = formatDate(new Date(h));
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      holidays.splice(i, 1);
      localStorage.setItem("consultingHolidays", JSON.stringify(holidays));
      updateHolidayList();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
  div.appendChild(ul);
}

function addHoliday() {
  const date = document.getElementById("holidayPicker").value;
  if (!date) return alert("Select a date first.");
  const d = new Date(date).toDateString();
  if (!holidays.includes(d)) {
    holidays.push(d);
    holidays.sort((a, b) => new Date(a) - new Date(b));
    localStorage.setItem("consultingHolidays", JSON.stringify(holidays));
    updateHolidayList();
  } else alert("Already added.");
}

function saveHolidaysToFile() {
  const blob = new Blob([JSON.stringify(holidays, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "holidays.json";
  link.click();
}

function loadHolidaysFromFile() {
  const file = document.getElementById("loadHolidaysFile").files[0];
  if (!file) return alert("Select a file first.");
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const arr = JSON.parse(e.target.result);
      if (!Array.isArray(arr)) throw "Invalid file.";
      holidays = arr;
      localStorage.setItem("consultingHolidays", JSON.stringify(holidays));
      updateHolidayList();
      alert("Holidays loaded.");
    } catch (err) {
      alert("Error: " + err);
    }
  };
  reader.readAsText(file);
}

// ---------------- DATE UTILITIES ----------------
function isHolidayOrWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6 || holidays.includes(d.toDateString());
}
function nextWorkingDay(d) {
  const x = new Date(d);
  while (isHolidayOrWeekend(x)) x.setDate(x.getDate() + 1);
  return x;
}
function addWorkingDays(d, n) {
  let r = new Date(d);
  let added = 0;
  while (added < n) {
    r.setDate(r.getDate() + 1);
    if (!isHolidayOrWeekend(r)) added++;
  }
  return r;
}
function addCalendarDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------------- HELPERS (Added) ----------------

// ✅ Added: Format time (from input type="time" value "HH:MM") to 12-hour format with AM/PM
function formatTime12Hour(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return "";
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// ✅ Added: Format Philippine Peso (for display & printing)
// Accepts user input like "1000000" or "₱1,000,000.00" and returns "₱1,000,000.00"
function formatPeso(input) {
  if (input === null || input === undefined) return "";
  const raw = String(input).trim();
  if (raw === "") return "";
  // Remove any character except digits, minus sign, decimal point
  const cleaned = raw.replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return raw; // if it can't parse, show as-is
  return num.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });
}

// ---------------- PROJECT INFO HANDLING ----------------

// Single authoritative displayProjectInfo (replaces earlier duplicates in original file)
// ✅ Modified so ABC is displayed formatted but stored raw in localStorage, and time is saved too.
function displayProjectInfo() {
  const title = document.getElementById("projectTitle").value.trim();
  const budgetRaw = document.getElementById("projectBudget").value.trim();
  const div = document.getElementById("displayProjectDetails");
  const time = document.getElementById("startTime") ? document.getElementById("startTime").value : "";

  if (!title && !budgetRaw && !time) {
    div.innerHTML = "";
    return;
  }

  const budgetDisplay = budgetRaw ? formatPeso(budgetRaw) : "<i>Not specified</i>";
  const timeDisplay = time ? formatTime12Hour(time) : "";

  div.innerHTML = `
      <p><strong>Project Title:</strong> ${title || "<i>Not specified</i>"}</p>
      <p><strong>Approved Budget for the Contract (ABC):</strong> ${budgetDisplay}</p>
      ${timeDisplay ? `<p><strong>Activity Time:</strong> ${timeDisplay}</p>` : ""}
    `;

  // Save raw budget and time to localStorage so user can edit later easily
  localStorage.setItem(
    "consultingProjectInfo",
    JSON.stringify({ title, budget: budgetRaw, time })
  );
}

// ---------------- AUTO-LOAD PROJECT INFO ----------------
window.addEventListener("load", () => {
  const savedInfo = localStorage.getItem("consultingProjectInfo");
  if (savedInfo) {
    try {
      const { title, budget, time } = JSON.parse(savedInfo);
      if (document.getElementById("projectTitle")) document.getElementById("projectTitle").value = title || "";
      if (document.getElementById("projectBudget")) document.getElementById("projectBudget").value = budget || "";
      if (document.getElementById("startTime")) document.getElementById("startTime").value = time || "";
      displayProjectInfo();
    } catch (e) {
      // ignore parse errors
    }
  }

  const saved = localStorage.getItem("consultingHolidays");
  if (saved) holidays = JSON.parse(saved);
  updateHolidayList();

  // -------- Enable Column Resizing (original code kept) --------
  function makeTableResizable(table) {
    const cols = table.querySelectorAll("th");
    cols.forEach((th) => {
      const resizer = document.createElement("div");
      resizer.style.width = "5px";
      resizer.style.height = "100%";
      resizer.style.position = "absolute";
      resizer.style.top = 0;
      resizer.style.right = 0;
      resizer.style.cursor = "col-resize";
      resizer.style.userSelect = "none";
      th.style.position = "relative";
      th.appendChild(resizer);

      let startX, startWidth;
      resizer.addEventListener("mousedown", (e) => {
        startX = e.pageX;
        startWidth = th.offsetWidth;
        document.addEventListener("mousemove", resizeColumn);
        document.addEventListener("mouseup", stopResize);
      });

      function resizeColumn(e) {
        const newWidth = startWidth + (e.pageX - startX);
        th.style.width = newWidth + "px";
      }

      function stopResize() {
        document.removeEventListener("mousemove", resizeColumn);
        document.removeEventListener("mouseup", stopResize);
      }
    });
  }

  // call on initial load (if table exists)
  const table = document.getElementById("scheduleTable");
  if (table) makeTableResizable(table);
});

// ---------------- MAIN LOGIC (generateSchedule, adjustments, etc.) ----------------
function generateSchedule() {
  const startInput = document.getElementById("startDate").value;
  const startIndex = parseInt(document.getElementById("startActivity").value);
  if (!startInput) return alert("Please select a start date.");

  const startDate = new Date(startInput);
  const body = document.getElementById("tableBody");
  body.innerHTML = "";
  const computed = {};
  let current = new Date(startDate);

  displayProjectInfo(); // ensure project info is visible and saved before generating

  for (let i = startIndex; i < consultingActivities.length; i++) {
    const act = consultingActivities[i];
    let date = addWorkingDays(current, act.min);

    // Rule A: Pre-Bid >= Shortlisting + 7 CDs
    if (i === 3 && computed[2]) {
      const required = nextWorkingDay(addCalendarDays(computed[2], 7));
      if (required > date) date = required;
    }

    // Rule B: Deadline >= Pre-Bid + 12 CDs
    if (i === 4 && computed[3]) {
      const required = nextWorkingDay(addCalendarDays(computed[3], 12));
      if (required > date) date = required;
    }

    date = nextWorkingDay(date);
    computed[i] = date;
    current = new Date(date);

    const elapsed = daysBetween(startDate, date);
    const tr = document.createElement("tr");
    tr.dataset.index = i;
    tr.innerHTML = `
      <td>${act.name}</td>
      <td>${act.min}</td>
      <td>${act.max}</td>
      <td><input type="number" value="0" class="adjust-input" /></td>
      <td class="date-cell">${formatDate(date)}</td>
      <td>${elapsed}</td>
    `;
    body.appendChild(tr);
  }

  const last = Object.keys(computed).pop();
  document.getElementById("totalDays").textContent = daysBetween(
    startDate,
    computed[last]
  );
  attachAdjustListeners(startIndex, startDate);
}

function attachAdjustListeners(startIndex, startDate) {
  document
    .querySelectorAll(".adjust-input")
    .forEach((i) =>
      i.addEventListener("change", () => adjustSchedule(startIndex, startDate))
    );
}

function adjustSchedule(startIndex, startDate) {
  const body = document.getElementById("tableBody");
  const rows = Array.from(body.querySelectorAll("tr"));
  const computed = {};
  let current = new Date(startDate);

  rows.forEach((row, idx) => {
    const i = startIndex + idx;
    const act = consultingActivities[i];
    const add = parseInt(row.querySelector(".adjust-input").value) || 0;
    let date = addWorkingDays(current, act.min + add);
    date = nextWorkingDay(date);
    computed[i] = date;
    current = new Date(date);
    row.querySelector(".date-cell").innerHTML = formatDate(date); // reset
    row.classList.remove("violates-rule");
  });

  warnIfRuleBroken(computed, body);
  attachAdjustListeners(startIndex, startDate);

  const last = Object.keys(computed).pop();
  document.getElementById("totalDays").textContent = daysBetween(
    startDate,
    computed[last]
  );
}

function warnIfRuleBroken(computed, body) {
  // Rule A
  if (computed[2] && computed[3]) {
    const req = nextWorkingDay(addCalendarDays(computed[2], 7));
    if (computed[3] < req) showViolation(body, 3, req);
  }
  // Rule B
  if (computed[3] && computed[4]) {
    const req = nextWorkingDay(addCalendarDays(computed[3], 12));
    if (computed[4] < req) showViolation(body, 4, req);
  }
}

function showViolation(body, index, requiredDate) {
  const row = body.querySelector(`tr[data-index="${index}"]`);
  if (!row) return;
  row.classList.add("violates-rule");

  const cell = row.querySelector(".date-cell");
  cell.innerHTML += `
    <div class="rule-warning">
      ⚠ Must be on/after ${formatDate(requiredDate)}
      <button class="restore-btn">Restore</button>
    </div>
  `;

  const btn = cell.querySelector(".restore-btn");
  btn.addEventListener("click", () => {
    generateSchedule();
    alert(`Restored default date for "${consultingActivities[index].name}".`);
  });
}

// ---------------- PRINT / SAVE as PDF (Updated) ----------------

// ✅ Added: handlePrint() — ensures project details are updated, includes Start Date & Time in 12-hour format,
// and prints the table. Formats ABC via displayProjectInfo (which uses formatPeso).
function handlePrint() {
  // Ensure display is up-to-date (formats ABC for display and saves raw values)
  displayProjectInfo();

  const printContent = document.querySelector(".table-container").outerHTML;
  const projectDetails = document.getElementById("displayProjectDetails").outerHTML;
  const title = document.querySelector("h1").outerHTML;
  const subtitle = document.querySelector("h2").outerHTML;

  // Retrieve Start Date and Time (if provided)
  const startDate = document.getElementById("startDate").value;
  const startTime = document.getElementById("startTime").value;
  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const formattedTime = formatTime12Hour(startTime);

  const dateTimeLine =
    startDate || startTime
      ? `<p style="text-align:center; font-size:10pt; margin-top:4px;">
          Start Date & Time: ${formattedDate} ${formattedTime ? "– " + formattedTime : ""}
        </p>`
      : "";

  const newWin = window.open("", "_blank");
  newWin.document.write(`
      <html>
        <head>
          <title>Consulting Schedule</title>
          <style>
            @page { size: A4; margin: 1cm; }
            body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0; }
            h1, h2 { text-align: center; margin: 0; }
            h1 { font-size: 16pt; }
            h2 { font-size: 12pt; margin-bottom: 6px; }
            .display-details { border: 1px solid #000; padding: 8px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px; text-align: center; }
            th { background: #ccc; }
            tfoot td { font-weight: bold; }
            .table-container { width: 100%; }
          </style>
        </head>
        <body>
          ${title}
          ${subtitle}
          ${dateTimeLine}
          ${projectDetails}
          ${printContent}
        </body>
      </html>
    `);
  newWin.document.close();
  newWin.focus();
  newWin.print();
}

// ---------------- LOAD ON STARTUP (duplicate prevention & original features kept) ----------------
// Already handled earlier in the single window.load listener above

// (The rest of the original code has been preserved above.)
// End of consulting.js
