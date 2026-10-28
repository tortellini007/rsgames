// Mobiles Menü
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Aktiven Menüpunkt beim Scrollen markieren
const links = [...nav.querySelectorAll("a")];
const sections = links
  .filter((a) => a.getAttribute("href").startsWith("#"))
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));

// Bildergalerie im „Featured Game“
document.querySelectorAll("[data-carousel]").forEach((root) => {
  const slides = [...root.querySelectorAll(".slide")];
  const thumbs = [...root.querySelectorAll(".thumb")];
  let i = 0;
  let timer;

  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
    thumbs.forEach((t, k) => {
      t.classList.toggle("is-active", k === i);
      t.setAttribute("aria-selected", String(k === i));
    });
  };
  const restart = () => {
    clearInterval(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => show(i + 1), 6000);
  };

  root.querySelector(".prev").addEventListener("click", () => { show(i - 1); restart(); });
  root.querySelector(".next").addEventListener("click", () => { show(i + 1); restart(); });
  thumbs.forEach((t, k) => t.addEventListener("click", () => { show(k); restart(); }));
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  restart();
});
