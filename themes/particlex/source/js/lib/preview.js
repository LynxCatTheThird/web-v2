(function () {
  window.renderers.push(() => {
    // 自动扫描文章正文中的所有图片并用 data-fancybox 进行链接包装
    const contentImages = document.querySelectorAll(".article .content img");
    contentImages.forEach((img) => {
      // 避免重复包装或包装已有超链接的图片
      if (img.parentElement.tagName === "A") return;
      if (img.closest("#loading")) return;

      const link = document.createElement("a");
      link.dataset.fancybox = "gallery";
      link.href = img.src;
      if (img.alt) {
        link.dataset.caption = img.alt;
      }

      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
      
      // 为图片赋予更专业的指针交互样式
      img.style.cursor = "zoom-in";
    });

    // 绑定并本地化配置 Fancybox 现代图片画廊
    if (typeof Fancybox !== "undefined") {
      Fancybox.bind("[data-fancybox='gallery']", {
        Hash: false,
        Thumbs: {
          autoStart: false,
        },
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [],
            right: ["slideshow", "download", "thumbs", "close"],
          },
        },
        l10n: {
          CLOSE: "关闭",
          NEXT: "下一张",
          PREV: "上一张",
          MODAL: "按 ESC 键关闭",
          ERROR: "图片加载失败，请稍后重试",
          IMAGE_ERROR: "图片加载失败",
          DOWNLOAD: "下载原图",
          PLAY_START: "开始幻灯片播放",
          PLAY_STOP: "暂停幻灯片播放",
          FULL_SCREEN: "全屏",
          THUMBS: "缩略图",
        }
      });
    }
  });
})();
