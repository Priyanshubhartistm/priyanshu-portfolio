// Priyanshu Bharti — Portfolio
// Shared behaviour: mobile nav toggle, FAQ accordion, contact form.

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initAccordion();
  initContactForm();
  initNavScrollState();
  initScrollReveal();
  initCounters();
  initLiveOssStats();
});

/* ---------- Nav scroll state ---------- */
function initNavScrollState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  };

  document.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ---------- Scroll reveal ----------
   Any element with class="reveal-group" has its direct children
   promoted to class="reveal" and given a staggered transition delay.
   Standalone elements can also carry class="reveal" directly. */
function initScrollReveal() {
  document.querySelectorAll(".reveal-group").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add("reveal");
      child.style.setProperty("--reveal-delay", `${Math.min(i * 70, 480)}ms`);
    });
  });

  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  targets.forEach((t) => observer.observe(t));
}

/* ---------- Number counters ----------
   Elements with data-counter="20" (optionally data-suffix="+" or "k")
   count up from 0 once they scroll into view. Initial text should
   already show the final value so the page reads correctly with JS off. */
function initCounters() {
  const els = document.querySelectorAll("[data-counter]");
  if (!els.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  els.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || "";
  const decimals = el.dataset.counter.includes(".") ? 1 : 0;
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value)) + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    }
  }

  requestAnimationFrame(tick);
}

/* ---------- Live "PRs Merged" counts from GitHub ----------
   Elements with data-gh-org="orgname" (used on the Open Source page)
   get their merged-PR count fetched live from the GitHub Search API and
   re-animated in once it arrives, so the number updates itself the next
   time someone loads the page after a PR gets merged — no manual editing.
   Falls back silently to the static number already in the HTML if the
   request fails or the visitor is offline (GitHub's unauthenticated
   search API is rate-limited, so this is expected occasionally). Results
   are cached in localStorage for an hour so repeat page loads don't
   re-fetch unnecessarily. */
function initLiveOssStats() {
  const els = document.querySelectorAll("[data-gh-org]");
  if (!els.length) return;

  const AUTHOR = "Priyanshubhartistm";
  const CACHE_TTL = 60 * 60 * 1000;

  els.forEach(async (el) => {
    const org = el.dataset.ghOrg;
    const cacheKey = `gh-pr-count-${org}`;

    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        applyLiveCount(el, cached.count);
        return;
      }
    } catch (e) {
      // corrupt cache entry — ignore and fall through to a fresh fetch
    }

    try {
      const query = `is:pr is:merged author:${AUTHOR} org:${org}`;
      const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.total_count !== "number") return;

      localStorage.setItem(cacheKey, JSON.stringify({ count: data.total_count, ts: Date.now() }));
      applyLiveCount(el, data.total_count);
    } catch (e) {
      // network error / offline — keep whatever is already on screen
    }
  });
}

function applyLiveCount(el, count) {
  el.dataset.counter = String(count);
  animateCounter(el);
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        other.querySelector(".accordion-panel").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.getElementById("formNote");
    if (note) {
      note.textContent = "Thanks! This is a placeholder form — wire it up to your backend or a form service (e.g. Formspree) to receive messages.";
    }
    form.reset();
  });
}
