# 新文章元数据模板

新增文章后运行 `npm run build` 即可自动编译页面样式、更新搜索索引和资源指纹；无需手工维护文章数量或索引 JSON。详见 [访问性能与新增文章](PERFORMANCE.md)。

将下面的 Front Matter 复制到新文章顶部；不需要的字段可以删除。日期统一使用 `YYYY-MM-DD`，游记坐标固定为 `[经度, 纬度]`。

```yaml
---
title: 2026 春日京都
date: 2026-04-10
updated: 2026-04-12
description: 京都赏樱与街巷散步记录。
featured_image: https://cdn.example.com/kyoto/cover.webp
featured_image_width: 1600
featured_image_height: 1067
tags:
  - 旅行
travel:
  place: 京都
  coordinates: [135.7681, 35.0116]
  date: 2026-04-10
---
```

说明：

- `description` 用于搜索摘要和社交分享卡片。
- `featured_image` 是首页和分享卡片的题图；推荐 WebP/AVIF，并保持文件名不可变。
- `featured_image_width`、`featured_image_height` 用于后续为题图预留稳定的显示空间。
- `travel` 是游记的结构化信息。当前仍需按 [FOOTPRINTS.md](FOOTPRINTS.md) 将地点加入 GeoJSON；后续可据此自动生成候选足迹数据。
- 文章中的普通图片已自动使用浏览器原生懒加载。首屏关键图可在 HTML 图片标签加上 `no-lazy` 类来跳过懒加载。
- 视频保持原生 `src`；未提供封面的视频会自动使用站内默认封面。重要视频建议手工提供真实 `poster` 封面；不要用脚本延迟替换视频地址。
