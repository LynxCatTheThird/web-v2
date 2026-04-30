window.renderers = [];

document.addEventListener("DOMContentLoaded", () => {
    // Handle Loading
    if (theme_config.loading_screen) {
        const loadingEl = document.getElementById("loading");
        const mainEl = document.getElementById("main");
        if (loadingEl) {
            window.addEventListener("load", () => {
                loadingEl.classList.add("fade-hidden");
                if (mainEl) {
                    mainEl.classList.remove("into-hidden");
                }
            });
        }
    }

    // Menu state
    const menu = document.getElementById("menu");
    const toggleMenuBtn = document.getElementById("toggle-menu");
    const mobileMenuItems = document.getElementById("mobile-menu-items");
    const menuCurtain = document.getElementById("menu-curtain");
    
    let showMenuItems = false;
    const toggleMenu = () => {
        showMenuItems = !showMenuItems;
        if (showMenuItems) {
            mobileMenuItems.classList.remove("slide-hidden");
            menuCurtain.classList.remove("fade-hidden");
        } else {
            mobileMenuItems.classList.add("slide-hidden");
            menuCurtain.classList.add("fade-hidden");
        }
    };

    if (toggleMenuBtn) toggleMenuBtn.addEventListener("click", toggleMenu);
    if (menuCurtain) menuCurtain.addEventListener("click", toggleMenu);

    // Theme toggle
    const toggleTheme = () => {
        let currentTheme = document.documentElement.getAttribute("data-theme");
        if (!currentTheme) {
            currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        let newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        
        let lightStyle = document.getElementById("highlight-style-light");
        let darkStyle = document.getElementById("highlight-style-dark");
        if (lightStyle && darkStyle) {
            if (newTheme === "dark") {
                lightStyle.media = "none";
                darkStyle.media = "all";
            } else {
                lightStyle.media = "all";
                darkStyle.media = "none";
            }
        }
    };

    const themeBtns = document.querySelectorAll(".theme-button");
    themeBtns.forEach(btn => btn.addEventListener("click", toggleTheme));

    // Scroll
    let scrollTop = 0;
    const homePostsWrap = document.getElementById("home-posts-wrap");

    const handleScroll = () => {
        if (!menu) return;
        let newScrollTop = document.documentElement.scrollTop;
        if (scrollTop < newScrollTop) {
            menu.classList.add("hidden");
            if (showMenuItems) toggleMenu();
        } else {
            menu.classList.remove("hidden");
        }

        if (homePostsWrap) {
            if (newScrollTop <= window.innerHeight - 100) {
                menu.classList.add("menu-color");
            } else {
                menu.classList.remove("menu-color");
            }
            if (newScrollTop <= 400) {
                homePostsWrap.style.top = "-" + (newScrollTop / 5) + "px";
            } else {
                homePostsWrap.style.top = "-80px";
            }
        }
        scrollTop = newScrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Run renderers
    window.renderers.forEach(fn => fn());
});
