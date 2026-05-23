(function () {
  window.renderers.push(() => {
    const searchBar = document.getElementById("search-bar");
    const timelineWrap = document.getElementById("timeline-wrap");
    const searchResultsWrap = document.getElementById("search-results-wrap");
    const searchResultsList = document.getElementById("search-results-list");
    const clearBtn = document.getElementById("search-results-clear");

    if (!searchBar || !timelineWrap || !searchResultsWrap || !searchResultsList) return;

    let searchData = null;
    let isFetching = false;

    // 清除正则元字符转义辅助函数
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // 正则全局不区分大小写匹配并保留原始大小写的关键字高亮渲染
    function highlightText(text, keywords) {
      if (!keywords || keywords.length === 0) return text;
      let highlighted = text;
      keywords.forEach(keyword => {
        const escaped = escapeRegExp(keyword);
        const regex = new RegExp(`(${escaped})`, "gi");
        highlighted = highlighted.replace(regex, '<mark class="search-keyword">$1</mark>');
      });
      return highlighted;
    }

    // 高效剥离 HTML 标签获取纯文本正文内容
    function stripHtml(html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }

    // 懒加载并在内存中缓存 search.xml 索引数据
    function loadSearchData(callback) {
      if (searchData) {
        callback(searchData);
        return;
      }
      if (isFetching) return;
      isFetching = true;

      fetch("/search.xml")
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "text/xml");
          const entries = Array.from(xmlDoc.getElementsByTagName("entry")).map(entry => {
            const title = entry.getElementsByTagName("title")[0]?.textContent || "无题";
            const url = entry.getElementsByTagName("url")[0]?.textContent || "";
            const content = entry.getElementsByTagName("content")[0]?.textContent || "";
            const categories = Array.from(entry.getElementsByTagName("category")).map(c => c.textContent);
            const tags = Array.from(entry.getElementsByTagName("tag")).map(t => t.textContent);
            const date = entry.getElementsByTagName("date")[0]?.textContent || "";

            return {
              title,
              url,
              contentText: stripHtml(content),
              categories,
              tags,
              date
            };
          });
          searchData = entries;
          isFetching = false;
          callback(searchData);
        })
        .catch(err => {
          console.error("加载搜索索引数据失败:", err);
          isFetching = false;
        });
    }

    // 渲染全文检索匹配结果卡片
    function renderResults(results, keywords) {
      timelineWrap.style.display = "none";
      searchResultsWrap.style.display = "block";

      if (results.length === 0) {
        searchResultsList.innerHTML = `
          <div class="search-no-results">
            <i class="fa-solid fa-folder-open"></i>
            未找到与该检索词相关的匹配内容，请尝试更换其他关键词。
          </div>
        `;
        return;
      }

      let html = "";
      results.forEach(item => {
        const { entry, previewText } = item;
        const highlightedTitle = highlightText(entry.title, keywords);
        const highlightedPreview = highlightText(previewText, keywords);

        let metaHtml = "";
        if (entry.date) {
          const dateStr = entry.date.split("T")[0] || entry.date;
          metaHtml += `<span><i class="fa-regular fa-calendar fa-fw"></i> ${dateStr}</span>`;
        }
        if (entry.categories && entry.categories.length > 0) {
          metaHtml += `<span><i class="fa-solid fa-bookmark fa-fw"></i> ${entry.categories[0]}</span>`;
        }
        if (entry.tags && entry.tags.length > 0) {
          metaHtml += `<span><i class="fa-solid fa-tags fa-fw"></i> ${entry.tags.join(", ")}</span>`;
        }

        html += `
          <div class="search-result-item">
            <a href="${entry.url}">
              <h4>${highlightedTitle}</h4>
            </a>
            <div class="search-result-meta">${metaHtml}</div>
            <div class="search-result-content">${highlightedPreview}</div>
          </div>
        `;
      });

      searchResultsList.innerHTML = html;
    }

    // 输入框输入事件监听及全文比对评分算法
    searchBar.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        timelineWrap.style.display = "block";
        searchResultsWrap.style.display = "none";
        return;
      }

      loadSearchData(entries => {
        const keywords = query.split(/\s+/).filter(k => k.length > 0);
        if (keywords.length === 0) {
          timelineWrap.style.display = "block";
          searchResultsWrap.style.display = "none";
          return;
        }

        const results = [];
        entries.forEach(entry => {
          let score = 0;

          keywords.forEach(keyword => {
            if (entry.title.toLowerCase().includes(keyword)) {
              score += 100; // 标题匹配权重值最高
            }
            if (entry.contentText.toLowerCase().includes(keyword)) {
              score += 1; // 正文匹配权重较低
            }
            entry.categories.forEach(cat => {
              if (cat.toLowerCase().includes(keyword)) score += 5;
            });
            entry.tags.forEach(tag => {
              if (tag.toLowerCase().includes(keyword)) score += 5;
            });
          });

          if (score > 0) {
            // 根据第一个匹配关键词的位置动态裁切正文摘要以显示关联上下文
            let previewText = "";
            const textLower = entry.contentText.toLowerCase();
            let firstIdx = -1;
            
            keywords.forEach(keyword => {
              const idx = textLower.indexOf(keyword);
              if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
                firstIdx = idx;
              }
            });

            if (firstIdx !== -1) {
              const start = Math.max(0, firstIdx - 40);
              const end = Math.min(entry.contentText.length, firstIdx + 110);
              previewText = (start > 0 ? "..." : "") + entry.contentText.substring(start, end) + (end < entry.contentText.length ? "..." : "");
            } else {
              previewText = entry.contentText.substring(0, 150) + (entry.contentText.length > 150 ? "..." : "");
            }

            results.push({
              entry,
              score,
              previewText
            });
          }
        });

        // 依据匹配评分降序重排以展示最高相关度的结果
        results.sort((a, b) => b.score - a.score);
        renderResults(results, keywords);
      });
    });

    // 清除按钮点击事件
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchBar.value = "";
        timelineWrap.style.display = "block";
        searchResultsWrap.style.display = "none";
        searchBar.focus();
      });
    }
  });
})();
