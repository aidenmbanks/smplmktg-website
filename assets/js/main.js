/* SMPL MKTG — site scripts */
(function () {
  "use strict";

  /* ---- Scroll reveals (gentle, hand-made movement) ---- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revSel = ".card, .split > div, .steps .step, .stack-explorer, .dash-teaser, .section > .container > .center, .contact-grid > *";
    var revEls = Array.prototype.slice.call(document.querySelectorAll(revSel));
    revEls.forEach(function (el, i) {
      el.classList.add("reveal-js");
      el.style.transitionDelay = ((i % 3) * 0.08).toFixed(2) + "s";
    });
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); revIO.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revEls.forEach(function (el) { revIO.observe(el); });
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is tapped
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Mark current nav link active ---- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("is-active");
  });

  /* ---- Contact form (Web3Forms) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      show("", "");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            show("Thanks — your message is in. We'll get back to you within one business day.", "ok");
          } else {
            show((data.message || "Something went wrong.") + " You can also email Aiden@smplmktg.com.", "err");
          }
        })
        .catch(function () {
          show("Network hiccup. Please email Aiden@smplmktg.com and we'll jump on it.", "err");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = original; }
        });

      function show(msg, kind) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className = "form-status" + (kind ? " is-visible " + kind : "");
      }
    });
  }

  /* ---- Marketing-stack explorer (homepage) ---- */
  var explorer = document.getElementById("stackExplorer");
  if (explorer) {
    var detail = document.getElementById("stackDetail");
    var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    var ICN = {
      ads:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
      social:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H7l-3 3z"/></svg>',
      seo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
      email:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
      web:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>',
      analytics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-7"/></svg>'
    };
    var SVC = {
      ads:{ name:"Paid ads", lead:"Campaigns across Google, Meta, LinkedIn, and Instagram, built to bring in real leads — not just clicks.",
        points:["Targeting and creative dialed in for your buyers","Conversion tracking so you see true cost-per-lead","Prospecting plus retargeting that follows up","Weekly tuning to cut wasted spend"], tags:["Google","Meta","LinkedIn","Instagram"] },
      social:{ name:"Social & content", lead:"On-brand posts written, designed, and scheduled — so your feed stays alive without eating your week.",
        points:["A monthly content calendar planned for you","Branded graphics and carousels","Captions that actually sound like you","Posting and scheduling, fully handled"], tags:["Strategy","Design","Copywriting","Scheduling"] },
      seo:{ name:"SEO", lead:"Get found when your customers are searching. Rankings that compound month after month.",
        points:["Technical fixes so Google can read your site","Content built around what your buyers search","On-page optimization and schema markup","Local SEO for businesses with a service area"], tags:["Technical","Content","Local"] },
      email:{ name:"Email & automation", lead:"The highest-ROI channel, set up properly — sequences and campaigns that run themselves.",
        points:["Welcome and nurture flows","Newsletters your list looks forward to","Cold outbound that books meetings","Automations wired to your CRM"], tags:["Flows","Newsletters","Outbound"] },
      web:{ name:"Web design", lead:"Clean, fast websites and landing pages designed around one job: turning visitors into enquiries.",
        points:["Conversion-focused design and copy","Fast, mobile-first builds","SEO-ready from day one","Ongoing edits and improvements"], tags:["Landing pages","Full sites","CRO"] },
      analytics:{ name:"Analytics & reporting", lead:"One clear dashboard that shows what's working and where your money goes — no spin, no fluff.",
        points:["Tracking and GA4 set up right","A simple dashboard you'll actually read","Channel and campaign attribution","Plain-English monthly reviews"], tags:["GA4","Dashboards","Reporting"] }
    };
    var renderSvc = function (id) {
      var s = SVC[id]; if (!s) return;
      detail.innerHTML = '<div class="sd-in"><div class="sd-ic">' + ICN[id] + '</div>' +
        '<h3>' + s.name + '</h3><p class="sd-lead">' + s.lead + '</p>' +
        '<div class="sd-points">' + s.points.map(function (p) { return '<div class="sd-point">' + CHECK + '<span>' + p + '</span></div>'; }).join('') + '</div>' +
        '<div class="sd-tags">' + s.tags.map(function (t) { return '<span class="pill">' + t + '</span>'; }).join('') + '</div></div>';
    };
    var tabs = explorer.querySelectorAll(".stack-tab");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.toggle("is-active", x === t); });
        renderSvc(t.getAttribute("data-svc"));
      });
    });
    var initial = explorer.querySelector(".stack-tab.is-active") || tabs[0];
    if (initial) { initial.classList.add("is-active"); renderSvc(initial.getAttribute("data-svc")); }
  }

  /* ---- Dashboard demo: click to expand ---- */
  var dashLaunch = document.getElementById("dashLaunch");
  if (dashLaunch) {
    dashLaunch.addEventListener("click", function () {
      var holder = document.getElementById("dashFrameHolder");
      if (!holder || holder.getAttribute("data-loaded") === "1") return;
      holder.innerHTML = '<iframe src="demo/dashboard.html" title="SMPL MKTG client dashboard demo" loading="lazy" style="width:100%;height:1150px;border:0;border-radius:14px;background:var(--cream);"></iframe>';
      holder.setAttribute("data-loaded", "1");
      var teaser = document.getElementById("dashTeaser");
      if (teaser) teaser.style.display = "none";
    });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
