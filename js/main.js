const nav = document.querySelector("#nav");
const menuBtn = document.querySelector(".menu-btn");
const year = document.querySelector("#year");
const video = document.querySelector("#hero-video");
const filmToggle = document.querySelector(".film-toggle");

year.textContent = String(new Date().getFullYear());

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const onScroll = () => {
  nav.classList.toggle("scrolled", window.scrollY > 24);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav nav a")];

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
);

sections.forEach((section) => spy.observe(section));

const setFilmLabel = () => {
  const paused = video.paused;
  filmToggle.textContent = paused ? "Play film" : "Pause film";
  filmToggle.setAttribute("aria-pressed", paused ? "true" : "false");
};

filmToggle.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  setFilmLabel();
});

const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dots = carousel.querySelector(".carousel-dots");
  let index = 0;

  const go = (next) => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dots.children].forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show recommendation ${slideIndex + 1}`);
    dot.addEventListener("click", () => go(slideIndex));
    dots.append(dot);
  });

  carousel.querySelector(".prev").addEventListener("click", () => go(index - 1));
  carousel.querySelector(".next").addEventListener("click", () => go(index + 1));
  go(0);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.transition = "none";
  }
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  video.pause();
  video.removeAttribute("autoplay");
  setFilmLabel();
}
