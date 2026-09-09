---
title: 遊蹤
layout: page
comments: false
footprints: true
---

<link rel="stylesheet" href="/vendor/maplibre-gl/maplibre-gl.css?v=5.24.0">

<div class="footprints-toolbar" aria-label="足迹筛选">
  <input id="footprints-place" type="search" placeholder="搜索地点" aria-label="搜索地点" autocomplete="off">
</div>
<div id="footprints-map" aria-label="足迹地图" role="application"></div>
<p id="footprints-status" class="footprints-status" role="status" aria-live="polite">正在加载足迹数据…</p>

<script src="/vendor/maplibre-gl/maplibre-gl.js?v=5.24.0"></script>
<script>
// 立即初始化：本脚本位于 maplibre-gl.js 与地图 DOM 之后，无需等待 window.load。
// 否则要等整页图片等资源全部加载完才开始请求底图样式，弱网下白屏时间被无谓拉长。
(function () {
  var status = document.getElementById('footprints-status');
  var mapEl = document.getElementById('footprints-map');
  function setStatus(message) { status.textContent = message; }
  document.documentElement.classList.add('footprints-document');
  ['.single-column-header-container', '.post-head-wrapper-text-only', '.single-column-footer'].forEach(function (selector) {
    var element = document.querySelector(selector);
    if (element) element.hidden = true;
  });
  // 底图就绪前容器保持加载态（CSS 脉冲提示），首个 idle 或致命错误后移除。
  mapEl.classList.add('is-loading');
  function stopLoading() { mapEl.classList.remove('is-loading'); }

  // MapTiler 前端 key（公开可见，已在 MapTiler 后台配置域名白名单：localhost + 正式域名）。
  // 底图为矢量瓦片，通过 name:zh 字段显示中文标注，覆盖全球城市。
  var MAPTILER_KEY = 'EQVBtata7TLz29eg1rtO';
  var STYLE_URL = 'https://api.maptiler.com/maps/streets-v2/style.json?key=' + MAPTILER_KEY;

  // 缩放配置。核心场景：城市级足迹查看——进入页面自动框住全部标记，
  // 滚轮/捏合缩放用于局部观察，不提供街道级放大。
  // 边界条件（与矢量瓦片覆盖范围对齐）：
  //   floor        最小缩放硬下限（z=2 无法铺满世界），实际下限会随视口在 clampZoom 中动态抬高；
  //   ceiling      最大缩放 8 级：城市轮廓细节，保持一致的全球中文注记；
  //   fitPadding   初次框选时标记距视口边缘的留白（px）；
  //   fitCeiling   多点框选的缩放上限，防止邻近标记（如上海/苏州）把视图拉得过近；
  //   singleZoom   筛选后仅剩一个标记时的固定缩放。
  var ZOOM = { floor: 3, ceiling: 8, fitPadding: 48, fitCeiling: 7, singleZoom: 7 };
  // 平移边界：略微内收于墨卡托世界范围。maplibre v5 在 maxBounds 恰好等于
  // ±180/±85.05 全世界范围时，约束计算会触发空矩阵崩溃，故各向内收 0.1°。
  var worldBounds = [[-179.9, -84.99], [179.9, 84.99]];

  // 低缩放层级（国家/省州，瓦片数据源为 Natural Earth）只提供 name:zh 字段，且其内容
  // 常为繁体（蒙古國、泰國、山東省…）；高缩放层级的城市/POI 另有 name:zh-Hans 简体字段。
  // GL 样式表达式不支持逐字繁简转换，故对默认视野（中国及周边、缩到最小时全球国家名）
  // 可见的繁体地名做一张精确的繁→简对照表（key 取自实际瓦片文本）；未命中的原样透传。
  var LABEL_T2S = {
    // —— 国家 / 地区 ——
    '阿爾巴尼亞': '阿尔巴尼亚', '阿爾及利亞': '阿尔及利亚', '南極洲': '南极洲',
    '亞美尼亞': '亚美尼亚', '阿魯巴': '阿鲁巴', '奧地利': '奥地利',
    '孟加拉國': '孟加拉国', '白俄羅斯': '白俄罗斯', '比利時': '比利时',
    '貝南': '贝宁', '玻利維亞': '玻利维亚', '布吉納法索': '布基纳法索',
    '開曼群島': '开曼群岛', '中非共和國': '中非共和国', '克羅地亞': '克罗地亚',
    '丹麥': '丹麦', '薩爾瓦多': '萨尔瓦多', '厄立特里亞': '厄立特里亚',
    '愛沙尼亞': '爱沙尼亚', '福克蘭群島': '福克兰群岛', '斐濟': '斐济',
    '芬蘭': '芬兰', '法國': '法国', '法屬玻里尼西亞': '法属波利尼西亚',
    '德國': '德国', '迦納': '加纳', '直布羅陀': '直布罗陀',
    '畿內亞比紹': '几内亚比绍', '冰島': '冰岛', '愛爾蘭共和國': '爱尔兰共和国',
    '牙買加': '牙买加', '約旦': '约旦', '老撾': '老挝',
    '拉脫維亞': '拉脱维亚', '利比里亞': '利比里亚', '利比亞': '利比亚',
    '澳門': '澳门', '馬達加斯加': '马达加斯加', '馬拉威': '马拉维',
    '馬來西亞': '马来西亚', '毛里塔尼亞': '毛里塔尼亚', '摩爾多瓦': '摩尔多瓦',
    '摩納哥': '摩纳哥', '蒙古國': '蒙古国', '蒙特內哥羅': '黑山',
    '緬甸': '缅甸', '尼泊爾': '尼泊尔', '荷蘭': '荷兰',
    '新喀里多尼亞': '新喀里多尼亚', '奈及利亞': '尼日利亚',
    '朝鮮民主主義人民共和國': '朝鲜民主主义人民共和国', '巴拿馬': '巴拿马',
    '菲律賓': '菲律宾', '波蘭': '波兰', '剛果共和國': '刚果共和国',
    '羅馬尼亞': '罗马尼亚', '塞爾維亞': '塞尔维亚', '斯洛文尼亞': '斯洛文尼亚',
    '索馬里': '索马里', '南蘇丹': '南苏丹', '斯里蘭卡': '斯里兰卡',
    '蘇利南': '苏里南', '敘利亞': '叙利亚', '中華民國': '中国台湾',
    '坦桑尼亞': '坦桑尼亚', '泰國': '泰国', '巴哈馬': '巴哈马',
    '岡比亞': '冈比亚', '東帝汶': '东帝汶', '千里達及托巴哥': '特立尼达和多巴哥',
    '突尼西亞': '突尼斯', '土庫曼': '土库曼斯坦', '烏干達': '乌干达',
    '烏克蘭': '乌克兰', '美國': '美国', '烏拉圭': '乌拉圭',
    '萬那杜': '瓦努阿图', '梵蒂岡城國': '梵蒂冈城国', '委內瑞拉': '委内瑞拉',
    '約旦河西岸地區': '约旦河西岸地区', '贊比亞': '赞比亚',
    // —— 中国省级（数据多已简体，此处兜底少数仍为繁体的写法）——
    '山東省': '山东省', '廣東省': '广东省', '遼寧省': '辽宁省',
    '陝西省': '陕西省', '甘肅省': '甘肃省', '雲南省': '云南省',
    '貴州省': '贵州省', '江蘇省': '江苏省', '黑龍江省': '黑龙江省',
    '台灣省': '台湾省', '重慶市': '重庆市', '內蒙古自治區': '内蒙古自治区',
    '廣西壯族自治區': '广西壮族自治区', '西藏自治區': '西藏自治区',
    '寧夏回族自治區': '宁夏回族自治区', '新疆維吾爾自治區': '新疆维吾尔自治区'
  };

  // 简体中文标注：name:zh-Hans（简体）最优先；其次把 name:zh 中已知繁体地名
  // 映射为简体；再回退拉丁/英文/本地名，保证外国地名也尽量显示中文。
  function chineseLabelField() {
    var zhMatch = ['match', ['get', 'name:zh']];
    Object.keys(LABEL_T2S).forEach(function (k) { zhMatch.push(k, LABEL_T2S[k]); });
    zhMatch.push(['get', 'name:zh']); // 未命中对照表：原样透传
    return ['coalesce',
      ['get', 'name:zh-Hans'],
      zhMatch,
      ['get', 'name:latin'],
      ['get', 'name:en'],
      ['get', 'name']
    ];
  }

  // 判断 text-field 是否为“地名/道路名”类标注。路牌号（ref）、门牌号、
  // 机场 IATA/ICAO 代码等属于语言无关的数字/编码，不应被中文字段覆盖。
  function isPlaceLabel(textField) {
    var flat = JSON.stringify(textField);
    if (!/name/i.test(flat)) return false;
    if (/housenumber|\biata\b|\bicao\b/.test(flat)) return false;
    if (/(^|[^a-z])ref([^a-z]|$)/.test(flat)) return false;  // 高速/国道路牌数字
    return true;
  }

  // 关键：样式 JSON 在交给地图构造函数“之前”就把所有文字图层的 text-field
  // 改写为中文标注。若先用默认样式渲染、再在 load 事件里改字段，首帧已经是
  // 英文标注（load 在首帧渲染完成后才触发），页面上会“英文闪一下”。
  function localizeStyle(style) {
    if (style && Array.isArray(style.layers)) {
      style.layers.forEach(function (layer) {
        if (layer.layout && layer.layout['text-field'] !== undefined && isPlaceLabel(layer.layout['text-field'])) {
          layer.layout['text-field'] = chineseLabelField();
        }
      });
    }
    return style;
  }

  var map;

  // 鉴权/配额类失败给出可读错误，避免地图无限转圈。
  var fatalReported = false;
  function reportFatal(message) {
    if (fatalReported) return;
    fatalReported = true;
    stopLoading();
    setStatus(message);
  }

  // 带重试的 JSON 请求：网络抖动 / 5xx / 429 自动重试一次；
  // 401/403 等鉴权错误重试无意义，直接抛出由调用方提示。
  function fetchJson(url, remainingRetries) {
    return fetch(url).then(function (response) {
      if (!response.ok) {
        var err = new Error('HTTP ' + response.status);
        err.status = response.status;
        throw err;
      }
      return response.json();
    }).catch(function (error) {
      var retriable = !error.status || error.status === 429 || error.status >= 500;
      if (remainingRetries > 0 && retriable) {
        return new Promise(function (resolve) { window.setTimeout(resolve, 900); })
          .then(function () { return fetchJson(url, remainingRetries - 1); });
      }
      throw error;
    });
  }

  // 动态抬高最小缩放：保证世界瓦片始终铺满视口较长边，
  // 避免缩得太小时露出底图外空白；视口尺寸变化后重新夹取。
  function clampZoom() {
    var el = document.getElementById('footprints-map');
    var size = Math.max(el.clientWidth || 0, el.clientHeight || 0);
    var floor = Math.max(ZOOM.floor, Math.ceil(Math.log2(size / 512)));
    map.setMinZoom(floor);
    if (map.getZoom() < floor) map.setZoom(floor);
  }

  var allData;
  var mapReady = false;      // map 'load' 已触发：样式就绪，可以放置 HTML 标记
  var boundsReady = false;   // 首个 idle 已过：变换矩阵稳定，可以 setMaxBounds / fitBounds
  var markerCache = {};
  var placeInput = document.getElementById('footprints-place');

  // 首次自动框选必须在“边界已生效 + 数据已就绪”之后再执行：maplibre v5 在样式/
  // 矩阵尚未就绪的早期阶段执行 maxBounds / fitBounds 的约束路径会触发空矩阵崩溃，
  // 故将 setMaxBounds 与首次 fitBounds 都放到首个 idle 之后。
  function initialFitIfReady() {
    if (boundsReady && allData) renderFootprints(true);
  }
  // 标记放置只需样式就绪；数据与地图任一先到都等另一方就绪后再渲染。
  function renderMarkersIfReady() {
    if (mapReady && allData) renderFootprints(false);
  }

  // 底图样式与足迹数据并行拉取，互不等待——弱网下两者耗时由“相加”变为“取最大值”。
  // 样式 JSON 在构造地图前完成中文本地化，首帧即为中文底图，不会闪英文。
  setStatus('正在加载地图底图…');
  var stylePromise = fetchJson(STYLE_URL, 1).then(localizeStyle);
  var dataPromise = fetchJson('footprints.geojson', 1);

  dataPromise.then(function (data) {
    allData = data;
    var searchTimer;
    placeInput.addEventListener('input', function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () { renderFootprints(false); }, 120);
    });
    renderMarkersIfReady();
    initialFitIfReady();
  }).catch(function () {
    setStatus('足迹数据加载失败，请刷新页面后重试。');
  });

  stylePromise.then(function (style) {
    map = new maplibregl.Map({
      container: 'footprints-map',
      style: style,
      center: [109, 35.5],
      zoom: 4,
      minZoom: ZOOM.floor,
      maxZoom: ZOOM.ceiling,
      renderWorldCopies: false,
      attributionControl: false,
      refreshExpiredTiles: false,
      // 关闭自动 ResizeObserver 驱动的 resize：样式加载完成前的早期 resize 会走
      // transform 约束路径并触发 maplibre v5 空矩阵崩溃。改为布局稳定后手动 resize。
      trackResize: false,
      pitch: 0,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      // 矢量字形若缺少中文，则回退到系统 CJK 字体，保证中文标注完整渲染。
      localIdeographFontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif'
    });

    // 样式已成功拉取后，瓦片/字形/精灵等资源仍可能鉴权失败。
    map.on('error', function (event) {
      var err = event && event.error;
      if (err && (err.status === 401 || err.status === 403)) {
        reportFatal('地图底图鉴权失败（MapTiler key 无效、域名未加白名单或超出配额），请稍后再试。');
      }
    });

    map.on('load', function () {
      mapReady = true;
      // 手动 resize：trackResize 已关闭，需在样式就绪后显式同步一次容器尺寸，
      // 之后监听 window resize 节流同步，保证全屏布局尺寸变化时地图正确适配。
      function syncSize() { map.resize(); clampZoom(); }
      window.addEventListener('resize', function () {
        window.clearTimeout(syncSize._t);
        syncSize._t = window.setTimeout(syncSize, 150);
      });

      map.once('idle', function () {
        syncSize();                    // 布局稳定后按最终尺寸 resize
        map.setMaxBounds(worldBounds);
        boundsReady = true;
        stopLoading();                 // 底图首帧完整呈现，移除加载脉冲
        // resize 与 maxBounds 同一帧内生效，变换矩阵需一帧才能稳定；
        // 延后一帧再做首次框选，确保 fitBounds 按最终容器尺寸计算留白（标记不被裁切）。
        window.requestAnimationFrame(function () { initialFitIfReady(); });
      });

      renderMarkersIfReady();
    });
  }).catch(function (error) {
    stopLoading();
    if (error && (error.status === 401 || error.status === 403)) {
      reportFatal('地图底图鉴权失败（MapTiler key 无效、域名未加白名单或超出配额），请稍后再试。');
    } else {
      setStatus('地图底图加载失败，请检查网络后刷新页面重试。');
    }
  });

  function buildPopup(name, visits) {
    var rows = visits.map(function (visit) {
      var postUrl = visit.url || '../' + encodeURIComponent(visit.post) + '/';
      return '<li><time>' + escapeHtml(visit.date) + '</time> · <a href="' + escapeHtml(postUrl) + '">' + escapeHtml(visit.post) + '</a></li>';
    }).join('');
    return new maplibregl.Popup({ offset: 18, closeButton: true, closeOnClick: true, maxWidth: '280px' })
      .setHTML('<div class="footprints-popup"><h3>' + escapeHtml(name) + '</h3><ul>' + rows + '</ul></div>');
  }

  function renderFootprints(fitMap) {
      var place = placeInput.value.trim().toLocaleLowerCase();
      var filtered = {
        type: 'FeatureCollection',
        features: allData.features.map(function (feature) {
          var visits = feature.properties.visits.slice();
          if (place && feature.properties.name.toLocaleLowerCase().indexOf(place) < 0) visits = [];
          return { type: 'Feature', properties: { name: feature.properties.name, visits: visits }, geometry: feature.geometry };
        }).filter(function (feature) { return feature.properties.visits.length; })
      };
      var totalVisits = 0;
      var visibleNames = {};
      var bounds = [];
      filtered.features.forEach(function (feature) {
        var name = feature.properties.name;
        var visits = feature.properties.visits.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
        var count = visits.length;
        totalVisits += count;
        visibleNames[name] = true;
        // GeoJSON 坐标为 [经度, 纬度]，MapLibre 直接使用该顺序。
        var lngLat = feature.geometry.coordinates;
        bounds.push(lngLat);

        var cache = markerCache[name];
        if (!cache) {
          var el = document.createElement('div');
          el.className = 'footprints-marker';
          var marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat(lngLat)
            .addTo(map);
          cache = markerCache[name] = { marker: marker, el: el, on: true };
        }
        cache.el.innerHTML = escapeHtml(name) + '<span class="footprints-marker-count">' + count + '</span>';
        cache.marker.setPopup(buildPopup(name, visits));
        if (!cache.on) { cache.marker.addTo(map); cache.on = true; }
      });
      Object.keys(markerCache).forEach(function (name) {
        if (!visibleNames[name]) {
          var cache = markerCache[name];
          if (cache.on) { cache.marker.remove(); cache.on = false; }
        }
      });
      if (fitMap && bounds.length) {
        if (bounds.length === 1) {
          map.jumpTo({ center: bounds[0], zoom: ZOOM.singleZoom });
        } else {
          // padding 为统一留白，fitBounds 自会选取能容纳全部标记的最高缩放。
          var lngs = bounds.map(function (p) { return p[0]; });
          var lats = bounds.map(function (p) { return p[1]; });
          map.fitBounds(
            [[Math.min.apply(null, lngs), Math.min.apply(null, lats)],
             [Math.max.apply(null, lngs), Math.max.apply(null, lats)]],
            { padding: ZOOM.fitPadding, maxZoom: ZOOM.fitCeiling, animate: false, duration: 0 }
          );
        }
      }
      setStatus(filtered.features.length ? '已显示 ' + filtered.features.length + ' 个地点，共 ' + totalVisits + ' 次足迹。' : '没有符合筛选条件的足迹。');
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
})();
</script>
