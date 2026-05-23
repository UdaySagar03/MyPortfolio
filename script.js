const revealElements = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const cursorRing = document.querySelector(".cursor-ring");
const cursorDot = document.querySelector(".cursor-dot");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const magneticButtons = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");

revealElements.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) {
        element.style.setProperty("--reveal-delay", `${delay}s`);
    }
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealElements.forEach((element) => revealObserver.observe(element));

const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

if (window.matchMedia("(pointer:fine)").matches) {
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;

    const animateCursorRing = () => {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        requestAnimationFrame(animateCursorRing);
    };

    animateCursorRing();

    window.addEventListener("mousemove", (event) => {
        cursorGlow.style.opacity = "1";
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;

        targetX = event.clientX;
        targetY = event.clientY;

        if (cursorDot) {
            cursorDot.style.opacity = "1";
            cursorDot.style.left = `${event.clientX}px`;
            cursorDot.style.top = `${event.clientY}px`;
        }

        if (cursorRing) {
            cursorRing.style.opacity = "1";
        }
    });

    window.addEventListener("mouseleave", () => {
        cursorGlow.style.opacity = "0";
        if (cursorRing) {
            cursorRing.style.opacity = "0";
        }
        if (cursorDot) {
            cursorDot.style.opacity = "0";
        }
    });

    document.querySelectorAll("a, button, .tilt-card").forEach((element) => {
        element.addEventListener("mouseenter", () => {
            if (cursorRing) {
                cursorRing.style.transform = "translate(-50%, -50%) scale(1.35)";
                cursorRing.style.borderColor = "rgba(54, 180, 212, 0.45)";
            }
        });

        element.addEventListener("mouseleave", () => {
            if (cursorRing) {
                cursorRing.style.transform = "translate(-50%, -50%) scale(1)";
                cursorRing.style.borderColor = "rgba(13, 31, 54, 0.4)";
            }
        });
    });
}

const closeMobileMenu = () => {
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("open");
    document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".mobile-nav a, .top-nav a").forEach((link) => {
    link.addEventListener("click", () => {
        closeMobileMenu();
    });
});

document.addEventListener("click", (event) => {
    if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu();
    }
});

magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
        if (window.innerWidth < 768) {
            return;
        }

        const rect = button.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${offsetX * 0.12}px, ${offsetY * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
});

tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        if (window.innerWidth < 900) {
            return;
        }

        const rect = card.getBoundingClientRect();
        const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.borderColor = "rgba(124, 243, 226, 0.35)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.borderColor = "";
    });
});
