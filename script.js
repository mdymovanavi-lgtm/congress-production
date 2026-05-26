const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const revealItems = document.querySelectorAll(".reveal");
const tabButtons = document.querySelectorAll(".tabs__btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.querySelector(".form-success");

burger?.addEventListener("click", () => {
  const isOpen = burger.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.hidden = !isOpen;
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    document.body.style.overflow = "";
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn === button);
      btn.setAttribute("aria-selected", String(btn === button));
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.panel === tab;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

document.querySelectorAll(".row-item--link").forEach((row) => {
  row.addEventListener("mouseenter", () => {
    document.querySelectorAll(".row-item--link").forEach((item) => {
      item.classList.remove("row-item--active");
    });
    row.classList.add("row-item--active");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  formSuccess.hidden = false;
  setTimeout(() => {
    formSuccess.hidden = true;
  }, 5000);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const initCustomCursor = () => {
  const finePointer = window.matchMedia("(pointer: fine)");
  const desktop = window.matchMedia("(min-width: 992px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const canUseCursor = () =>
    finePointer.matches && desktop.matches && !reducedMotion.matches;

  const amount = 16;
  const sineDots = 5;
  const dotSize = 24;
  const idleDelay = 150;

  const cursor = document.createElement("div");
  cursor.className = "site-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  const icon = document.createElement("img");
  icon.className = "site-cursor__icon";
  icon.src = "assets/brand/arrow-white.svg";
  icon.alt = "";
  icon.draggable = false;
  cursor.appendChild(icon);

  const trail = document.createElement("div");
  trail.className = "site-cursor__trail";
  cursor.appendChild(trail);

  const dots = [];

  for (let i = 0; i < amount; i += 1) {
    const element = document.createElement("span");
    const scale = 1 - i * 0.045;
    element.style.transform = `scale(${scale})`;
    trail.appendChild(element);
    dots.push({
      element,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale,
      lockX: 0,
      lockY: 0,
      angleX: Math.random() * Math.PI * 2,
      angleY: Math.random() * Math.PI * 2,
      range: dotSize / 2 - (dotSize / 2) * scale + 2,
    });
  }

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let idle = false;
  let idleTimer;

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idle = false;
    idleTimer = setTimeout(() => {
      idle = true;
      dots.forEach((dot) => {
        dot.lockX = dot.x;
        dot.lockY = dot.y;
        dot.angleX = Math.random() * Math.PI * 2;
        dot.angleY = Math.random() * Math.PI * 2;
      });
    }, idleDelay);
  };

  const onMove = (x, y) => {
    pointerX = x;
    pointerY = y;
    resetIdleTimer();
  };

  const enable = () => {
    document.body.classList.add("has-custom-cursor");
    resetIdleTimer();
  };

  const disable = () => {
    document.body.classList.remove("has-custom-cursor");
    cursor.hidden = true;
    clearTimeout(idleTimer);
  };

  const show = () => {
    cursor.hidden = false;
    enable();
  };

  window.addEventListener("mousemove", (event) => onMove(event.clientX, event.clientY));

  const render = () => {
    icon.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;

    let x = pointerX - dotSize / 2;
    let y = pointerY - dotSize / 2;

    dots.forEach((dot, index) => {
      const follow = 0.34 - index * 0.008;

      if (!idle || index <= sineDots) {
        dot.x += (x - dot.x) * follow;
        dot.y += (y - dot.y) * follow;
      } else {
        dot.angleX += 0.05;
        dot.angleY += 0.05;
        dot.y = dot.lockY + Math.sin(dot.angleY) * dot.range;
        dot.x = dot.lockX + Math.sin(dot.angleX) * dot.range;
      }

      dot.element.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${dot.scale})`;

      x = dot.x;
      y = dot.y;
    });

    requestAnimationFrame(render);
  };

  const sync = () => {
    if (canUseCursor()) {
      show();
    } else {
      disable();
    }
  };

  finePointer.addEventListener("change", sync);
  desktop.addEventListener("change", sync);
  reducedMotion.addEventListener("change", sync);

  if (canUseCursor()) {
    show();
    render();
  } else {
    disable();
  }
};

initCustomCursor();
