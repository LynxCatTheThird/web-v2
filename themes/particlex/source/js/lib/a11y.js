// 无障碍与专注功能面板逻辑
window.renderers = window.renderers || [];
window.renderers.push(() => {
  const root = document.documentElement;
  const a11yPanel = document.getElementById("a11y-panel");
  const a11yTriggerBtn =
    document.getElementById("fab-a11y") ||
    document.getElementById("a11y-trigger-btn");
  const a11yCloseBtn = document.getElementById("a11y-panel-close");
  const a11yResetBtn = document.getElementById("a11y-panel-reset");
  const liveAnnouncer = document.getElementById("a11y-live-announcer");

  // 滑块与微调输入控件
  const fontSlider = document.getElementById("a11y-font-slider");
  const fontInput = document.getElementById("a11y-font-input");
  const fontDecBtn = document.getElementById("a11y-font-dec");
  const fontIncBtn = document.getElementById("a11y-font-inc");

  const lhSlider = document.getElementById("a11y-line-height-slider");
  const lhInput = document.getElementById("a11y-line-height-input");
  const lhDecBtn = document.getElementById("a11y-lh-dec");
  const lhIncBtn = document.getElementById("a11y-lh-inc");

  // 复选开关
  const toggleDyslexic = document.getElementById("a11y-toggle-dyslexic");
  const toggleRuler = document.getElementById("a11y-toggle-ruler");
  const toggleLeftHanded = document.getElementById("a11y-toggle-left-handed");
  const toggleColorblind = document.getElementById("a11y-toggle-colorblind");
  const colorblindSelect = document.getElementById("a11y-colorblind-select");
  const colorblindSelectContainer = document.getElementById(
    "a11y-colorblind-select-container",
  );

  // 开发者模式控件
  const toggleDeveloper = document.getElementById("a11y-toggle-developer");
  const developerSlider = document.getElementById("a11y-hue-slider");
  const developerSliderContainer = document.getElementById("a11y-developer-slider-container");
  const developerInput = document.getElementById("a11y-hue-input");

  // 主题切换按钮
  const themeBtns = document.querySelectorAll(".a11y-theme-btn");

  // 专注遮罩
  const rulerTop = document.getElementById("a11y-ruler-top");
  const rulerBottom = document.getElementById("a11y-ruler-bottom");

  // 缓存初始加载的色彩 HUE 角度作为还原基准
  const initialHue = parseInt(root.style.getPropertyValue("--primary-hue") || getComputedStyle(root).getPropertyValue("--primary-hue").trim()) || 210;
  if (!root.hasAttribute("data-initial-hue")) {
    root.setAttribute("data-initial-hue", initialHue);
  }

  // 默认配置
  const DEFAULTS = {
    theme: "standard",
    fontSize: 100,
    lineHeight: 18,
    dyslexic: false,
    ruler: false,
    leftHanded: false,
    colorblindEnabled: false,
    colorblindMode: "deuteranopia",
    developerEnabled: false,
    customHue: initialHue,
  };

  // 屏幕阅读器辅助广播
  function announce(text) {
    if (liveAnnouncer) {
      liveAnnouncer.textContent = text;
      setTimeout(() => {
        if (liveAnnouncer.textContent === text) {
          liveAnnouncer.textContent = "";
        }
      }, 3000);
    }
  }

  // 应用配置到 DOM 和 CSS 变量
  function applySettings(settings) {
    // 色彩与对比度主题
    root.classList.remove("a11y-theme-grayscale");
    if (settings.theme === "grayscale") {
      root.classList.add("a11y-theme-grayscale");
    }
    themeBtns.forEach((btn) => {
      const isMatch = btn.getAttribute("data-a11y-theme") === settings.theme;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
    });

    // 灰度配色覆盖色盲空间模拟
    const isGrayscale = settings.theme === "grayscale";
    
    root.classList.remove(
      "a11y-protanopia",
      "a11y-deuteranopia",
      "a11y-tritanopia",
    );

    if (toggleColorblind) {
      toggleColorblind.checked = settings.colorblindEnabled;
      if (isGrayscale) {
        toggleColorblind.setAttribute("disabled", "true");
      } else {
        toggleColorblind.removeAttribute("disabled");
      }
    }
    if (colorblindSelect) {
      colorblindSelect.value = settings.colorblindMode;
    }

    const colorblindSection = document.querySelector(".a11y-colorblind-section");
    if (isGrayscale) {
      if (colorblindSelect) {
        colorblindSelect.setAttribute("disabled", "true");
      }
      if (colorblindSelectContainer) {
        colorblindSelectContainer.style.opacity = "0.3";
        colorblindSelectContainer.style.pointerEvents = "none";
      }
      if (colorblindSection) {
        colorblindSection.style.opacity = "0.5";
      }
    } else {
      if (colorblindSection) {
        colorblindSection.style.opacity = "1";
      }
      if (settings.colorblindEnabled) {
        root.classList.add(`a11y-${settings.colorblindMode}`);
        if (colorblindSelect) {
          colorblindSelect.removeAttribute("disabled");
        }
        if (colorblindSelectContainer) {
          colorblindSelectContainer.style.opacity = "1";
          colorblindSelectContainer.style.pointerEvents = "auto";
        }
      } else {
        if (colorblindSelect) {
          colorblindSelect.setAttribute("disabled", "true");
        }
        if (colorblindSelectContainer) {
          colorblindSelectContainer.style.opacity = "0.5";
          colorblindSelectContainer.style.pointerEvents = "none";
        }
      }
    }

    // 字号缩放
    root.style.setProperty(
      "--a11y-font-size-multiplier",
      settings.fontSize / 100,
    );
    if (fontSlider) {
      fontSlider.value = settings.fontSize;
      fontSlider.setAttribute("aria-valuenow", settings.fontSize);
      fontSlider.setAttribute("aria-valuetext", `${settings.fontSize}%`);
    }
    if (fontInput) {
      fontInput.value = settings.fontSize;
    }

    // 行高缩放
    root.style.setProperty(
      "--a11y-line-height-multiplier",
      settings.lineHeight / 10,
    );
    if (lhSlider) {
      lhSlider.value = settings.lineHeight;
      lhSlider.setAttribute("aria-valuenow", settings.lineHeight / 10);
    }
    if (lhInput) {
      lhInput.value = (settings.lineHeight / 10).toFixed(1);
    }

    // 护眼衬线字体
    root.classList.toggle("a11y-dyslexic", settings.dyslexic);
    if (toggleDyslexic) toggleDyslexic.checked = settings.dyslexic;

    // 专注遮罩尺
    root.classList.toggle("a11y-ruler-enabled", settings.ruler);
    if (toggleRuler) toggleRuler.checked = settings.ruler;
    if (settings.ruler) {
      updateRulerPosition(window.innerHeight / 2);
    }

    // 左手模式
    root.classList.toggle("a11y-left-handed", settings.leftHanded);
    if (toggleLeftHanded) toggleLeftHanded.checked = settings.leftHanded;

    // 开发者模式 HUE 调色配置
    if (toggleDeveloper) {
      toggleDeveloper.checked = settings.developerEnabled;
    }
    if (developerSlider) {
      developerSlider.value = settings.customHue;
    }
    if (developerInput) {
      developerInput.value = settings.customHue;
    }

    if (settings.developerEnabled) {
      root.style.setProperty("--primary-hue", settings.customHue);
      if (developerSlider) {
        developerSlider.removeAttribute("disabled");
      }
      if (developerInput) {
        developerInput.removeAttribute("disabled");
      }
      if (developerSliderContainer) {
        developerSliderContainer.style.opacity = "1";
        developerSliderContainer.style.pointerEvents = "auto";
      }
    } else {
      const initHue = parseInt(root.getAttribute("data-initial-hue")) || 210;
      root.style.setProperty("--primary-hue", initHue);
      if (developerSlider) {
        developerSlider.setAttribute("disabled", "true");
      }
      if (developerInput) {
        developerInput.setAttribute("disabled", "true");
      }
      if (developerSliderContainer) {
        developerSliderContainer.style.opacity = "0.5";
        developerSliderContainer.style.pointerEvents = "none";
      }
    }
  }

  // 从本地存储加载配置
  function loadSettings() {
    try {
      const savedTheme = localStorage.getItem("a11y-theme") || DEFAULTS.theme;
      // 如果加载了已移除的高对比度或护眼模式，重置为默认 standard
      const filteredTheme =
        savedTheme === "high-contrast" || savedTheme === "warm-sepia"
          ? "standard"
          : savedTheme;
      return {
        theme: filteredTheme,
        fontSize:
          parseInt(localStorage.getItem("a11y-font-size")) || DEFAULTS.fontSize,
        lineHeight:
          parseInt(localStorage.getItem("a11y-line-height")) ||
          DEFAULTS.lineHeight,
        dyslexic: localStorage.getItem("a11y-dyslexic") === "true",
        ruler: localStorage.getItem("a11y-ruler") === "true",
        leftHanded: localStorage.getItem("a11y-left-handed") === "true",
        colorblindEnabled:
          localStorage.getItem("a11y-colorblind-enabled") === "true",
        colorblindMode:
          localStorage.getItem("a11y-colorblind-mode") ||
          DEFAULTS.colorblindMode,
        developerEnabled:
          localStorage.getItem("a11y-developer-enabled") === "true",
        customHue:
          parseInt(localStorage.getItem("a11y-custom-hue")) || DEFAULTS.customHue,
      };
    } catch (e) {
      return { ...DEFAULTS };
    }
  }

  // 保存单项配置
  function saveSetting(key, val) {
    try {
      localStorage.setItem(`a11y-${key}`, val);
    } catch (e) {}
  }

  let activeSettings = loadSettings();
  applySettings(activeSettings);

  // 面板显示/关闭控制
  function togglePanel(e) {
    if (!a11yPanel) return;
    e.stopPropagation();
    const isHidden = a11yPanel.hasAttribute("hidden");
    if (isHidden) {
      a11yPanel.removeAttribute("hidden");
      if (a11yTriggerBtn) a11yTriggerBtn.setAttribute("aria-expanded", "true");
      a11yPanel.classList.add("visible");
      announce("无障碍设置面板已打开");
      if (a11yCloseBtn) a11yCloseBtn.focus();
    } else {
      closePanel();
    }
  }

  if (a11yTriggerBtn && a11yPanel) {
    a11yTriggerBtn.addEventListener("click", togglePanel);
  }

  function closePanel() {
    if (a11yPanel && !a11yPanel.hasAttribute("hidden")) {
      a11yPanel.setAttribute("hidden", "");
      a11yPanel.classList.remove("visible");
      if (a11yTriggerBtn) {
        a11yTriggerBtn.setAttribute("aria-expanded", "false");
        if (a11yTriggerBtn.offsetWidth > 0 && a11yTriggerBtn.offsetHeight > 0) {
          a11yTriggerBtn.focus();
        }
      }
      announce("无障碍设置面板已关闭");
    }
  }

  if (a11yCloseBtn) {
    a11yCloseBtn.addEventListener("click", closePanel);
  }

  const exitReadingBtn = document.getElementById("reading-mode-exit");
  if (exitReadingBtn) {
    exitReadingBtn.addEventListener("click", closePanel);
  }

  // ESC 键关闭面板
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePanel();
    }
  });

  // 点击外部区域关闭面板
  document.addEventListener("click", (e) => {
    if (a11yPanel && !a11yPanel.hasAttribute("hidden")) {
      const clickedTrigger =
        e.target === a11yTriggerBtn || a11yTriggerBtn?.contains(e.target);
      if (!a11yPanel.contains(e.target) && !clickedTrigger) {
        closePanel();
      }
    }
  });

  // 字号缩放事件绑定
  if (fontSlider) {
    fontSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      activeSettings.fontSize = val;
      saveSetting("font-size", val);
      applySettings(activeSettings);
    });
  }

  if (fontInput) {
    fontInput.addEventListener("change", (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = DEFAULTS.fontSize;
      val = Math.max(80, Math.min(180, val));
      activeSettings.fontSize = val;
      saveSetting("font-size", val);
      applySettings(activeSettings);
      announce(`字号已手动微调为 ${val}%`);
    });
  }

  if (fontDecBtn && fontSlider) {
    fontDecBtn.addEventListener("click", () => {
      const val = Math.max(80, activeSettings.fontSize - 10);
      activeSettings.fontSize = val;
      saveSetting("font-size", val);
      applySettings(activeSettings);
      announce(`字号已调整为 ${val}%`);
    });
  }

  if (fontIncBtn && fontSlider) {
    fontIncBtn.addEventListener("click", () => {
      const val = Math.min(180, activeSettings.fontSize + 10);
      activeSettings.fontSize = val;
      saveSetting("font-size", val);
      applySettings(activeSettings);
      announce(`字号已调整为 ${val}%`);
    });
  }

  // 行高缩放事件绑定
  if (lhSlider) {
    lhSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      activeSettings.lineHeight = val;
      saveSetting("line-height", val);
      applySettings(activeSettings);
    });
  }

  if (lhInput) {
    lhInput.addEventListener("change", (e) => {
      let val = parseFloat(e.target.value);
      if (isNaN(val)) val = DEFAULTS.lineHeight / 10;
      val = Math.max(1.5, Math.min(3.0, val));
      const storageVal = Math.round(val * 10);
      activeSettings.lineHeight = storageVal;
      saveSetting("line-height", storageVal);
      applySettings(activeSettings);
      announce(`行高已手动微调为 ${val.toFixed(1)}倍`);
    });
  }

  if (lhDecBtn && lhSlider) {
    lhDecBtn.addEventListener("click", () => {
      const val = Math.max(15, activeSettings.lineHeight - 1);
      activeSettings.lineHeight = val;
      saveSetting("line-height", val);
      applySettings(activeSettings);
      announce(`行高已调整为 ${(val / 10).toFixed(1)}倍`);
    });
  }

  if (lhIncBtn && lhSlider) {
    lhIncBtn.addEventListener("click", () => {
      const val = Math.min(30, activeSettings.lineHeight + 1);
      activeSettings.lineHeight = val;
      saveSetting("line-height", val);
      applySettings(activeSettings);
      announce(`行高已调整为 ${(val / 10).toFixed(1)}倍`);
    });
  }

  // 主题切换绑定
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-a11y-theme");
      activeSettings.theme = theme;
      saveSetting("theme", theme);
      applySettings(activeSettings);
      const label = btn.querySelector(".theme-label")?.textContent || theme;
      announce(`主题配色已更改为 ${label}`);
    });
  });

  // 辅助开关事件绑定
  if (toggleDyslexic) {
    toggleDyslexic.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      activeSettings.dyslexic = isChecked;
      saveSetting("dyslexic", isChecked);
      applySettings(activeSettings);
      announce(isChecked ? "护眼衬线字体已开启" : "护眼衬线字体已关闭");
    });
  }

  if (toggleRuler) {
    toggleRuler.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      activeSettings.ruler = isChecked;
      saveSetting("ruler", isChecked);
      applySettings(activeSettings);
      announce(isChecked ? "专注遮罩尺已开启" : "专注遮罩尺已关闭");
    });
  }

  if (toggleLeftHanded) {
    toggleLeftHanded.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      activeSettings.leftHanded = isChecked;
      saveSetting("left-handed", isChecked);
      applySettings(activeSettings);
      announce(isChecked ? "左手模式已开启" : "左手模式已关闭");
    });
  }

  if (toggleColorblind) {
    toggleColorblind.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      activeSettings.colorblindEnabled = isChecked;
      saveSetting("colorblind-enabled", isChecked);
      applySettings(activeSettings);
      announce(isChecked ? "色盲模拟已开启" : "色盲模拟已关闭");
    });
  }

  if (colorblindSelect) {
    colorblindSelect.addEventListener("change", (e) => {
      const mode = e.target.value;
      activeSettings.colorblindMode = mode;
      saveSetting("colorblind-mode", mode);
      applySettings(activeSettings);
      const labels = {
        protanopia: "红色盲",
        deuteranopia: "绿色盲",
        tritanopia: "蓝色盲",
      };
      announce(`色盲模式已更改为 ${labels[mode] || mode}`);
    });
  }

  if (toggleDeveloper) {
    toggleDeveloper.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      activeSettings.developerEnabled = isChecked;
      saveSetting("developer-enabled", isChecked);
      applySettings(activeSettings);
      announce(isChecked ? "开发者色彩微调已开启" : "开发者色彩微调已关闭");
    });
  }

  if (developerSlider) {
    developerSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      activeSettings.customHue = val;
      saveSetting("custom-hue", val);
      applySettings(activeSettings);
    });
  }

  if (developerInput) {
    developerInput.addEventListener("change", (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = DEFAULTS.customHue;
      val = Math.max(0, Math.min(360, val));
      activeSettings.customHue = val;
      saveSetting("custom-hue", val);
      applySettings(activeSettings);
      announce(`色相已手动微调为 ${val}°`);
    });
  }

  // 重置按钮绑定
  if (a11yResetBtn) {
    a11yResetBtn.addEventListener("click", () => {
      activeSettings = { ...DEFAULTS };
      try {
        localStorage.removeItem("a11y-theme");
        localStorage.removeItem("a11y-font-size");
        localStorage.removeItem("a11y-line-height");
        localStorage.removeItem("a11y-dyslexic");
        localStorage.removeItem("a11y-ruler");
        localStorage.removeItem("a11y-left-handed");
        localStorage.removeItem("a11y-colorblind-enabled");
        localStorage.removeItem("a11y-colorblind-mode");
        localStorage.removeItem("a11y-developer-enabled");
        localStorage.removeItem("a11y-custom-hue");
      } catch (e) {}
      applySettings(activeSettings);
      announce("设置已重置为默认值");
    });
  }

  // 专注遮罩视口位置更新
  function updateRulerPosition(clientY) {
    if (!rulerTop || !rulerBottom) return;
    const windowHeight = 80;
    const topEdge = Math.max(0, clientY - windowHeight / 2);
    const bottomEdge = Math.min(window.innerHeight, clientY + windowHeight / 2);

    rulerTop.style.height = `${topEdge}px`;
    rulerBottom.style.top = `${bottomEdge}px`;
  }

  let ticking = false;
  function handleMove(clientY) {
    if (!activeSettings.ruler) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateRulerPosition(clientY);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      handleMove(e.clientY);
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientY);
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientY);
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "resize",
    () => {
      if (activeSettings.ruler) {
        updateRulerPosition(window.innerHeight / 2);
      }
    },
    { passive: true },
  );
});
