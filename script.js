document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const revealItems = document.querySelectorAll(".reveal");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.querySelector(".form-success");

  const closeMobileMenu = () => {
    burger?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    if (mobileMenu) mobileMenu.hidden = true;
    document.body.style.overflow = "";
  };

  burger?.addEventListener("click", () => {
    const isOpen = burger.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.hidden = !isOpen;
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
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

      if (id === "#top") {
        event.preventDefault();
        closeMobileMenu();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".channel-card");

  const applyFilter = (filter) => {
    if (!filter) return;
    cards.forEach((card) => {
      const categories = card.dataset.category?.split(" ") || [];
      card.classList.toggle("is-hidden", !categories.includes(filter));
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      if (!filter) return;

      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-selected", String(c === chip));
      });

      applyFilter(filter);
    });
  });

  applyFilter(document.querySelector(".chip.is-active")?.dataset.filter || "print");

  const statCards = document.querySelectorAll(".stat-card");
  const statsScreen = document.getElementById("stats");

  if (statCards.length && statsScreen) {
    let played = false;

    const revealStats = () => {
      if (played) return;
      played = true;
      statCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("is-visible");
        }, index * 180);
      });
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealStats();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    statsObserver.observe(statsScreen);

    document.querySelector(".hero__go")?.addEventListener("click", (event) => {
      event.preventDefault();
      statsScreen.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const channelCards = document.querySelectorAll(".channel-card");
  if (channelCards.length) {
    const channelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            channelObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    channelCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 60}ms`;
      channelObserver.observe(card);
    });
  }

  const productionVideo = document.querySelector(".section-video-strip__player");

  if (productionVideo) {
    const playVideo = () => {
      productionVideo.muted = true;
      productionVideo.play().catch(() => {});
    };

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            productionVideo.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    videoObserver.observe(productionVideo);
  }
});
