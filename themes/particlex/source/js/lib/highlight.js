(function () {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  window.renderers.push(() => {
    if (typeof hljs === "undefined") return;
    hljs.configure({ ignoreUnescapedHTML: true });

    let codes = document.querySelectorAll("pre");
    for (let i of codes) {
      if (i.querySelector(".code-content")) continue;

      let code = i.textContent;
      let language =
        [
          ...i.classList,
          ...(i.firstChild && i.firstChild.classList
            ? i.firstChild.classList
            : []),
        ][0] || "plaintext";
      let highlighted;
      try {
        if (language !== "plaintext" && hljs.getLanguage(language)) {
          highlighted = hljs.highlight(code, { language }).value;
        } else {
          highlighted = code;
        }
      } catch {
        highlighted = code;
      }
      i.innerHTML = `
            <div class="code-content hljs">${highlighted}</div>
            <div class="language">${language}</div>
            <div class="copycode">
                <i class="fa-solid fa-chevron-down fold-btn fa-fw" aria-hidden="true"></i>
                <i class="fa-solid fa-expand expand-btn fa-fw" aria-hidden="true"></i>
                <i class="fa-solid fa-copy copy-btn fa-fw" aria-hidden="true"></i>
                <i class="fa-solid fa-check check-btn fa-fw" aria-hidden="true"></i>
            </div>
            `;
      let content = i.querySelector(".code-content");
      hljs.lineNumbersBlock(content, { singleLine: true });
      let copycode = i.querySelector(".copycode");

      let foldBtn = i.querySelector(".fold-btn");
      let expandBtn = i.querySelector(".expand-btn");
      let copyBtn = i.querySelector(".copy-btn");
      let placeholder = null;
      let copying = false;

      // Auto-folding removed, using height limitation instead

      foldBtn.addEventListener("click", () => {
        if (i.classList.contains("folded")) {
          foldBtn.classList.remove("fa-chevron-right");
          foldBtn.classList.add("fa-chevron-down");
          i.classList.remove("folded");
        } else {
          foldBtn.classList.remove("fa-chevron-down");
          foldBtn.classList.add("fa-chevron-right");
          i.classList.add("folded");
        }
      });

      expandBtn.addEventListener("click", () => {
        if (i.classList.contains("expanded")) {
          i.classList.add("shrinking");
          // Fix #6: use animationend instead of hardcoded setTimeout
          i.addEventListener(
            "animationend",
            () => {
              if (placeholder) {
                placeholder.remove();
                placeholder = null;
              }
              i.classList.remove("expanded", "shrinking");
              expandBtn.classList.remove("fa-compress");
              expandBtn.classList.add("fa-expand");
            },
            { once: true },
          );
        } else {
          placeholder = document.createElement("div");
          placeholder.className = "pre-placeholder";
          placeholder.style.height = i.offsetHeight + "px";
          placeholder.style.width = i.offsetWidth + "px";
          placeholder.style.margin = getComputedStyle(i).margin;
          i.parentNode.insertBefore(placeholder, i);

          expandBtn.classList.remove("fa-expand");
          expandBtn.classList.add("fa-compress");
          i.classList.add("expanded");
        }
      });

      copyBtn.addEventListener("click", async () => {
        if (copying) return;
        copying = true;
        copycode.classList.add("copied");
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          /* clipboard API unavailable in non-secure context */
        }
        await sleep(1000);
        copycode.classList.remove("copied");
        copying = false;
      });
    }
  });
})();
