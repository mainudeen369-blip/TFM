const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  },
  { passive: true }
);

toggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const revealNodes = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);
revealNodes.forEach((node) => revealObserver.observe(node));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatCount(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function runCount(el) {
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = `${formatCount(target)}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 1400;
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${formatCount(Math.round(target * eased))}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

const filterButtons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-side]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    cards.forEach((card) => {
      const show = value === "all" || card.dataset.side === value;
      card.hidden = !show;
    });
  });
});

const form = document.querySelector("[data-join-form]");
const thanks = document.querySelector("[data-thanks]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  form.hidden = true;
  if (thanks) thanks.hidden = false;
});
