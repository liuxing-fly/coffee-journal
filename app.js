// Coffee Journal App - 咖啡日志
// Single-page app using localStorage for persistence

// ==================== Data Layer ====================

var DB = {
  beans: JSON.parse(localStorage.getItem('cj_beans') || '[]'),
  brews: JSON.parse(localStorage.getItem('cj_brews') || '[]'),
  settings: JSON.parse(localStorage.getItem('cj_settings') || '{}')
};

function saveDB() {
  try {
    localStorage.setItem('cj_beans', JSON.stringify(DB.beans));
    localStorage.setItem('cj_brews', JSON.stringify(DB.brews));
    localStorage.setItem('cj_settings', JSON.stringify(DB.settings));
  } catch (e) {
    toast('存储空间不足，请先导出数据');
  }
}

function genId() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
}

// ==================== Coffee Data Constants ====================

var ROAST_LEVELS = [
  { key: 'extra-light', label: '极浅烘', agtron: '90-100', temp: '180-195', color: '#E8D5C0', level: 1, desc: '保留产地风味，花香果酸极致' },
  { key: 'light', label: '浅烘', agtron: '80-95', temp: '190-205', color: '#D4A574', level: 2, desc: '保留原始风味，酸度明亮' },
  { key: 'light-medium', label: '浅中烘', agtron: '65-80', temp: '200-210', color: '#C4956A', level: 3, desc: '平衡酸甜，花果香明显' },
  { key: 'medium', label: '中烘', agtron: '55-65', temp: '210-220', color: '#A0785A', level: 4, desc: '均衡口感，坚果巧克力调' },
  { key: 'medium-dark', label: '中深烘', agtron: '45-55', temp: '215-225', color: '#7B5B4A', level: 5, desc: '焦糖甜感，醇厚度增加' },
  { key: 'dark', label: '深烘', agtron: '35-45', temp: '220-230', color: '#4A2C2A', level: 6, desc: '浓郁烟熏，苦甜交织' },
  { key: 'very-dark', label: '极深烘', agtron: '25-35', temp: '225-235', color: '#2D1810', level: 7, desc: '强烈焦苦，油脂丰富' }
];

var PROCESSES = [
  { key: 'washed', label: '水洗', desc: '干净明亮，酸度突出' },
  { key: 'natural', label: '日晒', desc: '果味浓郁，甜感饱满' },
  { key: 'honey', label: '蜜处理', desc: '甜度适中，口感柔和' },
  { key: 'anaerobic', label: '厌氧发酵', desc: '独特风味，层次丰富' },
  { key: 'wet-hulled', label: '湿刨法', desc: '草本香料，醇厚低酸' },
  { key: 'carbonic', label: '碳酸浸渍', desc: '水果酒感，酸甜活泼' },
  { key: 'other', label: '其他', desc: '其他处理方式' }
];

var VARIETIES = [
  { key: '74110', label: '74110' },
  { key: '74112', label: '74112' },
  { key: '74140', label: '74140' },
  { key: '74148', label: '74148' },
  { key: '74158', label: '74158' },
  { key: '74165', label: '74165' },
  { key: '74213', label: '74213' },
  { key: 'eth-heirloom', label: '埃塞原生种 Heirloom' },
  { key: 'typica', label: '铁皮卡 Typica' },
  { key: 'kona', label: '科纳 Kona Typica' },
  { key: 'blue-mountain', label: '蓝山 Blue Mountain' },
  { key: 'maragogipe', label: '象豆 Maragogipe' },
  { key: 'kent', label: '肯特 Kent' },
  { key: 'bourbon', label: '波旁 Bourbon' },
  { key: 'red-bourbon', label: '红波旁 Red Bourbon' },
  { key: 'yellow-bourbon', label: '黄波旁 Yellow Bourbon' },
  { key: 'orange-bourbon', label: '橙波旁 Orange Bourbon' },
  { key: 'pink-bourbon', label: '粉波旁 Pink Bourbon' },
  { key: 'jackson', label: '杰克逊 Jackson' },
  { key: 'geisha', label: '瑰夏 Geisha' },
  { key: 'gesha-eth', label: '戈夏 Gesha (埃塞原产)' },
  { key: 'sl28', label: 'SL28' },
  { key: 'sl34', label: 'SL34' },
  { key: 'sl14', label: 'SL14' },
  { key: 'caturra', label: '卡杜拉 Caturra' },
  { key: 'catuai', label: '卡图艾 Catuai' },
  { key: 'catucai', label: '卡图凯 Catucai' },
  { key: 'pacamara', label: '帕卡马拉 Pacamara' },
  { key: 'pacas', label: '帕卡斯 Pacas' },
  { key: 'villa-sarchi', label: '薇拉萨奇 Villa Sarchi' },
  { key: 'villalobos', label: '薇拉洛博 Villalobos' },
  { key: 'sarchimor', label: '萨奇摩 Sarchimor' },
  { key: 'marsellesa', label: '马塞莱萨 Marsellesa' },
  { key: 'tabi', label: '塔比 Tabi' },
  { key: 'castillo', label: '卡斯蒂略 Castillo' },
  { key: 'colombia-var', label: '哥伦比亚 Colombia' },
  { key: 'mundo-novo', label: '蒙多诺沃 Mundo Novo' },
  { key: 'obata', label: '奥巴塔 Obata' },
  { key: 'arara', label: '阿拉拉 Arara' },
  { key: 'icatu', label: '伊卡图 Icatu' },
  { key: 'acaia', label: '阿卡亚 Acaia' },
  { key: 'ruiru-11', label: 'Ruiru 11' },
  { key: 'batian', label: '巴蒂安 Batian' },
  { key: 'arabusta', label: '阿拉布斯塔 Arabusta' },
  { key: 'robusta', label: '罗布斯塔 Robusta' },
  { key: 'excelsa', label: '赖比瑞卡 Liberica / Excelsa' },
  { key: 'blend', label: '拼配 Blend' },
  { key: 'other', label: '其他 Other' }
];

var BREW_METHODS = [
  { key: 'pour-over', label: '手冲', icon: '\u2615', dose: [12, 18], ratio: 15, temp: [90, 96] },
  { key: 'espresso', label: '意式浓缩', icon: '\u2615', dose: [14, 20], ratio: 2, temp: [90, 96] },
  { key: 'iced-pour-over', label: '冰手冲', icon: '🧊', dose: [12, 18], ratio: 15, temp: [2, 10] },
  { key: 'french-press', label: '法压壶', icon: '\uD83E\uDED6', dose: [15, 22], ratio: 14, temp: [92, 96] },
  { key: 'moka-pot', label: '摩卡壶', icon: '\uD83D\uDD25', dose: [12, 18], ratio: 8, temp: [90, 96] },
  { key: 'aeropress', label: '爱乐压', icon: '\uD83C\uDD70\uFE0F', dose: [12, 18], ratio: 12, temp: [80, 96] },
  { key: 'cold-brew', label: '冷萃', icon: '\uD83E\uDDCA', dose: [30, 50], ratio: 8, temp: [2, 10] },
  { key: 'siphon', label: '虹吸壶', icon: '\uD83E\uDDEA', dose: [15, 22], ratio: 12, temp: [92, 96] },
  { key: 'chemex', label: 'Chemex', icon: '\u2697\uFE0F', dose: [14, 20], ratio: 16, temp: [90, 96] },
  { key: 'other', label: '其他', icon: '\uD83D\uDD18', dose: [10, 25], ratio: 12, temp: [80, 100] }
];

var FLAVOR_WHEEL = [
  { category: '花香', key: 'floral', color: '#E91E63', tags: ['茉莉', '玫瑰', '薰衣草', '洋甘菊', '接骨木花', '橙花'] },
  { category: '柑橘', key: 'citrus', color: '#FF9800', tags: ['柠檬', '橙子', '葡萄柚', '青柠', '柑橘', '佛手柑'] },
  { category: '浆果', key: 'berry', color: '#E74C3C', tags: ['蓝莓', '草莓', '覆盆子', '黑莓', '蔓越莓', '黑加仑'] },
  { category: '热带水果', key: 'tropical', color: '#FF5722', tags: ['芒果', '菠萝', '百香果', '荔枝', '木瓜', '香蕉'] },
  { category: '核果', key: 'stone-fruit', color: '#F06292', tags: ['桃子', '杏子', '樱桃', '李子', '油桃', '西梅'] },
  { category: '巧克力', key: 'chocolate', color: '#5D4037', tags: ['黑巧克力', '牛奶巧克力', '可可', '摩卡', '法芙娜', '焦糖巧克力'] },
  { category: '焦糖', key: 'caramel', color: '#FF8F00', tags: ['红糖', '蜂蜜', '太妃糖', '枫糖', '蔗糖', '奶油糖'] },
  { category: '坚果', key: 'nutty', color: '#8D6E63', tags: ['杏仁', '核桃', '榛子', '花生', '腰果', '碧根果'] },
  { category: '香料', key: 'spice', color: '#795548', tags: ['肉桂', '丁香', '胡椒', '豆蔻', '八角', '姜'] },
  { category: '茶感', key: 'tea', color: '#4CAF50', tags: ['红茶', '绿茶', '乌龙茶', '伯爵茶', '抹茶', '白茶'] },
  { category: '烟熏', key: 'smoky', color: '#455A64', tags: ['烤面包', '烟草', '木炭', '烟熏', '焦糖烤', '烤坚果'] },
  { category: '酒感', key: 'wine', color: '#7B1FA2', tags: ['红酒', '威士忌', '朗姆酒', '白兰地', '果酒', '利口酒'] }
];

// ==================== Helper Functions ====================

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var _beanMap = {};
function rebuildBeanMap() {
  _beanMap = {};
  for (var i = 0; i < DB.beans.length; i++) {
    _beanMap[DB.beans[i].id] = DB.beans[i];
  }
}
function findBean(id) { return _beanMap[id] || null; }

function getRoast(key) {
  for (var i = 0; i < ROAST_LEVELS.length; i++) {
    if (ROAST_LEVELS[i].key === key) return ROAST_LEVELS[i];
  }
  return null;
}

function getMethod(key) {
  for (var i = 0; i < BREW_METHODS.length; i++) {
    if (BREW_METHODS[i].key === key) return BREW_METHODS[i];
  }
  return null;
}

function getProcess(key) {
  for (var i = 0; i < PROCESSES.length; i++) {
    if (PROCESSES[i].key === key) return PROCESSES[i];
  }
  return null;
}

function toast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2000);
}

function showPage(name) {
  var pages = ['home', 'beans', 'brews', 'analytics', 'settings'];
  for (var i = 0; i < pages.length; i++) {
    var el = document.getElementById('page-' + pages[i]);
    if (el) el.classList.toggle('active', pages[i] === name);
  }
  var navs = document.querySelectorAll('.nav-item');
  for (var j = 0; j < navs.length; j++) {
    navs[j].classList.toggle('active', j === pages.indexOf(name));
  }
  if (name === 'home') renderHome();
  else if (name === 'beans') renderBeans();
  else if (name === 'brews') renderBrews();
  else if (name === 'analytics') renderAnalytics();
  else if (name === 'settings') loadSettingsUI();
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function updateSlider(el) {
  var span = document.getElementById(el.id + '-val');
  if (span) span.textContent = el.value;
}

function timeAgo(ts) {
  if (!ts) return '';
  var diff = Date.now() - ts;
  var sec = Math.floor(diff / 1000);
  if (sec < 60) return '刚刚';
  var min = Math.floor(sec / 60);
  if (min < 60) return min + '分钟前';
  var hr = Math.floor(min / 60);
  if (hr < 24) return hr + '小时前';
  var day = Math.floor(hr / 24);
  if (day < 30) return day + '天前';
  var mon = Math.floor(day / 30);
  if (mon < 12) return mon + '个月前';
  return Math.floor(mon / 12) + '年前';
}

function scoreClass(score) {
  if (score >= 8) return 'score-high';
  if (score >= 6) return 'score-mid';
  return 'score-low';
}

// ==================== Render: Home ====================

function renderHome() {
  var statsEl = document.getElementById('home-stats');
  var recentEl = document.getElementById('home-recent-brews');
  if (!statsEl || !recentEl) return;
  rebuildBeanMap();

  var beanCount = DB.beans.length;
  var brewCount = DB.brews.length;
  var avgScore = 0;
  if (brewCount > 0) {
    var total = 0;
    for (var i = 0; i < DB.brews.length; i++) total += (DB.brews[i].score || 0);
    avgScore = (total / brewCount).toFixed(1);
  }
  var methodSet = {};
  for (var m = 0; m < DB.brews.length; m++) methodSet[DB.brews[m].method] = true;

  statsEl.innerHTML =
    '<div class="stat-card"><div class="stat-num">' + beanCount + '</div><div class="stat-label">咖啡豆</div></div>' +
    '<div class="stat-card"><div class="stat-num">' + brewCount + '</div><div class="stat-label">冲煮记录</div></div>' +
    '<div class="stat-card"><div class="stat-num">' + avgScore + '</div><div class="stat-label">平均评分</div></div>' +
    '<div class="stat-card"><div class="stat-num">' + Object.keys(methodSet).length + '</div><div class="stat-label">冲煮方式</div></div>';

  if (brewCount === 0) {
    recentEl.innerHTML = '<div class="empty"><div class="icon">\u2615</div><p>还没有冲煮记录，快来记录第一杯吧！</p></div>';
    return;
  }

  var sorted = DB.brews.slice().sort(function(a, b) { return (b.date || b.created) - (a.date || a.created); });
  var recent = sorted.slice(0, 5);
  var html = '<div class="brew-list">';
  for (var r = 0; r < recent.length; r++) {
    var brew = recent[r];
    var bean = findBean(brew.beanId);
    var method = getMethod(brew.method);
    html += '<div class="brew-card" onclick="showBrewDetail(\'' + brew.id + '\')">';
    html += '<div class="brew-left">';
    html += '<span class="brew-method-icon">' + (method ? method.icon : '\uD83D\uDD18') + '</span>';
    html += '<div class="brew-info"><div class="brew-bean">' + esc(bean ? bean.name : '未知豆子') + '</div>';
    html += '<div class="brew-params">' + (method ? method.label : '未知') + ' \u00B7 ' + brew.dose + 'g \u00B7 ' + timeAgo(brew.date || brew.created) + '</div></div>';
    html += '</div>';
    html += '<div class="brew-right"><span class="score-badge ' + scoreClass(brew.score) + '">' + (brew.score || 0) + '</span></div>';
    html += '</div>';
  }
  html += '</div>';
  recentEl.innerHTML = html;
}

// ==================== Render: Beans ====================

function renderBeans() {
  var container = document.getElementById('bean-list-container');
  if (!container) return;
  rebuildBeanMap();

  var keyword = '';
  var searchEl = document.getElementById('bean-search');
  if (searchEl) keyword = (searchEl.value || '').toLowerCase();

  var filtered = DB.beans.filter(function(b) {
    if (!keyword) return true;
    return (b.name && b.name.toLowerCase().indexOf(keyword) >= 0) ||
           (b.origin && b.origin.toLowerCase().indexOf(keyword) >= 0) ||
           (b.roaster && b.roaster.toLowerCase().indexOf(keyword) >= 0);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty"><div class="icon">\uD83E\uDED2</div><p>' +
      (keyword ? '没有找到匹配的咖啡豆' : '还没有添加咖啡豆') + '</p></div>';
    return;
  }

  var statusMap = { open: '未开袋', drinking: '饮用中', finished: '已喝完' };
  var html = '<div class="bean-list">';
  for (var i = 0; i < filtered.length; i++) {
    var bean = filtered[i];
    var roast = getRoast(bean.roast);
    var roastColor = roast ? roast.color : '#A0785A';
    var varietyObj = null;
    for (var v = 0; v < VARIETIES.length; v++) {
      if (VARIETIES[v].key === bean.variety) { varietyObj = VARIETIES[v]; break; }
    }

    html += '<div class="bean-card" onclick="showBeanDetail(\'' + bean.id + '\')">';
    html += '<div class="bean-stripe" style="background:' + roastColor + '"></div>';
    html += '<div class="bean-card-body">';
    html += '<div class="bean-card-header">';
    html += '<div><div class="bean-name">' + esc(bean.name) + '</div>';
    html += '<div class="bean-origin">' + esc(bean.origin || '') + (bean.roaster ? ' \u00B7 ' + esc(bean.roaster) : '') + '</div></div>';
    if (bean.status) html += '<span class="status-badge status-' + bean.status + '">' + (statusMap[bean.status] || '') + '</span>';
    html += '</div>';
    html += '<div class="bean-tags">';
    if (roast) {
      html += '<span class="tag tag-brown"><span class="roast-dots">';
      for (var d = 0; d < ROAST_LEVELS.length; d++) {
        html += '<span class="roast-dot' + (d < roast.level ? ' active' : '') + '"></span>';
      }
      html += '</span>' + roast.label + '</span>';
    }
    if (varietyObj) html += '<span class="tag tag-orange">' + varietyObj.label + '</span>';
    if (bean.flavors) {
      for (var f = 0; f < bean.flavors.length && f < 3; f++) {
        html += '<span class="tag tag-green">' + esc(bean.flavors[f]) + '</span>';
      }
    }
    if (bean.rating) html += '<span class="tag tag-brown">\u2605' + bean.rating + '</span>';
    html += '</div></div></div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

// ==================== Render: Brews ====================

function renderBrews() {
  var container = document.getElementById('brew-list-container');
  if (!container) return;
  rebuildBeanMap();

  var sorted = DB.brews.slice().sort(function(a, b) { return (b.date || b.created) - (a.date || a.created); });
  if (sorted.length === 0) {
    container.innerHTML = '<div class="empty"><div class="icon">\uD83D\uDCDD</div><p>还没有冲煮记录</p></div>';
    return;
  }

  var html = '<div class="brew-list">';
  for (var i = 0; i < sorted.length; i++) {
    var brew = sorted[i];
    var bean = findBean(brew.beanId);
    var method = getMethod(brew.method);
    var params = (method ? method.label : '未知') + ' \u00B7 ' + brew.dose + 'g/' + brew.water + 'ml \u00B7 ' + brew.temp + '\u00B0C';
    html += '<div class="brew-card" onclick="showBrewDetail(\'' + brew.id + '\')">';
    html += '<div class="brew-left">';
    html += '<span class="brew-method-icon">' + (method ? method.icon : '\uD83D\uDD18') + '</span>';
    html += '<div class="brew-info"><div class="brew-bean">' + esc(bean ? bean.name : '未知豆子') + '</div>';
    html += '<div class="brew-params">' + params + '</div>';
    html += '<div class="brew-params">' + timeAgo(brew.date || brew.created) + '</div></div>';
    html += '</div>';
    html += '<div class="brew-right">';
    html += '<span class="score-badge ' + scoreClass(brew.score) + '">' + (brew.score || 0) + '</span>';
    if (brew.date) html += '<div class="brew-time">' + new Date(brew.date).toLocaleDateString('zh-CN') + '</div>';
    html += '</div></div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

// ==================== Bean CRUD ====================

var _currentBeanRoast = '';
var _currentBeanRating = 0;

function initBeanForm() {
  var vs = document.getElementById('bm-variety');
  if (vs) {
    var vhtml = '<option value="">选择品种</option>';
    for (var i = 0; i < VARIETIES.length; i++) {
      vhtml += '<option value="' + VARIETIES[i].key + '">' + VARIETIES[i].label + '</option>';
    }
    vs.innerHTML = vhtml;
  }
  var ps = document.getElementById('bm-process');
  if (ps) {
    var phtml = '<option value="">选择处理法</option>';
    for (var j = 0; j < PROCESSES.length; j++) {
      phtml += '<option value="' + PROCESSES[j].key + '">' + PROCESSES[j].label + '</option>';
    }
    ps.innerHTML = phtml;
  }
  var rs = document.getElementById('bm-roast-selector');
  if (rs) {
    var rh = '';
    for (var k = 0; k < ROAST_LEVELS.length; k++) {
      var r = ROAST_LEVELS[k];
      rh += '<div class="roast-option" id="roast-' + r.key + '" onclick="selectRoast(\'' + r.key + '\')">';
      rh += '<div class="roast-circle" style="background:' + r.color + '"></div>';
      rh += '<div class="roast-name">' + r.label + '</div>';
      rh += '<div class="roast-agtron">' + r.agtron + '</div></div>';
    }
    rs.innerHTML = rh;
  }
  var ratingEl = document.getElementById('bm-rating-stars');
  if (ratingEl) {
    var shtml = '';
    for (var s = 1; s <= 5; s++) {
      shtml += '<span class="star" id="star-' + s + '" onclick="selectRating(' + s + ')">\u2606</span>';
    }
    ratingEl.innerHTML = shtml;
  }
  var flavorEl = document.getElementById('bm-flavors');
  if (flavorEl) {
    var fhtml = '';
    for (var fi = 0; fi < FLAVOR_WHEEL.length; fi++) {
      var cat = FLAVOR_WHEEL[fi];
      fhtml += '<div class="flavor-category">';
      fhtml += '<div class="flavor-cat-label" style="color:' + cat.color + '">' + cat.category + '</div>';
      fhtml += '<div class="flavor-chips">';
      for (var ti = 0; ti < cat.tags.length; ti++) {
        fhtml += '<span class="flavor-chip" data-flavor="' + cat.tags[ti] + '" onclick="toggleFlavor(this)">' + cat.tags[ti] + '</span>';
      }
      fhtml += '</div></div>';
    }
    flavorEl.innerHTML = fhtml;
  }
}

function selectRoast(key) {
  _currentBeanRoast = key;
  for (var i = 0; i < ROAST_LEVELS.length; i++) {
    var el = document.getElementById('roast-' + ROAST_LEVELS[i].key);
    if (el) el.classList.toggle('active', ROAST_LEVELS[i].key === key);
  }
}

function selectRating(v) {
  _currentBeanRating = (_currentBeanRating === v) ? 0 : v;
  for (var i = 1; i <= 5; i++) {
    var el = document.getElementById('star-' + i);
    if (el) {
      el.textContent = i <= _currentBeanRating ? '\u2605' : '\u2606';
      el.classList.toggle('active', i <= _currentBeanRating);
    }
  }
}

function toggleFlavor(el) {
  el.classList.toggle('selected');
}

function openBeanModal(id) {
  initBeanForm();
  var modal = document.getElementById('modal-bean');
  if (!modal) return;
  modal.style.display = 'flex';
  document.getElementById('bean-modal-title').textContent = id ? '编辑咖啡豆' : '添加咖啡豆';
  document.getElementById('bm-id').value = id || '';

  var resetFields = ['bm-name', 'bm-origin', 'bm-roaster', 'bm-altitude',
    'bm-roastdate', 'bm-harvest', 'bm-weight', 'bm-price', 'bm-shop', 'bm-notes'];

  if (id) {
    var bean = findBean(id);
    if (bean) {
      document.getElementById('bm-name').value = bean.name || '';
      document.getElementById('bm-origin').value = bean.origin || '';
      document.getElementById('bm-roaster').value = bean.roaster || '';
      document.getElementById('bm-variety').value = bean.variety || '';
      document.getElementById('bm-process').value = bean.process || '';
      document.getElementById('bm-altitude').value = bean.altitude || '';
      document.getElementById('bm-roastdate').value = bean.roastdate || '';
      document.getElementById('bm-harvest').value = bean.harvest || '';
      document.getElementById('bm-weight').value = bean.weight || '';
      document.getElementById('bm-price').value = bean.price || '';
      document.getElementById('bm-shop').value = bean.shop || '';
      document.getElementById('bm-status').value = bean.status || 'open';
      document.getElementById('bm-notes').value = bean.notes || '';
      selectRoast(bean.roast || '');
      selectRating(bean.rating || 0);
      if (bean.flavors) {
        var chips = document.querySelectorAll('#bm-flavors .flavor-chip');
        for (var c = 0; c < chips.length; c++) {
          chips[c].classList.toggle('selected', bean.flavors.indexOf(chips[c].dataset.flavor) >= 0);
        }
      }
    }
  } else {
    for (var f = 0; f < resetFields.length; f++) {
      var el = document.getElementById(resetFields[f]);
      if (el) el.value = '';
    }
    document.getElementById('bm-variety').value = '';
    document.getElementById('bm-process').value = '';
    document.getElementById('bm-status').value = 'open';
    selectRoast('');
    selectRating(0);
    var chips2 = document.querySelectorAll('#bm-flavors .flavor-chip');
    for (var c2 = 0; c2 < chips2.length; c2++) chips2[c2].classList.remove('selected');
  }
}

function saveBean() {
  var name = document.getElementById('bm-name').value.trim();
  if (!name) { toast('请输入咖啡豆名称'); return; }
  var id = document.getElementById('bm-id').value;
  var flavors = [];
  var selected = document.querySelectorAll('#bm-flavors .flavor-chip.selected');
  for (var i = 0; i < selected.length; i++) flavors.push(selected[i].dataset.flavor);

  var beanData = {
    name: name,
    origin: document.getElementById('bm-origin').value.trim(),
    roaster: document.getElementById('bm-roaster').value.trim(),
    variety: document.getElementById('bm-variety').value,
    process: document.getElementById('bm-process').value,
    altitude: document.getElementById('bm-altitude').value.trim(),
    roastdate: document.getElementById('bm-roastdate').value,
    harvest: document.getElementById('bm-harvest').value.trim(),
    weight: document.getElementById('bm-weight').value,
    price: document.getElementById('bm-price').value,
    shop: document.getElementById('bm-shop').value.trim(),
    status: document.getElementById('bm-status').value,
    roast: _currentBeanRoast,
    rating: _currentBeanRating,
    flavors: flavors,
    notes: document.getElementById('bm-notes').value.trim(),
    updated: Date.now()
  };

  if (id) {
    for (var j = 0; j < DB.beans.length; j++) {
      if (DB.beans[j].id === id) {
        beanData.id = id;
        beanData.created = DB.beans[j].created;
        DB.beans[j] = beanData;
        break;
      }
    }
    toast('咖啡豆已更新');
  } else {
    beanData.id = genId();
    beanData.created = Date.now();
    DB.beans.push(beanData);
    toast('咖啡豆已添加');
  }
  saveDB();
  closeModal('modal-bean');
  rebuildBeanMap();
  renderBeans();
}

function deleteBean(id) {
  if (!confirm('确定要删除这款咖啡豆吗？相关的冲煮记录不会被删除。')) return;
  DB.beans = DB.beans.filter(function(b) { return b.id !== id; });
  saveDB();
  closeModal('modal-bean-detail');
  rebuildBeanMap();
  renderBeans();
  toast('咖啡豆已删除');
}

function showBeanDetail(id) {
  var bean = findBean(id);
  if (!bean) return;
  var contentEl = document.getElementById('bean-detail-content');
  var editBtn = document.getElementById('bean-detail-edit-btn');
  var modal = document.getElementById('modal-bean-detail');
  if (!contentEl || !modal) return;
  modal.style.display = 'flex';

  var roast = getRoast(bean.roast);
  var varietyObj = null;
  for (var v = 0; v < VARIETIES.length; v++) { if (VARIETIES[v].key === bean.variety) { varietyObj = VARIETIES[v]; break; } }
  var processObj = getProcess(bean.process);
  var statusMap = { open: '未开袋', drinking: '饮用中', finished: '已喝完' };

  var html = '<div class="detail-header" style="border-left-color:' + (roast ? roast.color : 'var(--cream)') + '">';
  html += '<div style="display:flex;justify-content:space-between;align-items:flex-start">';
  html += '<div><div class="detail-name">' + esc(bean.name) + '</div>';
  html += '<div class="detail-origin">' + esc(bean.origin || '') + (bean.roaster ? ' \u00B7 ' + esc(bean.roaster) : '') + '</div></div>';
  html += '<button class="btn btn-danger btn-sm" onclick="deleteBean(\'' + id + '\')" style="flex-shrink:0">删除</button>';
  html += '</div></div>';

  html += '<div class="info-grid">';
  if (varietyObj) html += '<div class="info-item"><div class="info-label">品种</div><div class="info-value">' + varietyObj.label + '</div></div>';
  if (processObj) html += '<div class="info-item"><div class="info-label">处理法</div><div class="info-value">' + processObj.label + '</div></div>';
  if (roast) {
    html += '<div class="info-item"><div class="info-label">烘焙度</div><div class="info-value"><span class="roast-dots">';
    for (var d = 0; d < ROAST_LEVELS.length; d++) html += '<span class="roast-dot' + (d < roast.level ? ' active' : '') + '"></span>';
    html += '</span> ' + roast.label + '</div></div>';
  }
  if (bean.altitude) html += '<div class="info-item"><div class="info-label">海拔</div><div class="info-value">' + esc(bean.altitude) + 'm</div></div>';
  if (bean.roastdate) html += '<div class="info-item"><div class="info-label">烘焙日期</div><div class="info-value">' + bean.roastdate + '</div></div>';
  if (bean.weight) html += '<div class="info-item"><div class="info-label">重量</div><div class="info-value">' + bean.weight + 'g</div></div>';
  if (bean.price) html += '<div class="info-item"><div class="info-label">价格</div><div class="info-value">\u00A5' + bean.price + '</div></div>';
  if (bean.shop) html += '<div class="info-item"><div class="info-label">购买渠道</div><div class="info-value">' + esc(bean.shop) + '</div></div>';
  if (bean.status) html += '<div class="info-item"><div class="info-label">状态</div><div class="info-value"><span class="status-badge status-' + bean.status + '">' + (statusMap[bean.status] || '') + '</span></div></div>';
  if (bean.rating) html += '<div class="info-item"><div class="info-label">评分</div><div class="info-value" style="color:#F5A623">' + '\u2605'.repeat(bean.rating) + '\u2606'.repeat(5 - bean.rating) + '</div></div>';
  html += '</div>';

  if (bean.flavors && bean.flavors.length > 0) {
    html += '<div style="margin-top:12px"><div class="info-label" style="margin-bottom:6px">风味标签</div><div class="flavor-grid">';
    for (var f = 0; f < bean.flavors.length; f++) html += '<span class="flavor-chip selected">' + esc(bean.flavors[f]) + '</span>';
    html += '</div></div>';
  }
  if (bean.notes) {
    html += '<div style="margin-top:12px"><div class="info-label" style="margin-bottom:4px">备注</div><p style="font-size:13px;color:var(--text)">' + esc(bean.notes) + '</p></div>';
  }

  var brews = DB.brews.filter(function(b) { return b.beanId === id; }).sort(function(a, b) { return (b.date || b.created) - (a.date || a.created); });
  if (brews.length > 0) {
    html += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">';
    html += '<div class="info-label" style="margin-bottom:8px">冲煮记录 (' + brews.length + ')</div>';
    for (var bi = 0; bi < brews.length; bi++) {
      var brew = brews[bi];
      var method = getMethod(brew.method);
      html += '<div class="brew-mini" onclick="closeModal(\'modal-bean-detail\');showBrewDetail(\'' + brew.id + '\')">';
      html += (method ? method.icon : '') + ' ' + (method ? method.label : '未知');
      html += ' \u00B7 ' + brew.dose + 'g/' + brew.water + 'ml \u00B7 ' + brew.temp + '\u00B0C';
      html += ' \u00B7 <span class="score-badge ' + scoreClass(brew.score) + '" style="width:24px;height:24px;font-size:11px">' + (brew.score || 0) + '</span>';
      html += '</div>';
    }
    html += '</div>';
  }

  contentEl.innerHTML = html;
  if (editBtn) editBtn.onclick = function() { closeModal('modal-bean-detail'); openBeanModal(id); };
}

// ==================== Brew CRUD ====================

var _currentBrewMethod = '';

function initBrewForm() {
  var bs = document.getElementById('brm-bean');
  if (bs) {
    var bhtml = '<option value="">选择咖啡豆</option>';
    for (var i = 0; i < DB.beans.length; i++) bhtml += '<option value="' + DB.beans[i].id + '">' + esc(DB.beans[i].name) + '</option>';
    bs.innerHTML = bhtml;
  }
  var mg = document.getElementById('brm-method-grid');
  if (mg) {
    var mhtml = '';
    for (var j = 0; j < BREW_METHODS.length; j++) {
      var m = BREW_METHODS[j];
      mhtml += '<div class="method-chip" id="method-' + m.key + '" onclick="selectMethod(\'' + m.key + '\')">';
      mhtml += '<span class="m-icon">' + m.icon + '</span>' + m.label + '</div>';
    }
    mg.innerHTML = mhtml;
  }
}

function selectMethod(key) {
  _currentBrewMethod = key;
  var method = getMethod(key);
  for (var i = 0; i < BREW_METHODS.length; i++) {
    var el = document.getElementById('method-' + BREW_METHODS[i].key);
    if (el) el.classList.toggle('active', BREW_METHODS[i].key === key);
  }
  if (method) {
    var doseEl = document.getElementById('brm-dose');
    var tempEl = document.getElementById('brm-temp');
    if (doseEl) doseEl.value = Math.round((method.dose[0] + method.dose[1]) / 2);
    if (tempEl) tempEl.value = Math.round((method.temp[0] + method.temp[1]) / 2);
    calcWater();
  }
}

function calcWater() {
  var method = getMethod(_currentBrewMethod);
  if (!method) return;
  var doseEl = document.getElementById('brm-dose');
  var waterEl = document.getElementById('brm-water');
  if (doseEl && waterEl) {
    var dose = parseFloat(doseEl.value) || 0;
    waterEl.value = Math.round(dose * method.ratio);
  }
}

function openBrewModal(id) {
  initBrewForm();
  var modal = document.getElementById('modal-brew');
  if (!modal) return;
  modal.style.display = 'flex';
  document.getElementById('brew-modal-title').textContent = id ? '编辑冲煮' : '记录冲煮';
  document.getElementById('brm-id').value = id || '';
  _currentBrewMethod = '';

  var delBtn = document.getElementById('brm-delete-btn');
  if (delBtn) delBtn.style.display = id ? 'inline-flex' : 'none';

  var sliders = ['brm-score', 'brm-aroma', 'brm-acidity', 'brm-body', 'brm-sweet'];
  var defaults = DB.settings;

  if (id) {
    var brew = DB.brews.filter(function(b) { return b.id === id; })[0];
    if (brew) {
      document.getElementById('brm-bean').value = brew.beanId || '';
      selectMethod(brew.method || '');
      document.getElementById('brm-dose').value = brew.dose || '';
      document.getElementById('brm-water').value = brew.water || '';
      document.getElementById('brm-temp').value = brew.temp || '';
      document.getElementById('brm-time').value = brew.brewTime || '';
      document.getElementById('brm-grind').value = brew.grind || '';
      document.getElementById('brm-grinder').value = brew.grinder || '';
      for (var s = 0; s < sliders.length; s++) {
        var key = sliders[s].replace('brm-', '');
        var val = brew[key] || 7;
        document.getElementById(sliders[s]).value = val;
        document.getElementById(sliders[s] + '-val').textContent = val;
      }
      document.getElementById('brm-flavors').value = brew.flavorNotes || '';
      document.getElementById('brm-notes').value = brew.notes || '';
    }
  } else {
    document.getElementById('brm-bean').value = '';
    document.getElementById('brm-dose').value = defaults.defaultDose || 15;
    document.getElementById('brm-water').value = '';
    document.getElementById('brm-temp').value = defaults.defaultTemp || 92;
    document.getElementById('brm-time').value = '';
    document.getElementById('brm-grind').value = '';
    document.getElementById('brm-grinder').value = '';
    for (var s2 = 0; s2 < sliders.length; s2++) {
      document.getElementById(sliders[s2]).value = 7;
      document.getElementById(sliders[s2] + '-val').textContent = '7';
    }
    document.getElementById('brm-flavors').value = '';
    document.getElementById('brm-notes').value = '';
    for (var i = 0; i < BREW_METHODS.length; i++) {
      var el = document.getElementById('method-' + BREW_METHODS[i].key);
      if (el) el.classList.remove('active');
    }
  }
}

function saveBrew() {
  var beanId = document.getElementById('brm-bean').value;
  if (!beanId) { toast('请选择咖啡豆'); return; }
  if (!_currentBrewMethod) { toast('请选择冲煮方式'); return; }

  var id = document.getElementById('brm-id').value;
  var brewData = {
    beanId: beanId,
    method: _currentBrewMethod,
    dose: parseFloat(document.getElementById('brm-dose').value) || 0,
    water: parseFloat(document.getElementById('brm-water').value) || 0,
    temp: parseFloat(document.getElementById('brm-temp').value) || 0,
    brewTime: document.getElementById('brm-time').value.trim(),
    grind: document.getElementById('brm-grind').value.trim(),
    grinder: document.getElementById('brm-grinder').value.trim(),
    score: parseInt(document.getElementById('brm-score').value) || 7,
    aroma: parseInt(document.getElementById('brm-aroma').value) || 7,
    acidity: parseInt(document.getElementById('brm-acidity').value) || 7,
    body: parseInt(document.getElementById('brm-body').value) || 7,
    sweet: parseInt(document.getElementById('brm-sweet').value) || 7,
    flavorNotes: document.getElementById('brm-flavors').value.trim(),
    notes: document.getElementById('brm-notes').value.trim(),
    updated: Date.now()
  };

  if (id) {
    for (var j = 0; j < DB.brews.length; j++) {
      if (DB.brews[j].id === id) {
        brewData.id = id;
        brewData.created = DB.brews[j].created;
        brewData.date = DB.brews[j].date;
        DB.brews[j] = brewData;
        break;
      }
    }
    toast('冲煮记录已更新');
  } else {
    brewData.id = genId();
    brewData.created = Date.now();
    brewData.date = Date.now();
    DB.brews.push(brewData);
    toast('冲煮记录已保存');
  }
  saveDB();
  closeModal('modal-brew');
  renderBrews();
  renderHome();
}

function deleteBrew() {
  var id = document.getElementById('brm-id').value;
  if (!id) return;
  if (!confirm('确定要删除这条冲煮记录吗？')) return;
  DB.brews = DB.brews.filter(function(b) { return b.id !== id; });
  saveDB();
  closeModal('modal-brew');
  renderBrews();
  renderHome();
  toast('冲煮记录已删除');
}

function showBrewDetail(id) {
  var brew = DB.brews.filter(function(b) { return b.id === id; })[0];
  if (!brew) return;
  rebuildBeanMap();
  var bean = findBean(brew.beanId);
  var method = getMethod(brew.method);
  var contentEl = document.getElementById('brew-detail-content');
  var modal = document.getElementById('modal-brew-detail');
  if (!contentEl || !modal) return;
  modal.style.display = 'flex';

  var html = '<div class="detail-header">';
  html += '<div style="display:flex;justify-content:space-between;align-items:flex-start">';
  html += '<div><div class="detail-name">' + (method ? method.icon : '') + ' ' + (method ? method.label : '未知') + '</div>';
  html += '<div class="detail-origin">' + esc(bean ? bean.name : '未知豆子') + '</div></div></div></div>';

  html += '<div class="info-grid">';
  html += '<div class="info-item"><div class="info-label">粉量</div><div class="info-value">' + brew.dose + 'g</div></div>';
  html += '<div class="info-item"><div class="info-label">水量</div><div class="info-value">' + brew.water + 'ml</div></div>';
  html += '<div class="info-item"><div class="info-label">水温</div><div class="info-value">' + brew.temp + '\u00B0C</div></div>';
  if (brew.brewTime) html += '<div class="info-item"><div class="info-label">时间</div><div class="info-value">' + esc(brew.brewTime) + '</div></div>';
  if (brew.grind) html += '<div class="info-item"><div class="info-label">研磨度</div><div class="info-value">' + esc(brew.grind) + '</div></div>';
  if (brew.grinder) html += '<div class="info-item"><div class="info-label">磨豆机</div><div class="info-value">' + esc(brew.grinder) + '</div></div>';
  html += '</div>';

  html += '<div style="margin-top:16px"><div class="info-label" style="margin-bottom:8px">口感评价</div>';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
  html += '<span class="score-badge ' + scoreClass(brew.score) + '" style="width:40px;height:40px;font-size:16px">' + (brew.score || 0) + '</span>';
  html += '<span style="font-size:13px;color:var(--sub)">总分 /10</span></div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
  var dims = [
    { key: 'aroma', label: '香气' },
    { key: 'acidity', label: '酸质' },
    { key: 'body', label: '醇厚' },
    { key: 'sweet', label: '甜感' }
  ];
  for (var d = 0; d < dims.length; d++) {
    var val = brew[dims[d].key] || 0;
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<span style="font-size:12px;color:var(--sub);width:36px">' + dims[d].label + '</span>';
    html += '<div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden">';
    html += '<div style="width:' + (val * 10) + '%;height:100%;background:var(--brown);border-radius:3px"></div></div>';
    html += '<span style="font-size:12px;font-weight:600;color:var(--brown);width:20px;text-align:right">' + val + '</span>';
    html += '</div>';
  }
  html += '</div></div>';

  if (brew.flavorNotes) html += '<div style="margin-top:12px"><div class="info-label" style="margin-bottom:4px">风味笔记</div><p style="font-size:13px">' + esc(brew.flavorNotes) + '</p></div>';
  if (brew.notes) html += '<div style="margin-top:8px"><div class="info-label" style="margin-bottom:4px">备注</div><p style="font-size:13px">' + esc(brew.notes) + '</p></div>';

  contentEl.innerHTML = html;

  var editBtn = document.getElementById('brew-detail-edit-btn');
  if (editBtn) editBtn.onclick = function() { closeModal('modal-brew-detail'); openBrewModal(id); };
  var delBtn = document.getElementById('brew-detail-delete-btn');
  if (delBtn) delBtn.onclick = function() {
    if (!confirm('确定要删除这条冲煮记录吗？')) return;
    DB.brews = DB.brews.filter(function(b) { return b.id !== id; });
    saveDB();
    closeModal('modal-brew-detail');
    renderBrews();
    renderHome();
    toast('冲煮记录已删除');
  };
}

// ==================== Analytics ====================

function renderAnalytics() {
  var statsEl = document.getElementById('analytics-stats');
  var contentEl = document.getElementById('analytics-content');
  if (!statsEl || !contentEl) return;
  rebuildBeanMap();

  var brewCount = DB.brews.length;
  var avgScore = 0;
  var totalDose = 0;
  if (brewCount > 0) {
    var total = 0;
    for (var i = 0; i < DB.brews.length; i++) {
      total += (DB.brews[i].score || 0);
      totalDose += (DB.brews[i].dose || 0);
    }
    avgScore = (total / brewCount).toFixed(1);
  }

  statsEl.innerHTML =
    '<div class="stat-card"><div class="stat-num">' + brewCount + '</div><div class="stat-label">总冲煮次数</div></div>' +
    '<div class="stat-card"><div class="stat-num">' + avgScore + '</div><div class="stat-label">平均评分</div></div>' +
    '<div class="stat-card"><div class="stat-num">' + (brewCount > 0 ? Math.round(totalDose / brewCount) : 0) + 'g</div><div class="stat-label">平均粉量</div></div>' +
    '<div class="stat-card"><div class="stat-num">' + DB.beans.length + '</div><div class="stat-label">咖啡豆种类</div></div>';

  var html = '';

  // Method distribution
  html += '<div class="card"><div class="card-title">冲煮方式分布</div>';
  var methodCount = {};
  for (var mi = 0; mi < DB.brews.length; mi++) {
    var mk = DB.brews[mi].method;
    methodCount[mk] = (methodCount[mk] || 0) + 1;
  }
  var methodEntries = [];
  for (var mk2 in methodCount) { if (methodCount.hasOwnProperty(mk2)) methodEntries.push({ key: mk2, count: methodCount[mk2] }); }
  methodEntries.sort(function(a, b) { return b.count - a.count; });
  var maxMethod = methodEntries.length > 0 ? methodEntries[0].count : 1;
  if (methodEntries.length === 0) {
    html += '<p style="color:var(--sub);text-align:center;padding:20px">暂无数据</p>';
  } else {
    for (var me = 0; me < methodEntries.length; me++) {
      var mObj = getMethod(methodEntries[me].key);
      var pct = Math.round((methodEntries[me].count / maxMethod) * 100);
      html += '<div class="chart-bar"><span class="chart-bar-label">' + (mObj ? mObj.label : methodEntries[me].key) + '</span>';
      html += '<div class="chart-bar-track"><div class="chart-bar-fill" style="width:' + pct + '%"></div></div>';
      html += '<span class="chart-bar-val">' + methodEntries[me].count + '次</span></div>';
    }
  }
  html += '</div>';

  // Top 5 beans
  html += '<div class="card"><div class="card-title">最常冲煮的咖啡豆 Top 5</div>';
  var beanCount = {};
  for (var bi = 0; bi < DB.brews.length; bi++) {
    var bk = DB.brews[bi].beanId;
    beanCount[bk] = (beanCount[bk] || 0) + 1;
  }
  var beanEntries = [];
  for (var bk2 in beanCount) { if (beanCount.hasOwnProperty(bk2)) beanEntries.push({ id: bk2, count: beanCount[bk2] }); }
  beanEntries.sort(function(a, b) { return b.count - a.count; });
  var top5 = beanEntries.slice(0, 5);
  if (top5.length === 0) {
    html += '<p style="color:var(--sub);text-align:center;padding:20px">暂无数据</p>';
  } else {
    for (var t = 0; t < top5.length; t++) {
      var bObj = findBean(top5[t].id);
      html += '<div class="rank-item"><span class="rank-num">' + (t + 1) + '</span>';
      html += '<div><div class="rank-name">' + esc(bObj ? bObj.name : '已删除') + '</div>';
      html += '<div class="rank-meta">' + top5[t].count + '次冲煮</div></div></div>';
    }
  }
  html += '</div>';

  // Score trend
  html += '<div class="card"><div class="card-title">评分趋势（最近20次）</div>';
  var recentBrews = DB.brews.slice().sort(function(a, b) { return (a.date || a.created) - (b.date || b.created); }).slice(-20);
  if (recentBrews.length < 2) {
    html += '<p style="color:var(--sub);text-align:center;padding:20px">需要至少2条记录</p>';
  } else {
    html += '<div class="trend-chart">';
    for (var si = 0; si < recentBrews.length; si++) {
      var h = Math.max(2, ((recentBrews[si].score || 0) / 10) * 160);
      var dateStr = recentBrews[si].date ? new Date(recentBrews[si].date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) : '';
      html += '<div class="trend-bar" style="height:' + h + 'px"><div class="tooltip">' + (recentBrews[si].score || 0) + '分 ' + dateStr + '</div></div>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Flavor cloud
  html += '<div class="card"><div class="card-title">风味词云</div>';
  var flavorFreq = {};
  for (var fi = 0; fi < DB.beans.length; fi++) {
    if (DB.beans[fi].flavors) {
      for (var fj = 0; fj < DB.beans[fi].flavors.length; fj++) {
        flavorFreq[DB.beans[fi].flavors[fj]] = (flavorFreq[DB.beans[fi].flavors[fj]] || 0) + 1;
      }
    }
  }
  for (var fbi = 0; fbi < DB.brews.length; fbi++) {
    if (DB.brews[fbi].flavorNotes) {
      var notes = DB.brews[fbi].flavorNotes.split(/[,，、\s]+/);
      for (var ni = 0; ni < notes.length; ni++) {
        var nt = notes[ni].trim();
        if (nt) flavorFreq[nt] = (flavorFreq[nt] || 0) + 1;
      }
    }
  }
  var flavorEntries = [];
  for (var fk in flavorFreq) { if (flavorFreq.hasOwnProperty(fk)) flavorEntries.push({ tag: fk, count: flavorFreq[fk] }); }
  flavorEntries.sort(function(a, b) { return b.count - a.count; });
  if (flavorEntries.length === 0) {
    html += '<p style="color:var(--sub);text-align:center;padding:20px">暂无数据</p>';
  } else {
    var maxFlavor = flavorEntries[0].count;
    html += '<div class="flavor-cloud">';
    for (var fc = 0; fc < flavorEntries.length && fc < 25; fc++) {
      var fsize = 14 + Math.round((flavorEntries[fc].count / maxFlavor) * 20);
      var fop = 0.5 + (flavorEntries[fc].count / maxFlavor) * 0.5;
      html += '<span class="flavor-word" style="font-size:' + fsize + 'px;opacity:' + fop + '">' + esc(flavorEntries[fc].tag) + '<sup>' + flavorEntries[fc].count + '</sup></span>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Monthly stats
  html += '<div class="card"><div class="card-title">月度冲煮统计</div>';
  var monthlyCount = {};
  for (var mj = 0; mj < DB.brews.length; mj++) {
    var d = new Date(DB.brews[mj].date || DB.brews[mj].created);
    var mkey = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
    monthlyCount[mkey] = (monthlyCount[mkey] || 0) + 1;
  }
  var monthEntries = [];
  for (var mk3 in monthlyCount) { if (monthlyCount.hasOwnProperty(mk3)) monthEntries.push({ month: mk3, count: monthlyCount[mk3] }); }
  monthEntries.sort(function(a, b) { return a.month.localeCompare(b.month); });
  if (monthEntries.length === 0) {
    html += '<p style="color:var(--sub);text-align:center;padding:20px">暂无数据</p>';
  } else {
    var maxMonth = 0;
    for (var mm = 0; mm < monthEntries.length; mm++) { if (monthEntries[mm].count > maxMonth) maxMonth = monthEntries[mm].count; }
    for (var mn = 0; mn < monthEntries.length; mn++) {
      var mPct = Math.round((monthEntries[mn].count / maxMonth) * 100);
      html += '<div class="chart-bar"><span class="chart-bar-label">' + monthEntries[mn].month + '</span>';
      html += '<div class="chart-bar-track"><div class="chart-bar-fill" style="width:' + mPct + '%;background:linear-gradient(90deg,#4CAF50,#81C784)"></div></div>';
      html += '<span class="chart-bar-val">' + monthEntries[mn].count + '次</span></div>';
    }
  }
  html += '</div>';

  contentEl.innerHTML = html;
}

// ==================== Settings ====================

function loadSettingsUI() {
  var doseEl = document.getElementById('set-dose');
  var tempEl = document.getElementById('set-temp');
  if (doseEl) doseEl.value = DB.settings.defaultDose || 15;
  if (tempEl) tempEl.value = DB.settings.defaultTemp || 92;
}

function saveSettings() {
  DB.settings.defaultDose = parseInt(document.getElementById('set-dose').value) || 15;
  DB.settings.defaultTemp = parseInt(document.getElementById('set-temp').value) || 92;
  saveDB();
  toast('设置已保存');
}

function exportData() {
  var data = JSON.stringify(DB, null, 2);
  var blob = new Blob([data], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'coffee-journal-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('数据已导出');
}

function importDataClick() {
  document.getElementById('import-file').click();
}

function importData(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var data = JSON.parse(ev.target.result);
      if (data.beans) DB.beans = data.beans;
      if (data.brews) DB.brews = data.brews;
      if (data.settings) DB.settings = data.settings;
      saveDB();
      rebuildBeanMap();
      showPage('home');
      toast('数据已导入');
    } catch (err) {
      toast('导入失败，文件格式错误');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) return;
  if (!confirm('再次确认：所有咖啡豆和冲煮记录都将被删除！')) return;
  DB.beans = [];
  DB.brews = [];
  DB.settings = {};
  saveDB();
  rebuildBeanMap();
  showPage('home');
  toast('所有数据已清除');
}

// ==================== Init ====================

rebuildBeanMap();
renderHome();
