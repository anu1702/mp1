const navbar = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".navbar a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

function updateNavbarSize() {
    const y = window.scrollY;
    const isCompact = navbar.classList.contains("is-compact");

    // Hysteresis stops flicker: shrinking the bar moves content up,
    // which can drop scrollY under a single threshold and bounce forever.
    if (!isCompact && y > 80) {
        navbar.classList.add("is-compact");
    } else if (isCompact && y < 20) {
        navbar.classList.remove("is-compact");
    }
}

function updateActiveNav() {
    const navBottom = navbar.getBoundingClientRect().bottom;
    const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

    let currentSection = sections[0];

    if (scrolledToBottom) {
        currentSection = sections[sections.length - 1];
    } else {
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= navBottom) {
                currentSection = section;
            }
        });
    }

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSection.id}`;
        link.classList.toggle("is-active", isActive);
    });
}

function onScrollOrResize() {
    updateNavbarSize();
    updateActiveNav();
}

function getScrollOffset(targetId) {
    if (targetId === "home") {
        return 0;
    }

    navbar.classList.add("is-compact");
    return navbar.getBoundingClientRect().height;
}

function scrollToSection(target) {
    const offset = getScrollOffset(target.id);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top,
        behavior: "smooth",
    });
}

document.querySelectorAll(".navbar a, .logo").forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href.charAt(0) !== "#") {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        scrollToSection(target);
        history.pushState(null, "", href);
    });
});

const carouselTrack = document.querySelector(".carousel-track");
const carouselViewport = document.querySelector(".carousel-viewport");
const carouselSlides = Array.from(document.querySelectorAll(".carousel-slide"));
const carouselStatus = document.querySelector(".carousel-status");
let carouselIndex = 0;

function updateCarousel() {
    const slideWidth = carouselViewport.offsetWidth;
    carouselTrack.style.transform = `translateX(-${carouselIndex * slideWidth}px)`;
    carouselStatus.textContent = `${carouselIndex + 1} / ${carouselSlides.length}`;
}

function goToSlide(nextIndex) {
    carouselIndex =
        (nextIndex + carouselSlides.length) % carouselSlides.length;
    updateCarousel();
}

document.querySelector(".carousel-btn--prev").addEventListener("click", () => {
    goToSlide(carouselIndex - 1);
});

document.querySelector(".carousel-btn--next").addEventListener("click", () => {
    goToSlide(carouselIndex + 1);
});

const modal = document.querySelector(".modal");
const modalPanels = Array.from(document.querySelectorAll(".modal-panel"));

function openModal(id) {
    modalPanels.forEach((panel) => {
        panel.hidden = panel.dataset.modal !== id;
    });
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
}

function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
        openModal(button.getAttribute("data-open-modal"));
    });
});

document.querySelector(".modal-close").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
    }
});

window.addEventListener("scroll", onScrollOrResize);
window.addEventListener("resize", () => {
    onScrollOrResize();
    updateCarousel();
});
onScrollOrResize();
updateCarousel();
