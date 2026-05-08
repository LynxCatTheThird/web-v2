const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");
const katex = require("katex");

// 注册 mhchem 扩展（副作用式加载，为 \ce{} 化学方程式提供支持）
require("katex/contrib/mhchem");

// 引入现代化的 @mdit 插件矩阵
const { abbr } = require("@mdit/plugin-abbr");
const { dl } = require("@mdit/plugin-dl");
const { footnote } = require("@mdit/plugin-footnote");
const { ins } = require("@mdit/plugin-ins");
const { mark } = require("@mdit/plugin-mark");
const { sub } = require("@mdit/plugin-sub");
const { sup } = require("@mdit/plugin-sup");
const { tasklist } = require("@mdit/plugin-tasklist");
const { spoiler } = require("@mdit/plugin-spoiler");

// 初始化渲染器
const md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    const language = (lang || "").trim();
    let highlighted;
    if (language && hljs.getLanguage(language)) {
      try {
        highlighted = hljs.highlight(str, {
          language,
          ignoreIllegals: true,
        }).value;
      } catch (__) {
        highlighted = md.utils.escapeHtml(str);
      }
    } else {
      highlighted = md.utils.escapeHtml(str);
    }

    const languageClass = language
      ? ` language-${md.utils.escapeHtml(language.replace(/\s+/g, "-"))}`
      : "";
    const languageLabel = language || "code";
    return `<pre data-language="${md.utils.escapeHtml(languageLabel)}"><code class="hljs${languageClass}">${highlighted}</code></pre>`;
  },
});

// 挂载插件
md.use(abbr)
  .use(dl)
  .use(footnote)
  .use(ins)
  .use(mark)
  .use(sub)
  .use(sup)
  .use(tasklist)
  .use(spoiler);

// ---------------------------------------------------------------------------
// KaTeX 服务端渲染
// ---------------------------------------------------------------------------

/**
 * 从 Markdown 源文本中提取数学公式，替换为 HTML 注释占位符，
 * 使其安全地通过 markdown-it 处理而不被破坏（如 _ 被解释为斜体）。
 *
 * 处理流程：
 * 1. 保护代码块和行内代码（避免在其中匹配到 $ 符号）
 * 2. 提取 display math ($$...$$ 和 \[...\]) 和 inline math ($...$ 和 \(...\))
 * 3. 用 KaTeX 渲染为 HTML
 * 4. 用占位符替换原始公式
 * 5. markdown-it 渲染后，恢复占位符为渲染后的 HTML
 */
function extractMath(text) {
  const rendered = [];
  let counter = 0;
  const marker = (id) => `<!--KTX:${id}-->`;

  // ---- 第一步：保护代码块 ----
  const codeSlots = [];
  let codeId = 0;
  const codeMark = (id) => `\x00C${id}\x00`;

  // 围栏代码块（```/~~~）
  text = text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1\s*$/gm, (m) => {
    codeSlots[codeId] = m;
    return codeMark(codeId++);
  });
  // 行内代码
  text = text.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (m) => {
    codeSlots[codeId] = m;
    return codeMark(codeId++);
  });

  // ---- 第二步：提取并渲染数学公式 ----
  const render = (math, display) => {
    const id = counter++;
    try {
      rendered[id] = katex.renderToString(math.trim(), {
        displayMode: display,
        throwOnError: false,
      });
    } catch (_) {
      rendered[id] = `<span class="katex-error">${md.utils.escapeHtml(math)}</span>`;
    }
    return marker(id);
  };

  // Display math: $$...$$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, m) => render(m, true));
  // Display math: \[...\]
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => render(m, true));
  // Inline math: $...$（不匹配 $$，不跨行）
  text = text.replace(/(?<!\$)\$(?!\$)([^\$\n]+?)\$(?!\$)/g, (_, m) => render(m, false));
  // Inline math: \(...\)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, m) => render(m, false));

  // ---- 第三步：恢复代码块 ----
  for (let i = 0; i < codeSlots.length; i++) {
    text = text.replace(codeMark(i), codeSlots[i]);
  }

  return { text, rendered, marker };
}

function restoreMath(html, rendered, marker) {
  for (let i = 0; i < rendered.length; i++) {
    html = html.replace(marker(i), rendered[i]);
  }
  return html;
}

// 注册 Hexo 渲染器
hexo.extend.renderer.register(
  "md",
  "html",
  function (data, options) {
    const { text, rendered, marker } = extractMath(data.text);
    const html = md.render(text);
    return restoreMath(html, rendered, marker);
  },
  true,
);
