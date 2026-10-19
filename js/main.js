/* Elite Home Staging — site behaviour.
   No dependencies. Each block guards on its own markup, so a page only
   runs what it actually contains. */
(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- header */
  const bar = $(".head-bar");
  if (bar) {
    const mark = () => bar.setAttribute("data-stuck", String(window.scrollY > 8));
    mark();
    window.addEventListener("scroll", mark, { passive: true });
  }

  /* ------------------------------------------------------ mobile nav */
  const burger = $(".burger");
  const nav = $("#nav");
  if (burger && nav) {
    const wide = window.matchMedia("(min-width: 60.01rem)");

    const setNav = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      nav.setAttribute("data-open", String(open));
      document.body.style.overflow = open && !wide.matches ? "hidden" : "";
    };

    burger.addEventListener("click", () => setNav(burger.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setNav(false);
        burger.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (burger.getAttribute("aria-expanded") !== "true") return;
      if (!nav.contains(e.target) && !burger.contains(e.target)) setNav(false);
    });

    wide.addEventListener("change", () => setNav(false));
    setNav(false);
  }

  /* ------------------------------------------------ gallery + filter */
  const gallery = $("#gallery");
  if (gallery) {
    const shots = $$(".shot", gallery);

    $$(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        const want = btn.dataset.filter;
        $$(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        shots.forEach((shot) => { shot.hidden = want !== "all" && shot.dataset.category !== want; });
        const count = $("#shown-count");
        if (count) count.textContent = String(shots.filter((s) => !s.hidden).length);
      });
    });

    const lb = $("#lb");
    if (lb && typeof lb.showModal === "function") {
      const img = $("#lb-img");
      const cap = $("#lb-cap");
      const pos = $("#lb-pos");
      let i = 0;

      // The viewer walks the photographs the visitor can actually see, within
      // the project they clicked into. Checking the <details> state directly is
      // more reliable than measuring boxes: collapsed details content still
      // reports client rects in Chrome.
      let scope = null;
      const onScreen = (s) => {
        if (s.hidden) return false;
        const more = s.closest("details");
        return !more || more.open;
      };
      const shown = () => shots.filter((s) => onScreen(s) && (!scope || scope.contains(s)));

      const show = (next) => {
        const list = shown();
        if (!list.length) return;
        i = (next + list.length) % list.length;
        const shot = list[i];
        const source = $("img", shot);
        img.src = source.currentSrc || source.src;
        img.alt = source.alt;
        cap.textContent = shot.dataset.title || source.alt;
        pos.textContent = `${i + 1} / ${list.length}`;
      };

      shots.forEach((shot) => {
        shot.addEventListener("click", () => {
          scope = shot.closest(".project");
          show(shown().indexOf(shot));
          lb.showModal();
        });
      });

      $$("[data-dir]", lb).forEach((btn) => {
        btn.addEventListener("click", () => show(i + (btn.dataset.dir === "next" ? 1 : -1)));
      });
      $(".lb__btn--x", lb)?.addEventListener("click", () => lb.close());

      lb.addEventListener("click", (e) => {
        if (e.target === lb || e.target.classList.contains("lb__in")) lb.close();
      });

      lb.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); show(i - 1); }
      });
    } else {
      shots.forEach((shot) => { shot.style.cursor = "default"; });
    }
  }

  /* ------------------------------------------------- contact form UX */
  const form = $("#contact-form");
  if (form) {
    const fieldOf = (el) => el.closest(".f");

    const messageFor = (el) => {
      if (el.validity.valueMissing) return "This field is required.";
      if (el.validity.typeMismatch && el.type === "email") return "Enter a valid email, e.g. name@domain.com.";
      if (el.validity.tooShort) return `Please use at least ${el.minLength} characters.`;
      return el.validationMessage || "Please check this field.";
    };

    const validate = (el) => {
      const field = fieldOf(el);
      if (!field) return el.checkValidity();
      const ok = el.checkValidity();
      const slot = $(".err", field);
      field.setAttribute("data-invalid", String(!ok));
      el.setAttribute("aria-invalid", String(!ok));
      if (slot) slot.textContent = ok ? "" : messageFor(el);
      return ok;
    };

    const fields = $$("input, select, textarea", form).filter((el) => el.type !== "hidden");

    fields.forEach((el) => {
      el.addEventListener("blur", () => validate(el));
      el.addEventListener("input", () => {
        if (fieldOf(el)?.getAttribute("data-invalid") === "true") validate(el);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (fields.map(validate).includes(false)) {
        const bad = fields.find((el) => fieldOf(el)?.getAttribute("data-invalid") === "true");
        bad?.focus();
        bad?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
        return;
      }

      // No backend is wired up yet — see README for how to connect one.
      console.info("Consultation request (not sent):", Object.fromEntries(new FormData(form).entries()));

      form.hidden = true;
      const sent = $("#sent");
      if (sent) { sent.hidden = false; sent.focus(); }
    });
  }

  /* ----------------------------------------------------- footer year */
  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
