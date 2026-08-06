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
  projects = [];
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
function renderHolidays() {
  const list = $("holidayList");
  list.innerHTML = holidays.length
    ? `<p class="field-hint">${holidays.length} non-working date${holidays.length === 1 ? "" : "s"} added.</p><ul>${holidays.map((d) => `<li>${formatDate(localDate(d))}<button class="remove-holiday" data-date="${d}" type="button" aria-label="Remove ${formatDate(localDate(d))}">×</button></li>`).join("")}</ul>`
    : '<p class="field-hint">No additional non-working dates. Weekends are always excluded.</p>';
  list.querySelectorAll("button").forEach(
    (b) =>
      (b.onclick = () => {
        holidays = holidays.filter((d) => d !== b.dataset.date);
        persist();
        renderHolidays();
        renderProjects();
      }),
  );
}
function addHoliday() {
  const d = $("holidayPicker").value;
  if (!validDate(d))
    return fieldError("holidayPicker", "Choose a valid date to add.");
  if (holidays.includes(d))
    return fieldError("holidayPicker", "That date is already included.");
  holidays.push(d);
  holidays.sort();
  $("holidayPicker").value = "";
  fieldError("holidayPicker", "");
  persist();
  renderHolidays();
  renderProjects();
  status("Non-working date added.");
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
  return `<article class="project-schedule" data-id="${p.id}"><header class="print-project-header"><img src="tup_logo.png" alt=""><div><p>Technological University of the Philippines – Manila</p><strong>Consulting Services Procurement Scheduler</strong><span>2016 Revised IRR of RA 9184 · Annex “C”</span></div></header><div class="schedule-heading"><div><p class="eyebrow">Generated procurement timeline</p><h3>${escape(p.title)}</h3></div><button type="button" class="button button-danger remove-project" data-id="${p.id}">Remove project</button></div><div class="display-details"><div><span class="detail-label">Project title</span><span class="detail-value">${escape(p.title)}</span></div><div><span class="detail-label">Approved Budget for the Contract</span><span class="detail-value">${peso(p.budget)}</span></div><div><span class="detail-label">Start date and time</span><span class="detail-value">${formatDate(start)} · ${formatTime(p.startTime)}</span></div><div><span class="detail-label">End time</span><span class="detail-value">${formatTime(p.endTime)}</span></div></div><div class="table-container" tabindex="0"><table><thead><tr><th>Procurement activity</th><th>Minimum days</th><th>Maximum days</th><th>Additional days</th><th>Scheduled date</th><th>Elapsed calendar days</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.a.name}</td><td>${r.a.min}</td><td>${r.a.max}</td><td><input class="adjust-input" type="number" min="0" max="3650" step="1" value="${r.extra}" data-id="${p.id}" data-index="${r.i}" aria-label="Additional days for ${r.a.name}"><span class="row-error"></span></td><td>${formatDate(r.d)}</td><td>${between(start, r.d)}</td></tr>`).join("")}</tbody><tfoot><tr><th colspan="5">Total calendar days</th><td>${between(start, last.d).toLocaleString("en-PH")}</td></tr></tfoot></table></div><footer class="schedule-footer"><div class="signature"><p>Prepared by:</p><div class="signature-line"></div><p class="signature-note">Name and signature</p></div><p class="printed-date">Created: ${formatDateTime(new Date(p.createdAt))}<br>Printed: <span class="print-time">${formatDateTime()}</span></p></footer></article>`;
}
function renderProjects() {
  const list = $("scheduleList");
  list.innerHTML = projects.map(renderCard).join("");
  $("projectSchedules").hidden = !projects.length;
  $("projectCount").textContent =
    `${projects.length} project${projects.length === 1 ? "" : "s"} ready to print`;
  $("printBtn").disabled = !projects.length;
  list.querySelectorAll(".remove-project").forEach(
    (b) =>
      (b.onclick = () => {
        projects = projects.filter((p) => p.id !== b.dataset.id);
        persist();
        renderProjects();
        status("Project schedule removed.");
      }),
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
  const p = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    title: $("projectTitle").value.trim(),
    budget: money($("projectBudget").value),
    startActivity: +$("startActivity").value,
    startDate: $("startDate").value,
    startTime: $("startTime").value,
    endTime: $("endTime").value,
    adjustments: {},
    createdAt: new Date().toISOString(),
  };
  projects.push(p);
  persist();
  renderProjects();
  $("schedulerForm").reset();
  $("startActivity").value = "0";
  status(`Added “${p.title}”. You can now enter another project.`);
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
  renderProjects();
}
$("schedulerForm").onsubmit = addProject;
$("addHolidayBtn").onclick = addHoliday;
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
      renderProjects();
      status("Holiday list loaded.");
    } catch {
      status("Invalid holiday list. Use valid YYYY-MM-DD dates.", true);
    }
  };
  r.onerror = () => status("The selected file could not be read.", true);
  r.readAsText(f);
};
$("printBtn").onclick = () => {
  document
    .querySelectorAll(".print-time")
    .forEach((n) => (n.textContent = formatDateTime()));
  window.print();
};
$("projectBudget").onblur = () => {
  const n = money($("projectBudget").value);
  if (n !== null) $("projectBudget").value = peso(n).replace("₱", "").trim();
};
restore();

(() => {
  const countEl = $("visitorCount");
  if (!countEl) return;
  const NAMESPACE = "tup-manila-procurement-scheduler";
  const KEY = "site-visits";
  const animateCount = (target) => {
    const duration = 900;
    let start = null;
    const tick = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      countEl.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else countEl.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
  };
  fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`)
    .then((res) => {
      if (!res.ok) throw new Error("Counter unavailable");
      return res.json();
    })
    .then((data) => animateCount(data.value))
    .catch(() => {
      countEl.textContent = "—";
      countEl.classList.add("visitor-count-error");
    });
})();
