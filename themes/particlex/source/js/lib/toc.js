/**
 * Table of Contents (TOC) - Auto-generated from article headings
 * Supports:
 *  - Hierarchical numbering (1, 1.1, 1.2, 2, ...)
 *  - Configurable heading depth (h1~h6)
 *  - Scroll-spy with animated active heading highlight
 *  - Smooth scroll on click
 *  - Back-to-top & go-to-comment buttons
 *  - Desktop dismiss & reopen
 *  - Reading mode (ADHD-friendly)
 *  - Resizable width (desktop drag handle)
 *  - Collapse/expand on mobile via FAB
 *  - Re-generation after crypto decryption
 *
 * Config is injected via `toc_config` global from import.ejs
 */
window.renderers.push(() => {
  const cfg = window.toc_config || {};
  const tocContainer = document.getElementById("toc");
  if (!tocContainer) return;

  const tocList = document.getElementById("toc-list");
  const tocToggle = document.getElementById("toc-toggle");
  const tocClose = document.getElementById("toc-close");
  const btnTop = document.getElementById("toc-btn-top");
  const btnComment = document.getElementById("toc-btn-comment");
  const btnReading = document.getElementById("toc-btn-reading");
  const exitReading = document.getElementById("reading-mode-exit");
  const resizeHandle = document.getElementById("toc-resize");
  const root = document.documentElement;

  const minDepth = cfg.min_depth || 1;
  const maxDepth = cfg.max_depth || 4;
  const showNumber = cfg.number !== false;
  const tocWidth = cfg.width || 260;

  // Apply configured width via CSS custom property on :root
  root.style.setProperty("--toc-width", tocWidth + "px");

  // ── Restore persisted states ──────────────────────────────────────
  if (sessionStorage.getItem("toc-collapsed") === "true") {
    root.classList.add("toc-collapsed");
  }
  if (sessionStorage.getItem("reading-mode") === "true") {
    root.classList.add("reading-mode");
  }

  // ── Heading selector ──────────────────────────────────────────────
  const levels = [];
  for (let i = minDepth; i <= Math.min(maxDepth, 6); i++) levels.push("h" + i);
  const headingSelector = levels.join(", ");

  // ── Build TOC ─────────────────────────────────────────────────────
  let scrollHandler = null;

  function buildTOC() {
    const content =
      document.getElementById("crypto-content") ||
      document.querySelector(".article .content");
    if (!content) return;

    const headings = content.querySelectorAll(headingSelector);
    if (headings.length === 0) {
      tocContainer.style.display = "none";
      if (tocToggle) tocToggle.style.display = "none";
      return;
    }

    tocContainer.style.display = "";
    if (tocToggle) tocToggle.style.display = "";

    // Ensure each heading has an id
    headings.forEach((h, i) => {
      if (!h.id) {
        const slug = h.textContent
          .trim()
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fff]+/g, "-")
          .replace(/^-|-$/g, "");
        h.id = "heading-" + (slug || i);
      }
    });

    // Calculate hierarchical numbers
    const minLevel = Math.min(
      ...Array.from(headings).map((h) => parseInt(h.tagName[1]))
    );
    const counters = [0, 0, 0, 0, 0, 0];

    tocList.innerHTML = "";

    headings.forEach((h) => {
      const absLevel = parseInt(h.tagName[1]);
      const relLevel = absLevel - minLevel;

      counters[relLevel]++;
      for (let j = relLevel + 1; j < counters.length; j++) counters[j] = 0;

      let numberStr = "";
      if (showNumber) {
        const parts = [];
        for (let j = 0; j <= relLevel; j++) parts.push(counters[j] || 1);
        numberStr = parts.join(".");
      }

      // ── Inject numbering into article heading ──
      if (showNumber) {
        const existing = h.querySelector(".heading-number");
        if (existing) existing.remove();
        const headingNum = document.createElement("span");
        headingNum.className = "heading-number";
        headingNum.textContent = numberStr + " ";
        h.insertBefore(headingNum, h.firstChild);
      }

      // ── Build TOC entry ──
      const li = document.createElement("li");
      li.className = "toc-item toc-level-" + relLevel;

      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.className = "toc-link";

      const indicator = document.createElement("span");
      indicator.className = "toc-indicator";
      const textSpan = document.createElement("span");
      textSpan.className = "toc-text";

      if (showNumber) {
        const numSpan = document.createElement("span");
        numSpan.className = "toc-number";
        numSpan.textContent = numberStr;
        a.appendChild(indicator);
        a.appendChild(numSpan);
      } else {
        a.appendChild(indicator);
      }
      textSpan.textContent = h.textContent.replace(/^[\d.]+ /, "");
      a.appendChild(textSpan);

      a.addEventListener("click", (e) => {
        e.preventDefault();
        const top = h.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", "#" + h.id);
        if (window.innerWidth < 900) {
          tocContainer.classList.remove("toc-visible");
        }
      });

      li.appendChild(a);
      tocList.appendChild(li);
    });

    // ── Scroll spy ────────────────────────────────────────────────
    if (scrollHandler) window.removeEventListener("scroll", scrollHandler);

    let ticking = false;
    const tocLinks = tocList.querySelectorAll(".toc-link");
    const headingArr = Array.from(headings);

    function updateActive() {
      let activeIndex = -1;
      for (let i = headingArr.length - 1; i >= 0; i--) {
        if (headingArr[i].getBoundingClientRect().top <= 80) {
          activeIndex = i;
          break;
        }
      }

      tocLinks.forEach((link, i) => {
        if (i === activeIndex) {
          link.classList.add("toc-active");
          const tocScroll = document.getElementById("toc-scroll");
          if (tocScroll) {
            const linkEl = link.parentElement;
            const linkTop = linkEl.offsetTop;
            const containerH = tocScroll.clientHeight;
            tocScroll.scrollTo({
              top: linkTop - containerH / 3,
              behavior: "smooth",
            });
          }
        } else {
          link.classList.remove("toc-active");
        }
      });

      if (btnTop) {
        const scrollY = window.scrollY || root.scrollTop;
        btnTop.classList.toggle("visible", scrollY > 300);
      }
    }

    scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });
    updateActive();
  }

  // ── TOC dismiss / reopen (works on both mobile & desktop) ─────────
  function collapseTOC() {
    root.classList.add("toc-collapsed");
    tocContainer.classList.remove("toc-visible");
    sessionStorage.setItem("toc-collapsed", "true");
  }

  function expandTOC() {
    root.classList.remove("toc-collapsed");
    sessionStorage.setItem("toc-collapsed", "false");
  }

  if (tocClose) {
    tocClose.addEventListener("click", collapseTOC);
  }

  if (tocToggle) {
    tocToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (root.classList.contains("toc-collapsed")) {
        expandTOC();
      } else if (window.innerWidth < 900) {
        // Mobile panel toggle
        tocContainer.classList.toggle("toc-visible");
      }
    });
  }

  // Close TOC panel when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 900) {
      if (
        tocContainer.classList.contains("toc-visible") &&
        !tocContainer.contains(e.target) &&
        tocToggle &&
        e.target !== tocToggle &&
        !tocToggle.contains(e.target)
      ) {
        tocContainer.classList.remove("toc-visible");
      }
    }
  });

  // ── Reading mode ──────────────────────────────────────────────────
  function setReadingMode(enable) {
    if (enable) {
      root.classList.add("reading-mode");
      root.classList.add("toc-collapsed");
      sessionStorage.setItem("reading-mode", "true");
      sessionStorage.setItem("toc-collapsed", "true");
    } else {
      if (typeof window.closeExpandedCodeBlock === "function") {
        window.closeExpandedCodeBlock();
      }
      root.classList.remove("reading-mode");
      root.classList.remove("toc-collapsed");
      sessionStorage.setItem("reading-mode", "false");
      sessionStorage.setItem("toc-collapsed", "false");
    }
  }

  if (btnReading) {
    btnReading.addEventListener("click", () => setReadingMode(true));
  }
  if (exitReading) {
    exitReading.addEventListener("click", () => setReadingMode(false));
  }

  // ── Back to top ─────────────────────────────────────────────────
  if (btnTop) {
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Go to comment ───────────────────────────────────────────────
  if (btnComment) {
    btnComment.addEventListener("click", () => {
      const comment = document.getElementById("comment");
      if (comment) {
        const top =
          comment.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }

  // ── Desktop drag-resize ─────────────────────────────────────────
  if (resizeHandle) {
    let startX, startW;
    const onMouseMove = (e) => {
      const delta = startX - e.clientX;
      const newW = Math.max(180, Math.min(400, startW + delta));
      root.style.setProperty("--toc-width", newW + "px");
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    resizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX = e.clientX;
      startW = tocContainer.getBoundingClientRect().width;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // ── Init ────────────────────────────────────────────────────────
  buildTOC();

  // Observe for crypto decryption
  const cryptoContent = document.getElementById("crypto-content");
  if (cryptoContent) {
    const observer = new MutationObserver(() => {
      if (cryptoContent.innerHTML.trim().length > 0) {
        buildTOC();
        observer.disconnect();
      }
    });
    observer.observe(cryptoContent, { childList: true, subtree: true });
  }
});
