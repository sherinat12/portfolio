(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- THEME TOGGLE ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }
  updateThemeButton();

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeButton();
  });

  function updateThemeButton() {
    var isLight = root.getAttribute("data-theme") === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }

  /* ---------- MOBILE NAV ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primary-nav");

  navToggle.addEventListener("click", function () {
    var isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  document.querySelectorAll(".navlink").forEach(function (link) {
    link.addEventListener("click", function () {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- SCROLL SPY (active nav link) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".navlink"));

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ---------- SCROLL REVEAL ---------- */
  var revealTargets = document.querySelectorAll(
    ".about__grid, .skills__grid, .project-card, .timeline__item, .edu-item, .cert-card, .contact__grid"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- SKILL BARS ---------- */
  var skillBars = document.querySelectorAll(".skillbar");
  var skillObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var level = bar.getAttribute("data-level") || "0";
          var fill = bar.querySelector(".skillbar__fill");
          requestAnimationFrame(function () { fill.style.width = level + "%"; });
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach(function (bar) { skillObserver.observe(bar); });

  /* ---------- TERMINAL TYPEWRITER ---------- */
  var terminalBody = document.getElementById("terminalBody");
  var script = [
    { type: "prompt", text: "$ whoami" },
    { type: "out", text: "raja_sherina_t — final-year CSE student" },
    { type: "prompt", text: "$ role --current" },
    { type: "role", text: "Full-Stack Developer & Problem Solver" },
    { type: "prompt", text: "$ status" },
    { type: "out", text: "> open to internships & entry-level roles" },
    { type: "prompt", text: "$ skills --top" },
    { type: "out", text: "React · JavaScript · MySQL · C" }
  ];

  function typeTerminal() {
    if (!terminalBody) return;
    if (reduceMotion) {
      var plain = script
        .map(function (l) { return (l.type === "prompt" ? l.text : l.text); })
        .join("\n");
      terminalBody.textContent = plain;
      return;
    }

    var lineIndex = 0;
    var charIndex = 0;
    var currentLineEl = null;

    function nextChar() {
      if (lineIndex >= script.length) {
        var cursor = document.createElement("span");
        cursor.className = "cursor";
        terminalBody.appendChild(cursor);
        return;
      }
      var line = script[lineIndex];
      if (charIndex === 0) {
        currentLineEl = document.createElement("div");
        currentLineEl.className = "line-" + line.type;
        terminalBody.appendChild(currentLineEl);
      }
      charIndex++;
      currentLineEl.textContent = line.text.slice(0, charIndex);

      if (charIndex >= line.text.length) {
        lineIndex++;
        charIndex = 0;
        setTimeout(nextChar, line.type === "prompt" ? 260 : 420);
      } else {
        setTimeout(nextChar, line.type === "prompt" ? 38 : 22);
      }
    }
    nextChar();
  }

  var heroObserver = new IntersectionObserver(
    function (entries, obs) {
      if (entries[0].isIntersecting) {
        typeTerminal();
        obs.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  var heroSection = document.getElementById("hero");
  if (heroSection) heroObserver.observe(heroSection);

  /* ---------- NAVBAR SHADOW ON SCROLL ---------- */
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    navbar.style.borderBottomColor = window.scrollY > 12
      ? "var(--border)"
      : "transparent";
  }, { passive: true });

  /* ---------- SCROLL TO TOP ---------- */
  var scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", function () {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- CONTACT FORM ---------- */
  var form = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in every field before sending.";
      formStatus.style.color = "var(--danger)";
      return;
    }

    // No backend is wired up yet — fall back to opening the visitor's email client.
    var subject = encodeURIComponent("Portfolio contact from " + name);
    var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
    window.location.href = "mailto:rajasherinaa@gmail.com?subject=" + subject + "&body=" + body;

    formStatus.style.color = "var(--accent-3)";
    formStatus.textContent = "Opening your email client to send this message…";
    form.reset();
  });

  /* ---------- FOOTER YEAR ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
