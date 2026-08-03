/* ========================================
   COMMAND PALETTE
   ======================================== */

const palette = document.getElementById("palette");
const input = document.getElementById("searchInput");
const button = document.getElementById("commandBtn");
button.onclick = openPalette;

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        openPalette();
    }
    if (e.key === "Escape") {
        palette.style.display = "none";
    }
});

function openPalette() {
    palette.style.display = "flex";
    input.value = "";
    input.focus();
    commands.forEach(cmd => cmd.style.display = "flex");
    noResults.style.display = "none";
    selected = 0;
    updateSelection();
}

palette.addEventListener("click", (e) => {
    if (e.target === palette) {
        palette.style.display = "none";
    }
});

const commands = document.querySelectorAll(".command");
const noResults = document.getElementById("noResults");

input.addEventListener("input", () => {
    const value = input.value.toLowerCase().trim();

    // Secret command — type "play" to trigger the easter egg
    if (value === "play") {
        palette.style.display = "none";
        input.value = "";
        showToast("🦖 Launching...!");
        window.location.href = "dino.html";
        return;
    }

    let visible = 0;

    commands.forEach(command => {
        const match = command.innerText.toLowerCase().includes(value);
        command.style.display = match ? "flex" : "none";
        if (match) visible++;
    });

    noResults.style.display = visible === 0 ? "block" : "none";

    selected = 0;
    updateSelection();
});

commands.forEach(command => {
    command.onclick = () => {
        palette.style.display = "none";

        if (command.dataset.scroll) {
            if (command.dataset.scroll === "top") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                document.getElementById(command.dataset.scroll)
                    .scrollIntoView({ behavior: "smooth" });
            }
        }

        if (command.dataset.link) {
            window.open(command.dataset.link, "_blank");
        }
    };
});

let selected = 0;

function updateSelection() {
    const visible = [...commands].filter(c => c.style.display !== "none");
    visible.forEach(c => c.classList.remove("active"));
    if (visible.length) {
        // Clamp selected index in case list shrank
        if (selected >= visible.length) selected = visible.length - 1;
        visible[selected].classList.add("active");
        visible[selected].scrollIntoView({ block: "nearest" });
    }
}

document.addEventListener("keydown", (e) => {
    if (palette.style.display !== "flex") return;

    const visible = [...commands].filter(c => c.style.display !== "none");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selected = (selected + 1) % visible.length;
        updateSelection();
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        selected = (selected - 1 + visible.length) % visible.length;
        updateSelection();
    }
    if (e.key === "Enter" && visible.length) {
        e.preventDefault();
        visible[selected].click();
    }
});

/* ========================================
   DARK MODE TOGGLE
   ======================================== */

const themeToggle = document.getElementById("themeToggle");
const themeCommand = document.getElementById("themeCommand");

themeToggle.onclick = toggleTheme;

themeCommand.onclick = () => {
    palette.style.display = "none";
    toggleTheme();
};

function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    showToast(isDark ? "Dark mode enabled" : "Light mode enabled");
}

/* ========================================
   TOAST NOTIFICATIONS
   ======================================== */

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* ========================================
   FADE-IN ON SCROLL (IntersectionObserver)
   ======================================== */

const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                fadeObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */

const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

/* ========================================
   MOBILE HAMBURGER MENU
   ======================================== */

const hamburger = document.getElementById("hamburger");
const navBar = document.getElementById("navBar");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navBar.classList.toggle("open");
});

navBar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navBar.classList.remove("open");
    });
});

document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) {
        hamburger.classList.remove("open");
        navBar.classList.remove("open");
    }
});