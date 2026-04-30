# 安装与基础配置

## 1. 安装

```bash
cd themes
git clone https://github.com/LynxCatTheThird/hexo-theme-particlex.git particlex --depth=1
```

然后在根目录 `_config.yml` 设置主题为 particlex 即可。

```yaml
theme: particlex
```

## 2. 关闭自带代码高亮

Hexo 有自带的代码高亮，但是和 ParticleX 的不兼容。

```yaml
highlight:
  enable: false
prismjs:
  enable: false
```

如果使用 Hexo 7.0.0 之后的版本只需要修改为：

```yaml
syntax_highlighter:
```

如果使用 Pandoc 还需要设置一下：

```yaml
pandoc:
  extra:
    - no-highlight:
```

## 3. 禁用年度月度归档

Hexo 会自动生成年度月度归档，可是 ParticleX 主题没有这个功能。

```yaml
archive_generator:
  enabled: true
  per_page: 0
  yearly: false
  monthly: false
  daily: false
```

修改完请 `hexo clean` 清除缓存。
