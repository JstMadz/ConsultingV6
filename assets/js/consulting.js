const activities = [
  ["Pre-Procurement Conference", 1, 1],
  ["Advertisement/Posting of Request for Expression of Interest", 7, 7],
  ["Eligibility Check and Shortlisting", 1, 20],
  ["Pre-Bid Conference", 1, 12],
  ["Deadline of Submission and Opening of Bids", 1, 75],
  ["Bid Evaluation", 1, 21],
  ["Approval of Ranking by the HOPE", 1, 2],
  ["Notification for Negotiation", 1, 3],
  ["Negotiation", 1, 10],
  ["Post-Qualification", 2, 30],
  ["Approval of Resolution/Issuance of Notice of Award", 1, 15],
  ["Contract Preparation and Signing", 1, 10],
  ["Approval of Contract by Higher Authority", 1, 30],
  ["Issuance of Notice to Proceed", 1, 7],
].map(([name, min, max]) => ({ name, min, max }));
const $ = (id) => document.getElementById(id);
let holidays = [],
  projects = [],
  editingProjectId = null;
let calendarMonth = new Date();
const localDate = (v) => {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  },
  isoDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
  validDate = (v) =>
    /^\d{4}-\d{2}-\d{2}$/.test(v) && isoDate(localDate(v)) === v,
  formatDate = (d) =>
    new Intl.DateTimeFormat("en-PH", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d),
  formatDateTime = (d = new Date()) =>
    new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d),
  formatTime = (t) => {
    if (!t) return "Not specified";
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  },
  peso = (v) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(v),
  money = (v) => {
    const n = String(v).replace(/[₱,\s]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(n)) return null;
    const a = Number(n);
    return Number.isFinite(a) && a >= 0 && a <= 999999999999.99 ? a : null;
  },
  escape = (v) => {
    const e = document.createElement("div");
    e.textContent = v;
    return e.innerHTML;
  };
function status(msg, error = false) {
  $("formStatus").textContent = msg;
  $("formStatus").classList.toggle("is-error", error);
}
function fieldError(id, msg) {
  $(id).setAttribute("aria-invalid", !!msg);
  $(id + "Error").textContent = msg || "";
}
function nonWorking(d) {
  return d.getDay() === 0 || d.getDay() === 6 || holidays.includes(isoDate(d));
}
function nextWorking(d) {
  const r = new Date(d);
  while (nonWorking(r)) r.setDate(r.getDate() + 1);
  return r;
}
function addWorking(d, n) {
  const r = new Date(d);
  for (let a = 0; a < n; ) {
    r.setDate(r.getDate() + 1);
    if (!nonWorking(r)) a++;
  }
  return r;
}
function addCalendar(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function between(a, b) {
  return Math.round((b - a) / 86400000);
}
function persist() {
  localStorage.setItem("consultingProjects", JSON.stringify(projects));
  localStorage.setItem("consultingHolidays", JSON.stringify(holidays));
}
function validate() {
  const title = $("projectTitle").value.trim(),
    budget = money($("projectBudget").value),
    date = $("startDate").value,
    start = $("startTime").value,
    end = $("endTime").value;
  fieldError("projectTitle", title ? "" : "Enter the project title.");
  fieldError(
    "projectBudget",
    budget === null
      ? "Enter a valid non-negative peso amount using up to two decimal places."
      : "",
  );
  fieldError("startDate", validDate(date) ? "" : "Choose a valid start date.");
  fieldError(
    "endTime",
    start && end && end <= start
      ? "End time must be later than start time."
      : "",
  );
  return !!(
    title &&
    budget !== null &&
    validDate(date) &&
    (!start || !end || end > start)
  );
}
function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  $("holidayCalendarMonth").textContent = calendarMonth.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
  const offset = new Date(year, month, 1, 12).getDay();
  const totalDays = new Date(year, month + 1, 0, 12).getDate();
  const cells = Array(offset).fill(null);
  for (let day = 1; day <= totalDays; day++) cells.push(day);
  while (cells.length % 7) cells.push(null);
  $("holidayCalendarDays").innerHTML = cells
    .map((day) => {
      if (!day) return '<span class="calendar-empty" aria-hidden="true"></span>';
      const date = isoDate(new Date(year, month, day, 12));
      const selected = holidays.includes(date);
      return `<button class="calendar-day${selected ? " is-selected" : ""}" type="button" data-date="${date}" aria-pressed="${selected}" aria-label="${formatDate(localDate(date))}${selected ? ", selected" : ""}">${day}</button>`;
    })
    .join("");
}
function renderHolidays() {
  const list = $("holidayList");
  list.innerHTML = holidays.length
    ? `<p class="holiday-summary">${holidays.length} non-working date${holidays.length === 1 ? "" : "s"} selected</p><ul>${holidays.map((d) => `<li>${formatDate(localDate(d))}<button class="remove-holiday" data-date="${d}" type="button" aria-label="Remove ${formatDate(localDate(d))}">×</button></li>`).join("")}</ul>`
    : '<p class="holiday-empty">No dates selected. Weekends are always excluded.</p>';
  $("clearHolidaysBtn").disabled = holidays.length === 0;
  list.querySelectorAll("button").forEach(
    (button) =>
      (button.onclick = () => toggleHoliday(button.dataset.date)),
  );
}
function toggleHoliday(date) {
  const wasSelected = holidays.includes(date);
  holidays = wasSelected
    ? holidays.filter((item) => item !== date)
    : [...holidays, date].sort();
  persist();
  renderHolidays();
  renderCalendar();
  renderProjects();
  status(wasSelected ? "Non-working date removed." : "Non-working date added.");
}
function calculate(p) {
  let current = localDate(p.startDate),
    computed = {};
  return activities.slice(p.startActivity).map((a, o) => {
    const i = p.startActivity + o,
      extra = Number(p.adjustments[i] || 0);
    let d = addWorking(current, a.min + extra);
    if (i === 3 && computed[2])
      d = new Date(Math.max(d, nextWorking(addCalendar(computed[2], 7))));
    if (i === 4 && computed[3])
      d = new Date(Math.max(d, nextWorking(addCalendar(computed[3], 12))));
    d = nextWorking(d);
    computed[i] = d;
    current = new Date(d);
    return { a, i, d, extra };
  });
}
function renderCard(p) {
  const start = localDate(p.startDate),
    rows = calculate(p),
    last = rows.at(-1);
  return `<article class="project-schedule" data-id="${p.id}">
    <header class="schedule-brand">
      <img src="assets/images/tup-logo.png" alt="">
      <div>
        <p class="university-name">Technological University of the Philippines – Manila</p>
        <p class="document-name">Consulting Services Procurement Schedule · 2016 Revised IRR of RA 9184</p>
      </div>
    </header>
    <div class="schedule-head">
      <div class="schedule-title-row">
        <h3>${escape(p.title)}</h3>
        <div class="project-actions">
          <button type="button" class="button button-outline edit-project" data-id="${p.id}">Edit project</button>
        <button type="button" class="button button-danger remove-project" data-id="${p.id}">Remove project</button>
        </div>
      </div>
      <div class="metadata">
        <span><strong>ABC:</strong> ${peso(p.budget)}</span>
        <span><strong>Schedule time:</strong> ${formatTime(p.startTime)}–${formatTime(p.endTime)}</span>
        <span><strong>Anchor date:</strong> ${formatDate(start)}</span>
        <span><strong>Starting activity:</strong> ${escape(activities[p.startActivity].name)}</span>
      </div>
    </div>
    <div class="table-container" role="region" tabindex="0" aria-label="Schedule details. Scroll horizontally to view all columns.">
      <table class="schedule-table">
        <thead><tr><th>Procurement activity</th><th>Minimum days</th><th>Maximum days</th><th>Additional days</th><th>Scheduled date</th><th>Elapsed calendar days</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${r.a.name}</td><td>${r.a.min}</td><td>${r.a.max}</td><td><input class="adjust-input" type="number" min="0" max="3650" step="1" value="${r.extra}" data-id="${p.id}" data-index="${r.i}" aria-label="Additional days for ${r.a.name}"><span class="row-error"></span></td><td>${formatDate(r.d)}</td><td>${between(start, r.d)}</td></tr>`).join("")}</tbody>
        <tfoot><tr class="total-days-row"><th colspan="5">Total calendar days</th><td>${between(start, last.d).toLocaleString("en-PH")}</td></tr></tfoot>
      </table>
    </div>
    <footer class="schedule-footer">
      <div class="signatory"><p>Prepared by:</p><div class="signature-line"></div><strong>Signature over printed name</strong><span>Procurement Office</span></div>
      <div class="document-timestamps"><p>Created: ${formatDateTime(new Date(p.createdAt))}</p><p>Printed: <span class="print-time">${formatDateTime()}</span></p></div>
    </footer>
  </article>`;
}
const PAPER = {
  a4: { width: 210, height: 297, format: "a4" },
  folio: { width: 215.9, height: 330.2, format: [215.9, 330.2] },
};
const PRINT_MARGIN_MM = 5;
const PDF_MARGIN_MM = 4;
const MM_TO_PX = 96 / 25.4;
function selectedPaper() {
  return PAPER[$("paperSize").value] || PAPER.a4;
}
function fitScheduleToPage(schedule, paper, margin) {
  const width = (paper.width - margin * 2) * MM_TO_PX;
  const height = (paper.height - margin * 2 - 2) * MM_TO_PX;
  const maxScale = 1.3;
  schedule.style.zoom = "";
  schedule.style.width = `${width}px`;
  const naturalHeight = schedule.scrollHeight;
  let low = naturalHeight > height ? 0.5 : 1;
  let high = naturalHeight > height ? 1 : maxScale;
  for (let i = 0; i < 12; i++) {
    const scale = (low + high) / 2;
    schedule.style.zoom = String(scale);
    schedule.style.width = `${width / scale}px`;
    if (schedule.scrollHeight * scale <= height) low = scale;
    else high = scale;
  }
  if (Math.abs(low - 1) < 0.005) {
    schedule.style.zoom = "";
    schedule.style.width = `${width}px`;
    return;
  }
  schedule.style.zoom = String(low);
  schedule.style.width = `${width / low}px`;
}
// Scale export typography and spacing before canvas capture. html2canvas can
// render browser CSS zoom with broken word spacing, so the PDF path uses normal
// layout and adjusts only the document's type and padding.
function fitPdfScheduleToPage(schedule, paper, margin) {
  const width = (paper.width - margin * 2) * MM_TO_PX;
  const height = (paper.height - margin * 2 - 2) * MM_TO_PX;
  schedule.style.zoom = "";
  schedule.style.width = `${width}px`;
  schedule.classList.add("pdf-document");

  const naturalHeight = schedule.scrollHeight;
  let low = naturalHeight > height ? 0.45 : 1;
  let high = naturalHeight > height ? 1 : 1.55;
  for (let i = 0; i < 14; i++) {
    const scale = (low + high) / 2;
    schedule.style.setProperty("--pdf-layout-scale", String(scale));
    if (schedule.scrollHeight <= height) low = scale;
    else high = scale;
  }
  schedule.style.setProperty("--pdf-layout-scale", String(low));
}
function resetScheduleFit() {
  document.querySelectorAll(".project-schedule").forEach((schedule) => {
    schedule.style.zoom = "";
    schedule.style.width = "";
  });
}
function stampOutputTime() {
  const printedAt = formatDateTime();
  document.querySelectorAll(".print-time").forEach((item) => {
    item.textContent = printedAt;
  });
}
function printSchedules() {
  if (!projects.length) return;
  const paper = selectedPaper();
  stampOutputTime();
  $("scheduleList").classList.add("compact-output");
  const pageStyle = document.createElement("style");
  pageStyle.textContent = `@page { size: ${paper.width}mm ${paper.height}mm; margin: ${PRINT_MARGIN_MM}mm; }`;
  document.head.appendChild(pageStyle);
  document.querySelectorAll(".project-schedule").forEach((schedule) =>
    fitScheduleToPage(schedule, paper, PRINT_MARGIN_MM),
  );
  window.addEventListener(
    "afterprint",
    () => {
      $("scheduleList").classList.remove("compact-output");
      resetScheduleFit();
      pageStyle.remove();
    },
    { once: true },
  );
  window.print();
}
function fitCanvasToPage(canvas, ratio) {
  const width = Math.max(canvas.width, Math.ceil(canvas.height / ratio) + 1);
  if (width === canvas.width) return canvas;
  const fitted = document.createElement("canvas");
  fitted.width = width;
  fitted.height = canvas.height;
  const context = fitted.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, canvas.height);
  context.drawImage(canvas, Math.floor((width - canvas.width) / 2), 0);
  return fitted;
}
async function downloadPdf() {
  if (!projects.length) return;
  if (typeof window.html2pdf !== "function")
    return status("PDF download is unavailable. Use Print all and choose Save as PDF.", true);
  const paper = selectedPaper();
  const options = {
    margin: PDF_MARGIN_MM,
    filename: "tup-consulting-procurement-schedules.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      onclone: (clonedDocument) => {
        clonedDocument
          .querySelectorAll(".html2pdf__overlay")
          .forEach((overlay) => (overlay.style.opacity = "1"));
      },
    },
    jsPDF: { unit: "mm", format: paper.format, orientation: "portrait" },
  };
  const ratio = (paper.height - PDF_MARGIN_MM * 2) / (paper.width - PDF_MARGIN_MM * 2);
  const canvases = [];
  stampOutputTime();
  try {
    for (const schedule of document.querySelectorAll(".project-schedule")) {
      const page = document.createElement("div");
      page.className = "schedule-list compact-output pdf-export-source";
      page.id = "pdf-export-source";
      page.setAttribute("aria-hidden", "true");
      const scheduleCopy = schedule.cloneNode(true);
      page.appendChild(scheduleCopy);
      document.body.appendChild(page);
      page.style.width = `${(paper.width - PDF_MARGIN_MM * 2) * MM_TO_PX}px`;
      page.style.margin = "0";
      page.style.padding = "0";
      page.style.overflow = "visible";
      fitPdfScheduleToPage(scheduleCopy, paper, PDF_MARGIN_MM);
      try {
        const canvas = await window
          .html2pdf()
          .set(options)
          .from(page)
          .toCanvas()
          .get("canvas");
        canvases.push(fitCanvasToPage(canvas, ratio));
      } finally {
        page.remove();
      }
    }
    let worker = window
      .html2pdf()
      .set(options)
      .from(canvases[0], "canvas")
      .toPdf();
    canvases.slice(1).forEach((canvas) => {
      worker = worker
        .get("pdf")
        .then((pdf) => pdf.addPage())
        .from(canvas, "canvas")
        .toPdf();
    });
    await worker.save();
  } catch (error) {
    console.error(error);
    status("PDF export could not be completed. Please try again.", true);
  }
}
function renderProjects() {
  const list = $("scheduleList");
  list.innerHTML = projects.map(renderCard).join("");
  $("projectSchedules").hidden = !projects.length;
  $("projectCount").textContent =
    `${projects.length} project${projects.length === 1 ? "" : "s"} ready to print or save as PDF`;
  $("printBtn").disabled = !projects.length;
  $("downloadPdfBtn").disabled = !projects.length;
  list.querySelectorAll(".remove-project").forEach(
    (b) =>
      (b.onclick = () => {
        if (editingProjectId === b.dataset.id) resetProjectEdit();
        projects = projects.filter((p) => p.id !== b.dataset.id);
        persist();
        renderProjects();
        status("Project schedule removed.");
      }),
  );
  list.querySelectorAll(".edit-project").forEach(
    (b) => (b.onclick = () => beginProjectEdit(b.dataset.id)),
  );
  list.querySelectorAll(".adjust-input").forEach(
    (input) =>
      (input.onchange = () => {
        const v = Number(input.value),
          err = input.nextElementSibling;
        if (!Number.isInteger(v) || v < 0 || v > 3650) {
          input.setAttribute("aria-invalid", "true");
          err.textContent = "Use a whole number from 0 to 3,650.";
          return;
        }
        projects.find((p) => p.id === input.dataset.id).adjustments[
          input.dataset.index
        ] = v;
        persist();
        renderProjects();
      }),
  );
}
function addProject(e) {
  e.preventDefault();
  if (!validate())
    return status(
      "Review the highlighted fields before adding this project.",
      true,
    );
  const existing = projects.find((project) => project.id === editingProjectId);
  const p = {
    id: editingProjectId || (crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`),
    title: $("projectTitle").value.trim(),
    budget: money($("projectBudget").value),
    startActivity: +$("startActivity").value,
    startDate: $("startDate").value,
    startTime: $("startTime").value,
    endTime: $("endTime").value,
    adjustments: existing?.adjustments || {},
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  const wasEditing = Boolean(editingProjectId);
  projects = wasEditing
    ? projects.map((project) => (project.id === editingProjectId ? p : project))
    : [...projects, p];
  editingProjectId = null;
  persist();
  renderProjects();
  $("schedulerForm").reset();
  $("startActivity").value = "0";
  $("generateBtn").textContent = "Add project schedule";
  $("cancelEditBtn").hidden = true;
  status(wasEditing ? `Updated “${p.title}”.` : `Added “${p.title}”. You can now enter another project.`);
}
function beginProjectEdit(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  editingProjectId = id;
  $("projectTitle").value = project.title;
  $("projectBudget").value = Number(project.budget).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  $("startActivity").value = String(project.startActivity);
  $("startDate").value = project.startDate;
  $("startTime").value = project.startTime || "";
  $("endTime").value = project.endTime || "";
  $("generateBtn").textContent = "Save changes";
  $("cancelEditBtn").hidden = false;
  status(`Editing “${project.title}”. Update the fields and save your changes.`);
  $("schedulerForm").scrollIntoView({ behavior: "smooth", block: "start" });
  $("projectTitle").focus({ preventScroll: true });
}
function resetProjectEdit() {
  editingProjectId = null;
  $("schedulerForm").reset();
  $("startActivity").value = "0";
  $("generateBtn").textContent = "Add project schedule";
  $("cancelEditBtn").hidden = true;
}
function restore() {
  $("startActivity").innerHTML = activities
    .map((a, i) => `<option value="${i}">${a.name}</option>`)
    .join("");
  try {
    const h = JSON.parse(localStorage.getItem("consultingHolidays"));
    if (Array.isArray(h)) holidays = [...new Set(h.filter(validDate))].sort();
    const saved = JSON.parse(localStorage.getItem("consultingProjects"));
    if (Array.isArray(saved))
      projects = saved
        .filter(
          (p) =>
            p &&
            typeof p.id === "string" &&
            typeof p.title === "string" &&
            money(p.budget) !== null &&
            validDate(p.startDate) &&
            Number.isInteger(p.startActivity) &&
            p.startActivity >= 0 &&
            p.startActivity < activities.length,
        )
        .map((p) => ({
          ...p,
          startTime: p.startTime || "",
          endTime: p.endTime || "",
          adjustments: p.adjustments || {},
        }));
  } catch {
    localStorage.removeItem("consultingProjects");
  }
  renderHolidays();
  renderCalendar();
  renderProjects();
}
$("schedulerForm").onsubmit = addProject;
$("cancelEditBtn").onclick = () => {
  resetProjectEdit();
  status("Project edit cancelled.");
};
$("holidayPrevMonth").onclick = () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1, 12);
  renderCalendar();
};
$("holidayNextMonth").onclick = () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1, 12);
  renderCalendar();
};
$("holidayCalendarDays").onclick = (event) => {
  const day = event.target.closest("button[data-date]");
  if (day) toggleHoliday(day.dataset.date);
};
$("clearHolidaysBtn").onclick = () => {
  holidays = [];
  persist();
  renderHolidays();
  renderCalendar();
  renderProjects();
  status("Non-working dates cleared.");
};
$("saveHolidaysBtn").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(holidays, null, 2)], { type: "application/json" }),
  );
  a.download = "tup-manila-non-working-dates.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
$("loadHolidaysBtn").onclick = () => {
  const f = $("loadHolidaysFile").files[0];
  if (!f || f.size > 1048576)
    return status(
      f
        ? "The holiday list must be smaller than 1 MB."
        : "Choose a JSON holiday list to load.",
      true,
    );
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!Array.isArray(d) || d.some((x) => !validDate(x))) throw 0;
      holidays = [...new Set(d)].sort();
      persist();
      renderHolidays();
      renderCalendar();
      renderProjects();
      status("Holiday list loaded.");
    } catch {
      status("Invalid holiday list. Use valid YYYY-MM-DD dates.", true);
    }
  };
  r.onerror = () => status("The selected file could not be read.", true);
  r.readAsText(f);
};
$("printBtn").onclick = printSchedules;
$("downloadPdfBtn").onclick = downloadPdf;
$("projectBudget").onblur = () => {
  const n = money($("projectBudget").value);
  if (n !== null) $("projectBudget").value = peso(n).replace("₱", "").trim();
};
restore();
