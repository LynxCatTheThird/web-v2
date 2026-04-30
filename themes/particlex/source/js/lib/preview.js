(function () {
  window.renderers.push(() => {
    let preview = document.getElementById("preview");
    let content = document.getElementById("preview-content");
    if (!preview || !content) return;

    let images = document.querySelectorAll("img");
    for (let i of images) {
      if (i.id === "preview-content" || i.closest("#loading")) continue;
      i.addEventListener("click", () => {
        content.alt = i.alt;
        content.src = i.src;
        preview.classList.remove("fade-hidden");
      });
    }

    preview.addEventListener("click", () => {
      preview.classList.add("fade-hidden");
    });
    window.addEventListener("resize", () => {
      preview.classList.add("fade-hidden");
    });
  });
})();
