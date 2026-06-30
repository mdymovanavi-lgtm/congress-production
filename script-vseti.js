document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".channel-card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;

      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-selected", String(c === chip));
      });

      cards.forEach((card) => {
        const categories = card.dataset.category?.split(" ") || [];
        const show = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

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
});
