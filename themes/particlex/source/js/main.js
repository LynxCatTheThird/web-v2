window.renderers = window.renderers || [];

document.addEventListener("DOMContentLoaded", () => {
  // 加载动画处理
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

  // 导航菜单控制
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

  // 主题配色切换
  const toggleTheme = () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    if (!currentTheme) {
      currentTheme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    }
    let newTheme = currentTheme === "dark" ? "light" : "dark";

    const updateTheme = () => {
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

    if (document.startViewTransition) {
      document.startViewTransition(updateTheme);
    } else {
      document.documentElement.classList.add("theme-transitioning");
      updateTheme();
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 500);
    }
  };

  const themeBtns = document.querySelectorAll(".theme-button");
  themeBtns.forEach((btn) => btn.addEventListener("click", toggleTheme));

  // 滚动状态监控
  let scrollTop = 0;
  const homePostsWrap = document.getElementById("home-posts-wrap");
  const fabTop = document.getElementById("fab-top");

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
        homePostsWrap.style.top = "-" + newScrollTop / 5 + "px";
      } else {
        homePostsWrap.style.top = "-80px";
      }
    }
    scrollTop = newScrollTop;

    // 回到顶部按钮可见性
    if (fabTop) {
      if (newScrollTop > 300) {
        fabTop.classList.remove("fab-hidden");
      } else {
        fabTop.classList.add("fab-hidden");
      }
    }
  };

  // FAB 悬浮按钮组交互
  if (fabTop) {
    fabTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const fabComment = document.getElementById("fab-comment");
  if (fabComment) {
    fabComment.addEventListener("click", () => {
      const commentEl = document.getElementById("comment");
      if (commentEl) {
        const top =
          commentEl.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }

  const fabReading = document.getElementById("fab-reading");
  const exitReading = document.getElementById("reading-mode-exit");

  const setReadingMode = (enable) => {
    const rootEl = document.documentElement;

    // 查找并记录当前视口中最先露头的文章子元素，作为滚动锚定基准以消除上下滑动
    let anchorEl = null;
    let anchorOffset = 0;
    const contentEl = document.querySelector(".article .content");
    if (contentEl) {
      const children = Array.from(contentEl.children);
      for (const child of children) {
        const rect = child.getBoundingClientRect();
        // 查找第一个在视口中可见的元素作为锚点
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          anchorEl = child;
          anchorOffset = rect.top;
          break;
        }
      }
    }

    const applyReadingChange = () => {
      if (enable) {
        rootEl.classList.add("reading-mode");
        rootEl.classList.add("toc-collapsed");
        sessionStorage.setItem("reading-mode", "true");
        sessionStorage.setItem("toc-collapsed", "true");
      } else {
        if (typeof window.closeExpandedCodeBlock === "function") {
          window.closeExpandedCodeBlock();
        }
        rootEl.classList.remove("reading-mode");
        rootEl.classList.remove("toc-collapsed");
        sessionStorage.setItem("reading-mode", "false");
        sessionStorage.setItem("toc-collapsed", "false");
      }

      // 同步目录折叠按钮状态
      const fabTocToggle = document.getElementById("fab-toc-toggle");
      if (fabTocToggle) {
        const collapsed = rootEl.classList.contains("toc-collapsed");
        fabTocToggle.setAttribute(
          "aria-expanded",
          collapsed ? "false" : "true",
        );
        fabTocToggle.setAttribute(
          "aria-label",
          collapsed ? "显示目录" : "收起目录",
        );
      }
    };

    // CSS 过渡动画
    rootEl.classList.add("reading-mode-transitioning");
    applyReadingChange();

    // 在过渡动画进行期间，高频监测锚点元素相对于视口的位置差值，并进行实时滚动修正
    if (anchorEl) {
      const startTime = performance.now();
      const duration = 400; // 时长匹配 0.4s 的 CSS 过渡动画
      const lockScroll = () => {
        const elapsed = performance.now() - startTime;
        const rectAfter = anchorEl.getBoundingClientRect();
        const shift = rectAfter.top - anchorOffset;
        if (shift !== 0) {
          window.scrollBy(0, shift);
        }
        if (elapsed < duration) {
          requestAnimationFrame(lockScroll);
        }
      };
      requestAnimationFrame(lockScroll);
    }

    setTimeout(() => {
      rootEl.classList.remove("reading-mode-transitioning");
    }, 400); // 时长匹配 0.4s 的 CSS 过渡动画
  };

  window.setReadingMode = setReadingMode;

  if (fabReading) {
    fabReading.addEventListener("click", () => {
      const isReading =
        document.documentElement.classList.contains("reading-mode");
      setReadingMode(!isReading);
    });
  }

  if (exitReading) {
    exitReading.addEventListener("click", () => {
      setReadingMode(false);
    });
  }

  // 恢复已保存的阅读模式状态
  if (sessionStorage.getItem("reading-mode") === "true") {
    setReadingMode(true);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 执行各组件渲染器
  window.renderers.forEach((fn) => fn());
});
