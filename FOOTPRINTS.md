# 足迹数据维护说明

足迹地图使用 [GeoJSON](https://geojson.org/) 格式，数据文件位于 `source/footprints/data.geojson`。每个 `Feature` 代表一座城市；同一城市的多次到访放在 `properties.visits` 中，因此不会出现重叠标记。

## 新增一次游记

若城市已经在地图中，只需要在该城市的 `visits` 数组末尾新增一项：

```json
{ "date": "2026-09-03", "post": "我的新游记" }
```

其中：

- `date`：建议使用 `YYYY-MM-DD`，以便地图按时间排序。
- `post`：博客文章标题。站点当前使用 `permalink: :name/`，地图会自动把它转换为文章链接。

如果文章使用了自定义永久链接，则额外提供 `url`：

```json
{
  "date": "2026-09-03",
  "post": "我的新游记",
  "url": "../custom-trip/"
}
```

`url` 是从足迹页 `/footprints/` 出发的相对地址；这样站点部署在子目录时仍能正常跳转。

## 新增一座城市

在 `features` 数组末尾添加以下对象，再填写经纬度。GeoJSON 坐标顺序固定为 `[经度, 纬度]`：

```json
{
  "type": "Feature",
  "properties": {
    "name": "城市名",
    "visits": [
      { "date": "2026-09-03", "post": "我的新游记" }
    ]
  },
  "geometry": {
    "type": "Point",
    "coordinates": [116.4074, 39.9042]
  }
}
```

修改完成后运行 `hexo generate` 或本地预览服务，地图会自动读取更新后的数据。
