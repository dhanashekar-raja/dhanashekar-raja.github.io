const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const stack = document.querySelector(".page-stack");
const pages = Array.from(document.querySelectorAll(".page"));
const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));
const prevButton = document.querySelector('[data-direction="prev"]');
const nextButton = document.querySelector('[data-direction="next"]');
const dotsContainer = document.querySelector(".page-dots");

let activeIndex = 0;

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const setActiveState = (index) => {
  activeIndex = index;

  pages.forEach((page, pageIndex) => {
    page.classList.toggle("is-active", pageIndex === index);
  });

  navAnchors.forEach((anchor) => {
    const isActive = anchor.getAttribute("href") === `#${pages[index].id}`;
    anchor.classList.toggle("is-active", isActive);
  });

  Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  if (prevButton) {
    prevButton.disabled = index === 0;
  }

  if (nextButton) {
    nextButton.disabled = index === pages.length - 1;
  }
};

const scrollToPage = (index) => {
  const target = pages[index];
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

pages.forEach((page, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "page-dot";
  dot.setAttribute("aria-label", `Go to ${page.dataset.pageLabel || page.id}`);
  dot.addEventListener("click", () => scrollToPage(index));
  dotsContainer.appendChild(dot);
});

if (stack) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      const index = pages.indexOf(visibleEntry.target);
      if (index >= 0) {
        setActiveState(index);
      }
    },
    {
      root: stack,
      threshold: 0.55,
    }
  );

  pages.forEach((page) => observer.observe(page));
}

if (prevButton) {
  prevButton.addEventListener("click", () => scrollToPage(Math.max(activeIndex - 1, 0)));
}

if (nextButton) {
  nextButton.addEventListener("click", () => scrollToPage(Math.min(activeIndex + 1, pages.length - 1)));
}

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    if (navLinks && navLinks.classList.contains("is-open")) {
      navLinks.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });
});

window.addEventListener("keydown", (event) => {
  const targetTag = document.activeElement?.tagName;
  const isTypingContext = ["INPUT", "TEXTAREA", "SELECT"].includes(targetTag);

  if (isTypingContext) {
    return;
  }

  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    scrollToPage(Math.min(activeIndex + 1, pages.length - 1));
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    scrollToPage(Math.max(activeIndex - 1, 0));
  }
});

setActiveState(0);
