(() => {
  const countEl = document.getElementById("visitorCount");
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
