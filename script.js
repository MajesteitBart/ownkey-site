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

// Hero demo player: swaps the native controls for the site-styled glass UI.
// Without JS the <video controls> fallback stays; .ready gates the custom UI.
const player = document.querySelector(".player");
if (player) {
  const video = player.querySelector("video");
  const big = player.querySelector(".pbig");
  const ui = player.querySelector(".pui");
  const toggle = player.querySelector(".ptoggle");
  const track = player.querySelector(".ptrack");
  const fill = player.querySelector(".pfill");
  const cur = player.querySelector(".pcur");
  const len = player.querySelector(".plen");
  const dur = player.querySelector(".pdur");
  const mute = player.querySelector(".pmute");
  const fs = player.querySelector(".pfs");

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const paint = () => {
    const d = video.duration || 0;
    const t = video.currentTime;
    fill.style.width = d ? (t / d) * 100 + "%" : "0%";
    cur.textContent = fmt(t);
    track.setAttribute("aria-valuenow", Math.floor(t));
    track.setAttribute("aria-valuetext", `${fmt(t)} of ${fmt(d)}`);
  };
  const setLen = () => {
    if (!isFinite(video.duration)) return;
    len.textContent = dur.textContent = fmt(video.duration);
    track.setAttribute("aria-valuemax", Math.floor(video.duration));
  };

  video.removeAttribute("controls");
  player.classList.add("ready");
  if (video.readyState >= 1) setLen();
  else video.addEventListener("loadedmetadata", setLen);

  const setState = (s) => {
    player.dataset.state = s;
    toggle.setAttribute("aria-label", s === "playing" ? "Pause" : "Play");
    if (s !== "playing") player.classList.remove("quiet");
  };
  video.addEventListener("play", () => { setState("playing"); wake(); });
  video.addEventListener("pause", () => setState(video.ended ? "ended" : "paused"));
  video.addEventListener("ended", () => setState("ended"));
  video.addEventListener("timeupdate", paint);

  const playPause = () => (video.paused ? video.play() : video.pause());
  big.addEventListener("click", () => video.play());
  toggle.addEventListener("click", playPause);
  video.addEventListener("click", playPause);
  video.addEventListener("dblclick", () => toggleFs());

  mute.addEventListener("click", () => { video.muted = !video.muted; });
  video.addEventListener("volumechange", () => {
    player.dataset.muted = video.muted;
    mute.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
  });

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (player.requestFullscreen) player.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS Safari
  };
  fs.addEventListener("click", toggleFs);
  document.addEventListener("fullscreenchange", () => {
    const on = document.fullscreenElement === player;
    player.dataset.fs = on;
    fs.setAttribute("aria-label", on ? "Exit fullscreen" : "Fullscreen");
  });

  const seekTo = (e) => {
    if (!isFinite(video.duration)) return;
    const r = track.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    video.currentTime = pct * video.duration;
    paint();
  };
  track.addEventListener("pointerdown", (e) => {
    track.setPointerCapture(e.pointerId);
    player.classList.add("scrub");
    seekTo(e);
  });
  track.addEventListener("pointermove", (e) => {
    if (player.classList.contains("scrub")) seekTo(e);
  });
  ["pointerup", "pointercancel"].forEach((t) =>
    track.addEventListener(t, () => player.classList.remove("scrub")));

  const step = (d) => {
    video.currentTime = Math.min(video.duration || 0, Math.max(0, video.currentTime + d));
  };
  player.addEventListener("keydown", (e) => {
    if (e.target.tagName === "BUTTON" && (e.key === " " || e.key === "Enter")) return;
    if (e.key === " " || e.key === "k") playPause();
    else if (e.key === "m") video.muted = !video.muted;
    else if (e.key === "f") toggleFs();
    else if (e.key === "ArrowLeft") step(-5);
    else if (e.key === "ArrowRight") step(5);
    else return;
    e.preventDefault();
  });

  let hideT;
  const wake = () => {
    player.classList.remove("quiet");
    clearTimeout(hideT);
    hideT = setTimeout(() => {
      if (player.dataset.state === "playing" && !player.classList.contains("scrub") &&
          !ui.matches(":hover") && !player.matches(":focus-within"))
        player.classList.add("quiet");
    }, 2600);
  };
  player.addEventListener("pointermove", wake);
  player.addEventListener("pointerleave", () => {
    clearTimeout(hideT);
    if (player.dataset.state === "playing" && !player.matches(":focus-within"))
      player.classList.add("quiet");
  });
}
