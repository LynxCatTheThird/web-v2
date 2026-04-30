(function () {
  window.renderers.push(() => {
    const searchBar = document.getElementById("search-bar");
    const timelineWrap = document.getElementById("timeline-wrap");
    if (!searchBar || !timelineWrap) return;
    const timeline = timelineWrap.childNodes;

    searchBar.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase().replace(/\s+/g, "");
      for (let i of timeline) {
        if (i.nodeType !== 1) continue;
        if (!value || (i.dataset.title ?? "").includes(value)) {
          i.style.opacity = 1;
          i.style.visibility = "visible";
          i.style.marginTop = 0;
        } else {
          i.style.opacity = 0;
          i.style.visibility = "hidden";
          i.style.marginTop = -i.offsetHeight - 30 + "px";
        }
      }
    });
  });
})();
