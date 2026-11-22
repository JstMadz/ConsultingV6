const activities = [
  ["Pre-Procurement Conference", 1, 1],
  ["Advertisement/Posting of Request for Expression of Interest", 7, 7],
  // RA 12009 IRR 50.3.1: the REI is posted 7 CD; documents are due the day after.
  ["Deadline of Submission and Opening of Short-listing Documents", 1, 1],
  // IRR 53.1.4: eligibility checking and short-listing in 20 CD at most.
  ["Eligibility Check and Shortlisting", 1, 20],
  // IRR 53.1.4: the BAC recommends the short-list to the HoPE; the date is tentative.
  ["Approval of Short-list by the HOPE", 1, 20],
  ["Pre-Bid Conference", 1, 12],
  ["Deadline of Submission and Opening of Bids", 1, 75],
  ["Bid Evaluation", 1, 21],
  ["Approval of Ranking by the HOPE", 1, 2],
  ["Notification for Negotiation", 1, 3],
  ["Negotiation", 1, 10],
  ["Post-Qualification", 2, 30],
  // RA 12009 IRR 66.2: the HoPE acts on the recommendation within 10 CD (15 under the 2016 IRR).
  ["Approval of Resolution/Issuance of Notice of Award", 1, 10],
  ["Contract Preparation and Signing", 1, 10],
  // RA 12009 Sec. 66: higher authority approves within 15 CD; the NTP follows within 3 CD.
  ["Approval of Contract by Higher Authority", 1, 15],
  ["Issuance of Notice to Proceed", 1, 3],
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
function previousWorking(d) {
  const r = new Date(d);
  while (nonWorking(r)) r.setDate(r.getDate() - 1);
  return r;
}
// RA 12009 IRR 51.5.1: clarifications at least 10 CD, bid bulletins at least 7 CD,
// before the deadline. Derived from the deadline row, so saved activity indexes stay valid.
const deadlineLinked = [
  ["Last Day of Clarification from Bidders", 10],
  ["Posting of Supplemental Bid Bulletin", 7],
];
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
// Earliest date of an activity set by another (index: [from index, calendar days]):
// IRR 50.3.1 short-listing documents after the 7 CD posting; IRR 51.2 pre-bid 7 CD after
// the short-list is approved and 12 CD before the deadline. Same table as bidDocsBuilder.
const floors = { 2: [1, 7], 5: [4, 7], 6: [5, 12] };
// The HoPE's approvals: tentative until the HoPE acts (short-list, ranking, award).
const hopeApprovals = [4, 8, 12];
// RA 12009 maximum periods between activities, by index: [from, to, calendar days, basis,
// days after "from" the period starts]. Calendar days include weekends and holidays; a last
// day that is a day off moves to the next working day (IRR 67.3). The schedule is held to
// them, and additional days stop at them. IRR 63.8: 12 CD, which the HoPE may extend to 30.
const MAX_PERIODS = [
  [2, 3, 20, "IRR 53.1.4"],
  [1, 6, 75, "IRR 54.5", 6],
  [6, 7, 21, "IRR 62.4"],
  [7, 8, 2, "IRR 62.2.1"],
  [8, 9, 3, "IRR 62.2.1"],
  [9, 10, 10, "IRR 62.2.5"],
  [10, 11, 30, "IRR 63.8"],
  [11, 12, 10, "IRR 66.2"],
  [6, 12, 60, "IRR 67.1"],
  [12, 13, 10, "IRR 66.5"],
  [13, 14, 15, "RA 12009 Sec. 66"],
  [14, 15, 3, "RA 12009 Sec. 66"],
];
const POST_QUALIFICATION_DAYS = 12;
const lastAllowed = (from, [, , days, , offset = 0]) => nextWorking(addCalendar(from, offset + days));
// The date held to the last day of every maximum ending at activity `i`.
function held(i, d, computed) {
  return MAX_PERIODS.filter(([from, to]) => to === i && computed[from])
    .map((rule) => lastAllowed(computed[rule[0]], rule))
    .reduce((out, last) => (last < out ? last : out), d);
}
function calculate(p, hold = true) {
  let current = localDate(p.startDate),
    computed = {};
  return activities.slice(p.startActivity).map((a, o) => {
    const i = p.startActivity + o,
      // The starting activity falls on the start date; the rest count on from it.
      extra = o === 0 ? 0 : Number(p.adjustments[i] || 0);
    let d = o === 0 ? new Date(current) : addWorking(current, a.min);
    const f = floors[i];
    if (o > 0 && f && computed[f[0]])
      d = new Date(Math.max(d, nextWorking(addCalendar(computed[f[0]], f[1]))));
    d = nextWorking(addWorking(d, extra));
    if (o > 0 && hold) d = held(i, d, computed);
    computed[i] = d;
    current = new Date(d);
    return { a, i, d, extra };
  });
}
// The most additional days activity `i` can take before a maximum running through it is
// passed (counted on dates not held to the maximums), and that maximum; null when none
// limits it.
function extraLimit(p, i) {
  if (!MAX_PERIODS.some(([from, to]) => from < i && i <= to)) return null;
  const passed = (extra) => {
    const d = {};
    calculate({ ...p, adjustments: { ...p.adjustments, [i]: extra } }, false).forEach((r) => (d[r.i] = r.d));
    return MAX_PERIODS.find((rule) => rule[0] < i && i <= rule[1] && d[rule[0]] && d[rule[1]] > lastAllowed(d[rule[0]], rule));
  };
  for (let extra = 0; extra <= 3650; extra++) {
    const rule = passed(extra + 1);
    if (rule) return { max: extra, rule };
  }
  return null;
}
// The additional-days cell: it stops at the legal maximum, and says so there.
function adjustCell(p, r) {
  if (r.i === p.startActivity)
    return `<input class="adjust-input" type="number" min="0" max="3650" step="1" value="${r.extra}" disabled title="The start date of the schedule." data-id="${p.id}" data-index="${r.i}" aria-label="Additional days for ${r.a.name}"><span class="row-error"></span>`;
  const limit = extraLimit(p, r.i);
  const max = limit ? limit.max : 3650;
  const note = limit ? `At the legal maximum: ${limit.rule[2]} CD (${limit.rule[3]})` : "";
  return `<input class="adjust-input" type="number" min="0" max="${max}" step="1" value="${r.extra}" data-id="${p.id}" data-index="${r.i}" data-max="${max}" data-limit="${note}" aria-label="Additional days for ${r.a.name}"><span class="row-error row-limit">${limit && r.extra >= max ? note : ""}</span>`;
}
function withDeadlineLinked(rows) {
  const deadline = rows.find((r) => r.i === 6);
  const prebidAt = rows.findIndex((r) => r.i === 5);
  if (!deadline || prebidAt < 0) return rows;
  const linked = deadlineLinked.map(([name, days]) => ({
    a: { name, min: days, max: days },
    d: previousWorking(addCalendar(deadline.d, -days)),
    derived: true,
  }));
  return [...rows.slice(0, prebidAt + 1), ...linked, ...rows.slice(prebidAt + 1)];
}
// RA 12009 IRR periods, checked on the computed dates (the same checks as the Bidding
// Document Generator). A maximum period ending on a non-working day runs to the next
// working day (IRR 67.3).
function lateBy(from, to, days) {
  return !!from && !!to && to > nextWorking(addCalendar(from, days));
}
function ra12009Notes(rows, budget) {
  const at = (i) => rows.find((r) => r.i === i)?.d;
  const named = (name) => rows.find((r) => r.derived && r.a.name === name)?.d;
  const [posting, docsDeadline, shortlist, shortlistApproval, prebid, deadline] = [1, 2, 3, 4, 5, 6].map(at);
  const [evaluation, ranking, notice, negotiation, postQual, award, signing, approval, ntp] = [7, 8, 9, 10, 11, 12, 13, 14, 15].map(at);
  const clarification = named("Last Day of Clarification from Bidders");
  const bulletin = named("Posting of Supplemental Bid Bulletin");
  const notes = [];
  if (posting && docsDeadline && between(posting, docsDeadline) < 7)
    notes.push(["IRR 50.3.1", "The deadline for short-listing documents falls within the 7 calendar days the REI is posted."]);
  if (shortlistApproval && prebid && between(shortlistApproval, prebid) < 7)
    notes.push(["IRR 51.2", "The pre-bid conference must be at least 7 calendar days after the short-list is approved."]);
  if (prebid && deadline && between(prebid, deadline) < 12)
    notes.push(["IRR 51.2", "The pre-bid conference must be at least 12 calendar days before the bid deadline."]);
  if (clarification && deadline && between(clarification, deadline) < 10)
    notes.push(["IRR 51.5.1", "Requests for clarification must be in at least 10 calendar days before the bid deadline."]);
  if (bulletin && deadline && between(bulletin, deadline) < 7)
    notes.push(["IRR 51.5.1", "Bid bulletins must be issued at least 7 calendar days before the bid deadline."]);
  // Posting runs 7 CD from the advertisement date (IRR 50.3.1); 53.1.4 and 54.5 count from its last day.
  const lastPostingDay = posting && addCalendar(posting, 6);
  if (lateBy(docsDeadline, shortlist, 20))
    notes.push(["IRR 53.1.4", "Eligibility checking and short-listing should take no more than 20 calendar days."]);
  if (lateBy(lastPostingDay, deadline, 75))
    notes.push(["IRR 54.5", "The bid deadline is more than 75 calendar days after the last day of posting."]);
  if (lateBy(deadline, evaluation, 21))
    notes.push(["IRR 62.4", "The evaluation must be done within 21 calendar days after the bid deadline."]);
  if (lateBy(evaluation, ranking, 2))
    notes.push(["IRR 62.2.1", "The HoPE acts on the ranking within 2 calendar days after receiving the evaluation."]);
  if (lateBy(ranking, notice, 3))
    notes.push(["IRR 62.2.1", "The consultant with the Highest Rated Bid is invited to negotiate within 3 calendar days."]);
  if (lateBy(notice, negotiation, 10))
    notes.push(["IRR 62.2.5", "Negotiations with one consultant should be completed within 10 calendar days."]);
  if (lateBy(negotiation, postQual, 30))
    notes.push(["IRR 63.8", "Post-qualification may not exceed 30 calendar days in all from the end of negotiation, even when the HoPE extends it."]);
  if (lateBy(postQual, award, 10))
    notes.push(["IRR 66.2", "The HoPE approves the award within 10 calendar days from the BAC resolution."]);
  if (lateBy(deadline, award, 60))
    notes.push(["IRR 67.1", "From the opening of bids to the award must not exceed 60 calendar days."]);
  if (lateBy(award, signing, 10))
    notes.push(["IRR 66.5", "The contract is signed within 10 calendar days from receipt of the Notice of Award."]);
  if (lateBy(signing, approval, 15))
    notes.push(["RA 12009 Sec. 66", "When higher approval is needed, the approving authority acts within 15 calendar days from receipt of the contract."]);
  if (lateBy(approval, ntp, 3))
    notes.push(["RA 12009 Sec. 66", "The Notice to Proceed is issued within 3 calendar days from the approval of the contract."]);
  const extended = negotiation && postQual && !lateBy(negotiation, postQual, 30) && between(negotiation, postQual) > POST_QUALIFICATION_DAYS;
  const info =
    (prebid && Number(budget) > 0 && Number(budget) < 3000000
      ? '<p class="ra-info">IRR 51.1: the ABC is below PhP 3,000,000.00, so the pre-bid conference is at the BAC’s discretion.</p>'
      : "") +
    (extended ? "<p class=\"ra-info\">IRR 63.8: past 12 CD of post-qualification, so it needs the HoPE's extension (up to 30 CD).</p>" : "");
  return notes.length
    ? `<div class="ra-notes"><strong>RA 12009 checks</strong><ul>${notes.map(([basis, text]) => `<li><b>${basis}:</b> ${text}</li>`).join("")}</ul>${info}</div>`
    : `<div class="ra-notes ok">Every activity is within the RA 12009 IRR periods.${info}</div>`;
}
function renderCard(p) {
  const start = localDate(p.startDate),
    rows = withDeadlineLinked(calculate(p)),
    last = rows.at(-1);
  return `<article class="project-schedule" data-id="${p.id}">
    <header class="schedule-brand">
      <img src="assets/images/tup-logo.png" alt="">
      <div>
        <p class="university-name">Technological University of the Philippines – Manila</p>
        <p class="document-name">Consulting Services Procurement Schedule · RA 12009 and its IRR</p>
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
        <tbody>${rows.map((r) => r.derived ? `<tr><td>${r.a.name}</td><td>${r.a.min}</td><td>${r.a.max}</td><td title="Counted back from the deadline (RA 12009 IRR 51.5.1).">—</td><td>${formatDate(r.d)}</td><td>${between(start, r.d)}</td></tr>` : `<tr><td>${r.a.name}${hopeApprovals.includes(r.i) && r.i !== p.startActivity ? ' <em class="tentative">(tentative: awaits the HoPE)</em>' : ""}</td><td>${r.a.min}</td><td>${r.a.max}</td><td>${adjustCell(p, r)}</td><td>${formatDate(r.d)}</td><td>${between(start, r.d)}</td></tr>`).join("")}</tbody>
        <tfoot><tr class="total-days-row"><th colspan="5">Total calendar days</th><td>${between(start, last.d).toLocaleString("en-PH")}</td></tr></tfoot>
      </table>
    </div>
    ${ra12009Notes(rows, p.budget)}
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
        const max = Number(input.dataset.max ?? 3650);
        if (!Number.isInteger(v) || v < 0 || v > max) {
          input.setAttribute("aria-invalid", "true");
          err.textContent =
            v > max && input.dataset.limit
              ? `${input.dataset.limit}, so at most ${max} additional day${max === 1 ? "" : "s"}.`
              : `Use a whole number from 0 to ${max.toLocaleString("en-PH")}.`;
          return;
        }
        projects.find((p) => p.id === input.dataset.id).adjustments[
          input.dataset.index
        ] = v;
        persist();
        // Re-render after the input's blur; replacing it mid-event throws NotFoundError.
        window.setTimeout(renderProjects, 0);
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
    version: 2,
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
// Version 2 (2026-11-16) added rows 2 (short-listing documents deadline) and 4 (HoPE
// approval of the short-list), and the starting activity now falls on the start date.
// Older saved projects move to the new indexes and keep their dates.
const v1Index = (i) => (i < 2 ? i : i === 2 ? 3 : i + 2);
function upgrade(p) {
  if (p.version >= 2) return p;
  const adjustments = Object.fromEntries(
    Object.entries(p.adjustments).map(([i, v]) => [String(v1Index(Number(i))), v]),
  );
  const startActivity = v1Index(p.startActivity);
  const firstExtra = Number(p.adjustments[p.startActivity] || 0);
  const first = nextWorking(addWorking(localDate(p.startDate), activities[startActivity].min + firstExtra));
  return { ...p, adjustments, startActivity, startDate: isoDate(first), version: 2 };
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
        .map((p) =>
          upgrade({
            ...p,
            startTime: p.startTime || "",
            endTime: p.endTime || "",
            adjustments: p.adjustments || {},
          }),
        );
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
