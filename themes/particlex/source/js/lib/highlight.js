(function () {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  window.renderers.push(() => {
    const codes = document.querySelectorAll("pre code.hljs");
    const root = document.documentElement;
    let activeExpandedPre = null;

    const collapseExpandedCode = (immediate = false) => {
      if (!activeExpandedPre) return;

      const pre = activeExpandedPre;
      activeExpandedPre = null;
      root.classList.remove("code-fullscreen");

      const placeholder = pre._placeholder;
      const overlay = pre._overlay;
      const expandBtn = pre.querySelector(".expand-btn");

      if (immediate) {
        if (placeholder) placeholder.remove();
        if (overlay) overlay.remove();
        pre._placeholder = null;
        pre._overlay = null;
        pre.classList.remove("expanded", "shrinking");
        if (expandBtn) expandBtn.classList.replace("fa-compress", "fa-expand");
        return;
      }

      pre.classList.add("shrinking");
      pre.addEventListener(
        "animationend",
        () => {
          if (placeholder) placeholder.remove();
          if (overlay) overlay.remove();
          pre._placeholder = null;
          pre._overlay = null;
          pre.classList.remove("expanded", "shrinking");
          if (expandBtn) expandBtn.classList.replace("fa-compress", "fa-expand");
        },
        { once: true },
      );
    };

    window.closeExpandedCodeBlock = () => collapseExpandedCode(true);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && activeExpandedPre) {
        collapseExpandedCode();
      }
    });

    codes.forEach((el) => {
      const pre = el.parentElement;
      if (pre.querySelector(".copycode")) return; // 防止重复处理

      const langClass = Array.from(el.classList).find((className) =>
        className.startsWith("language-"),
      );
      const language =
        pre.dataset.language ||
        (langClass ? langClass.replace("language-", "") : "code");

      const controlsHTML = `
        <div class="code-toolbar">
            <div class="language">${language}</div>
            <div class="copycode">
                <i class="fa-solid fa-chevron-down fold-btn fa-fw" aria-hidden="true"></i>
                <i class="fa-solid fa-expand expand-btn fa-fw" aria-hidden="true"></i>
                <i class="fa-solid fa-copy copy-btn fa-fw" aria-hidden="true"></i>
                <i class="fa-solid fa-check check-btn fa-fw" aria-hidden="true"></i>
            </div>
        </div>`;
      pre.insertAdjacentHTML("afterbegin", controlsHTML);

      const codeText = el.textContent;
      const copycode = pre.querySelector(".copycode");
      const foldBtn = pre.querySelector(".fold-btn");
      const expandBtn = pre.querySelector(".expand-btn");
      const copyBtn = pre.querySelector(".copy-btn");
      let copying = false;

      foldBtn.addEventListener("click", () => {
        const isFolded = pre.classList.contains("folded");
        foldBtn.classList.toggle("fa-chevron-right", !isFolded);
        foldBtn.classList.toggle("fa-chevron-down", isFolded);
        pre.classList.toggle("folded");
      });

      expandBtn.addEventListener("click", () => {
        if (pre.classList.contains("expanded")) {
          collapseExpandedCode();
        } else {
          if (activeExpandedPre) collapseExpandedCode(true);

          const placeholder = document.createElement("div");
          placeholder.className = "pre-placeholder";
          placeholder.style.height = pre.offsetHeight + "px";
          pre.parentNode.insertBefore(placeholder, pre);
          const overlay = document.createElement("div");
          overlay.className = "pre-overlay";
          document.body.appendChild(overlay);
          overlay.appendChild(pre);
          expandBtn.classList.replace("fa-expand", "fa-compress");
          pre.classList.add("expanded");
          pre._placeholder = placeholder;
          pre._overlay = overlay;
          activeExpandedPre = pre;
          root.classList.add("code-fullscreen");
        }
      });

      copyBtn.addEventListener("click", async () => {
        if (copying) return;
        copying = true;
        copycode.classList.add("copied");
        try {
          await navigator.clipboard.writeText(codeText);
        } catch {
          /* clipboard API unavailable in non-secure context */
        }
        await sleep(1000);
        copycode.classList.remove("copied");
        copying = false;
      });
    });
  });
})();
