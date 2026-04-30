(function () {
  /**
   * Pick a random item from an array.
   * @param {string[]} arr
   * @returns {string}
   */
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Determine whether the page is currently in dark mode.
   * Checks the explicit data-theme attribute first, then falls back to
   * the OS-level prefers-color-scheme media query.
   * @returns {boolean}
   */
  function isDark() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark") return true;
    if (attr === "light") return false;
    return (
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  /**
   * Apply the appropriate background image to #home-background.
   * @param {HTMLElement} bg
   * @param {string[]} lightImages
   * @param {string[]} darkImages
   */
  function applyBackground(bg, lightImages, darkImages) {
    const images = isDark() ? darkImages : lightImages;
    bg.style.backgroundImage = `url('${pickRandom(images)}')`;
  }

  window.renderers.push(() => {
    const background = document.getElementById("home-background");
    if (!background) return;

    const lightImages = background.dataset.images.split(",").map((s) => s.trim()).filter(Boolean);
    const darkImages = (background.dataset.imagesDark || background.dataset.images)
      .split(",").map((s) => s.trim()).filter(Boolean);

    // Set initial background
    applyBackground(background, lightImages, darkImages);

    // Watch for theme changes via data-theme attribute mutations
    const observer = new MutationObserver(() => {
      applyBackground(background, lightImages, darkImages);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Also respond to OS-level color scheme changes (when no explicit theme is set)
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        applyBackground(background, lightImages, darkImages);
      });
    }

    const menu = document.getElementById("menu");
    if (menu) menu.classList.add("menu-color");

    const homeInfo = document.getElementById("home-info");
    if (homeInfo) {
      homeInfo.addEventListener("click", () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      });
    }
  });
})();

