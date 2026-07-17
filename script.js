// Reveal-on-scroll, matching the brand book's staggered fade.
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 60 + "ms";
    io.observe(el);
  });
} else {
  document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
}
