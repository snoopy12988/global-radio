/* ============================================
   全球电台 · 主逻辑
   Radio Browser API + 状态管理 + 交互
   ============================================ */

// ---- 配置 ----
const API_BASE = 'https://de1.api.radio-browser.info/json';
const STORAGE_KEYS = {
  favorites: 'global-radio-favorites',
  history: 'global-radio-history',
  volume: 'global-radio-volume',
  deadStations: 'global-radio-dead',
  lastStation: 'global-radio-last'
};

// ---- 翻译映射 ----
const COUNTRY_ZH = {
  'Germany': '德国', 'Japan': '日本', 'France': '法国', 'United Kingdom': '英国',
  'United States': '美国', 'Italy': '意大利', 'Spain': '西班牙', 'Netherlands': '荷兰',
  'Canada': '加拿大', 'Australia': '澳大利亚', 'Brazil': '巴西', 'Russia': '俄罗斯',
  'Switzerland': '瑞士', 'Austria': '奥地利', 'Belgium': '比利时', 'Poland': '波兰',
  'Sweden': '瑞典', 'Norway': '挪威', 'Denmark': '丹麦', 'Finland': '芬兰',
  'Portugal': '葡萄牙', 'Greece': '希腊', 'Turkey': '土耳其', 'Mexico': '墨西哥',
  'Argentina': '阿根廷', 'Chile': '智利', 'Colombia': '哥伦比亚', 'Peru': '秘鲁',
  'India': '印度', 'China': '中国', 'South Korea': '韩国', 'Taiwan': '台湾',
  'Thailand': '泰国', 'Indonesia': '印度尼西亚', 'Philippines': '菲律宾',
  'New Zealand': '新西兰', 'South Africa': '南非', 'Ireland': '爱尔兰',
  'Czech Republic': '捷克', 'Hungary': '匈牙利', 'Romania': '罗马尼亚',
  'Ukraine': '乌克兰', 'Croatia': '克罗地亚', 'Serbia': '塞尔维亚', 'Slovakia': '斯洛伐克',
  'Slovenia': '斯洛文尼亚', 'Bulgaria': '保加利亚', 'Lithuania': '立陶宛',
  'Latvia': '拉脱维亚', 'Estonia': '爱沙尼亚', 'Luxembourg': '卢森堡',
  'Israel': '以色列', 'Egypt': '埃及', 'United Arab Emirates': '阿联酋',
  'Singapore': '新加坡', 'Malaysia': '马来西亚', 'Vietnam': '越南',
  'Hong Kong': '香港', 'Macau': '澳门',
  'Albania': '阿尔巴尼亚', 'Algeria': '阿尔及利亚', 'Andorra': '安道尔',
  'Armenia': '亚美尼亚', 'Azerbaijan': '阿塞拜疆', 'Belarus': '白俄罗斯',
  'Bosnia and Herzegovina': '波黑', 'Cyprus': '塞浦路斯', 'Georgia': '格鲁吉亚',
  'Iceland': '冰岛', 'Kazakhstan': '哈萨克斯坦', 'Kosovo': '科索沃',
  'Kyrgyzstan': '吉尔吉斯斯坦', 'Lebanon': '黎巴嫩', 'Liechtenstein': '列支敦士登',
  'Malta': '马耳他', 'Moldova': '摩尔多瓦', 'Monaco': '摩纳哥',
  'Montenegro': '黑山', 'Morocco': '摩洛哥', 'North Macedonia': '北马其顿',
  'San Marino': '圣马力诺', 'Tunisia': '突尼斯', 'Uzbekistan': '乌兹别克斯坦',
  'Venezuela': '委内瑞拉', 'Ecuador': '厄瓜多尔', 'Bolivia': '玻利维亚',
  'Uruguay': '乌拉圭', 'Paraguay': '巴拉圭', 'Costa Rica': '哥斯达黎加',
  'Panama': '巴拿马', 'Cuba': '古巴', 'Dominican Republic': '多米尼加',
  'Puerto Rico': '波多黎各', 'Guatemala': '危地马拉', 'El Salvador': '萨尔瓦多',
  'Honduras': '洪都拉斯', 'Nicaragua': '尼加拉瓜', 'Jamaica': '牙买加',
  'Trinidad and Tobago': '特立尼达和多巴哥', 'Barbados': '巴巴多斯',
  'Bahamas': '巴哈马', 'Belize': '伯利兹', 'Suriname': '苏里南',
  'Guyana': '圭亚那', 'Haiti': '海地',
  'Nigeria': '尼日利亚', 'Kenya': '肯尼亚', 'Ghana': '加纳',
  'Tanzania': '坦桑尼亚', 'Uganda': '乌干达', 'Ethiopia': '埃塞俄比亚',
  'Senegal': '塞内加尔', 'Cameroon': '喀麦隆', 'Ivory Coast': '科特迪瓦',
  'Zimbabwe': '津巴布韦', 'Zambia': '赞比亚', 'Botswana': '博茨瓦纳',
  'Namibia': '纳米比亚', 'Mozambique': '莫桑比克', 'Angola': '安哥拉',
  'Libya': '利比亚', 'Sudan': '苏丹', 'Congo': '刚果',
  'Saudi Arabia': '沙特阿拉伯', 'Qatar': '卡塔尔', 'Kuwait': '科威特',
  'Bahrain': '巴林', 'Oman': '阿曼', 'Jordan': '约旦', 'Iraq': '伊拉克',
  'Iran': '伊朗', 'Syria': '叙利亚', 'Yemen': '也门', 'Lebanon': '黎巴嫩',
  'Pakistan': '巴基斯坦', 'Bangladesh': '孟加拉国', 'Sri Lanka': '斯里兰卡',
  'Nepal': '尼泊尔', 'Myanmar': '缅甸', 'Cambodia': '柬埔寨',
  'Laos': '老挝', 'Mongolia': '蒙古', 'Brunei': '文莱', 'Maldives': '马尔代夫',
  'Fiji': '斐济', 'Papua New Guinea': '巴布亚新几内亚',
  'Iceland': '冰岛', 'Greenland': '格陵兰', 'Faroe Islands': '法罗群岛',
  'Mauritius': '毛里求斯', 'Seychelles': '塞舌尔', 'Madagascar': '马达加斯加',
  'The Netherlands': '荷兰', 'The United Kingdom': '英国',
  'United States of America': '美国', 'Russian Federation': '俄罗斯',
  'Czechia': '捷克', 'Republic of Korea': '韩国',
  'Vatican': '梵蒂冈', 'Palestine': '巴勒斯坦',
  'Taiwan, Republic of China': '中国台湾',
  'The United States of America': '美国',
  'The Russian Federation': '俄罗斯',
  'The United Kingdom of Great Britain and Northern Ireland': '英国',
  'Republic of North Macedonia': '北马其顿',
  'The Republic of Moldova': '摩尔多瓦',
  'Korea, Republic of': '韩国',
  'Korea': '韩国',
  'Bolivarian Republic of Venezuela': '委内瑞拉',
  'Islamic Republic of Iran': '伊朗',
  'Syrian Arab Republic': '叙利亚'
};

const TAG_ZH = {
  'jazz': '爵士', 'classical': '古典', 'rock': '摇滚', 'pop': '流行',
  'electronic': '电子', 'house': '浩室', 'techno': '科技舞曲', 'trance': '迷幻',
  'ambient': '氛围', 'chillout': '弛放', 'lounge': '酒廊', 'downtempo': '缓拍',
  'hip hop': '嘻哈', 'rap': '说唱', 'rnb': '节奏蓝调', 'soul': '灵魂乐',
  'funk': '放克', 'disco': '迪斯科', 'reggae': '雷鬼', 'latin': '拉丁',
  'salsa': '萨尔萨', 'bossa nova': '波萨诺瓦', 'samba': '桑巴', 'tango': '探戈',
  'blues': '蓝调', 'country': '乡村', 'folk': '民谣', 'world': '世界音乐',
  'indie': '独立', 'alternative': '另类', 'punk': '朋克', 'metal': '金属',
  'hard rock': '硬摇滚', 'progressive': '前卫', 'psychedelic': '迷幻摇滚',
  'new age': '新世纪', 'meditation': '冥想', 'soundtrack': '原声',
  'easy listening': '轻音乐', 'instrumental': '器乐', 'piano': '钢琴',
  'guitar': '吉他', 'vocals': '人声', 'choir': '合唱', 'opera': '歌剧',
  'oldies': '老歌', '80s': '80年代', '90s': '90年代', '70s': '70年代',
  '60s': '60年代', 'top 40': '热门金曲', 'hits': '流行热单',
  'dance': '舞曲', 'club': '夜店', 'deep house': '深浩室',
  'drum and bass': '鼓打贝斯', 'dubstep': '回响贝斯', 'breakbeat': '碎拍',
  'news': '新闻', 'talk': '谈话', 'sport': '体育', 'community': '社区',
  'christian': '基督教', 'gospel': '福音', 'religious': '宗教',
  'variety': '综合', 'eclectic': '折衷', 'adult contemporary': '成人当代',
  'public radio': '公共广播', 'university': '大学电台', 'student': '学生电台',
  'music': '音乐', 'radio': '广播', 'fm': '调频', 'pop music': '流行音乐',
  'classic rock': '经典摇滚', 'classic hits': '经典热门', 'pop rock': '流行摇滚',
  'soft rock': '软摇滚', 'alternative rock': '另类摇滚',
  'community radio': '社区广播', 'local news': '本地新闻',
  'local radio': '本地电台', 'regional': '地方', 'information': '资讯',
  'entertainment': '娱乐', 'entretenimiento': '娱乐',
  'música': '音乐', 'estación': '电台', 'música pop': '流行音乐',
  'música en español': '西班牙语音乐', 'noticias': '新闻',
  'regional mexican': '墨西哥地方音乐', 'regional mexicana': '墨西哥地方音乐',
  'música popular mexicana': '墨西哥流行音乐',
  'español': '西班牙语', 'latinoamérica': '拉丁美洲',
  'norteamérica': '北美', 'américa': '美洲', 'méxico': '墨西哥',
  'rock nacional': '民族摇滚', 'musica': '音乐',
  'spanish': '西班牙语', 'english': '英语', 'french': '法语',
  'italian': '意大利语', 'german': '德语', 'portuguese': '葡萄牙语',
  'chill': '弛放', 'love songs': '情歌', 'cover': '翻唱',
  'live': '现场', 'acoustic': '原声', 'reggaeton': '雷鬼动',
  'bachata': '巴恰塔', 'merengue': '梅伦格', 'cumbia': '坎比亚',
  'vallenato': '巴耶纳托', 'tropical': '热带音乐', 'sertanejo': '塞尔塔内霍',
  'mpb': '巴西流行', 'forró': '福霍', 'pagode': '帕戈吉',
  'ranchera': '兰切拉', 'norteño': '北部音乐', 'banda': '班达',
  'corrido': '科里多', 'grupera': '格鲁佩拉', 'duranguense': '杜兰戈',
  'pop latino': '拉丁流行', 'rock en español': '西班牙语摇滚',
  'balada': '民谣', 'trova': '特罗瓦', 'son': '松', 'bolero': '波莱罗',
  'flamenco': '弗拉明戈', 'rumba': '伦巴', 'pasodoble': '斗牛舞',
  'k-pop': '韩国流行', 'j-pop': '日本流行', 'c-pop': '中文流行',
  'anime': '动漫音乐', 'j-rock': '日本摇滚', 'visual kei': '视觉系',
  'russian': '俄语', 'polish': '波兰语', 'turkish': '土耳其语',
  'arabic': '阿拉伯语', 'greek': '希腊语', 'dutch': '荷兰语',
  'celtic': '凯尔特', 'irish': '爱尔兰', 'scottish': '苏格兰',
  'christmas': '圣诞', 'holiday': '节日', 'summer': '夏日',
  'chillout': '弛放', 'study': '学习', 'sleep': '睡眠', 'relax': '放松',
  'workout': '运动', 'gym': '健身', 'party': '派对', 'mix': '混音',
  'balada en español': '西班牙语情歌', 'balada pop': '流行情歌', 'baladas': '情歌',
  'clásicos en inglés': '英语经典', 'musica regional mexicana': '墨西哥地方音乐',
  'pop en inglés': '英语流行', 'pop en español': '西班牙语流行',
  'musica romantica': '浪漫音乐', 'deportes': '体育', 'grupo acir': 'ACIR集团',
  'programas en vivo': '直播节目', 'noticias nacionales e internacionales': '国内外新闻',
  'hablada': '谈话', 'clásicos': '经典', 'radiópolis': '电台之城',
  'noticias y comentarios': '新闻与评论', 'noticias en español': '西班牙语新闻',
  'valle de méxico': '墨西哥谷', 'ciudad de méxico': '墨西哥城',
  'música del recuerdo': '怀旧音乐', 'música y noticias': '音乐与新闻',
  'radio hablada': '谈话电台', 'música variada': '综合音乐',
  'traditional mexican music': '传统墨西哥音乐', 'música mexicana': '墨西哥音乐',
  'música regional': '地方音乐', 'música en español e inglés': '西英双语音乐',
  'pop en español e inglés': '西英双语流行', 'música regional mexicana': '墨西哥地方音乐',
  'música tradicional mexicana': '墨西哥传统音乐', 'música en inglés': '英语音乐',
  'noticias locales': '本地新闻', 'baladas en español': '西班牙语情歌',
  'moi merino': '综合音乐', 'juvenil': '青少年', 'regional music': '地方音乐',
  'mexican music': '墨西哥音乐', 'mexico': '墨西哥', 'news talk': '新闻谈话',
  'regional radio': '地方电台', 'sports': '体育', 'top hits': '热门单曲',
  'culture': '文化', '2000s': '00年代', 'mex': '墨西哥', 'mx': '墨西哥',
  'top40': '热门40', 'am': '调幅', 'commercial': '商业',
  'mexico city': '墨西哥城', 'hiphop': '嘻哈', 'edm': '电子舞曲',
  "80's": '80年代', 'full service': '综合服务', 'misc': '其他',
  'grupero': '格鲁佩罗', 'latino': '拉丁', 'local': '本地',
  'electro': '电子', 'latin pop': '拉丁流行', 'cdmx': '墨西哥城',
  'npr': '公共广播', 'world music': '世界音乐', 'contemporary hits': '当代热门',
  'hot adult contemporary': '热门成人当代', 'university radio': '大学电台',
  'mvs radio': 'MVS电台', 'schlager': '施拉格', 'mvs': 'MVS',
  'popular': '流行', 'college radio': '大学电台',
  'hip-hop': '嘻哈', 'local music': '本地音乐', 'talk & speech': '谈话',
  'sureste': '东南部', 'various': '综合', 'charts': '排行榜',
  'top charts': '热门排行', "90's": '90年代', 'religion': '宗教',
  'christmas music': '圣诞音乐', 'sport': '体育', 'heavy metal': '重金属',
  'pop dance': '流行舞曲', '00s': '00年代', 'electronica': '电子音乐',
  '80er': '80年代', 'classic': '经典', 'hip hop': '嘻哈',
  'talk radio': '谈话电台', 'adult hits': '成人热门',
  'iheart radio': 'iHeart电台', 'mix': '混音', 'iheart': 'iHeart',
  'radiorama': '电台全景', 'veracruz': '韦拉克鲁斯', 'r&b': '节奏蓝调',
  'top 100': '百强榜', 'top': '排行榜', 'catholic': '天主教',
  'acir': 'ACIR', 'radio caprice': '随性电台',
  'classics': '经典', 'romantic': '浪漫', 'eurodance': '欧陆舞曲',
  '1980s': '80年代', 'contemporary hits radio': '当代热门电台',
  'international': '国际',
  'club': '夜店', 'avant-garde': '先锋', 'bebop': '比波普',
  'big band': '大乐队', 'swing': '摇摆', 'cool jazz': '冷爵士',
  'fusion': '融合', 'smooth jazz': '柔顺爵士', 'free jazz': '自由爵士',
  'christian music': '基督教音乐', 'contemporary christian': '当代基督教',
  'worship': '敬拜', 'praise': '赞美',
  '#original': '原创', 'original': '原创', 'rey': '雷伊',
  'california': '加州', 'free': '自由', 'eclectic': '折衷',
  '1920': '20年代', '1930': '30年代', '1940': '40年代',
  '1950': '50年代', '1960': '60年代', '1970': '70年代',
  '1980': '80年代', '1990': '90年代', '2000': '00年代',
  '2010': '10年代', '2020': '20年代',
  'retro': '复古', 'mainstream': '主流'
};

function tCountry(name) {
  if (!name) return '';
  // 精确匹配
  if (COUNTRY_ZH[name]) return COUNTRY_ZH[name];
  // trim 后再试
  const trimmed = name.trim();
  if (COUNTRY_ZH[trimmed]) return COUNTRY_ZH[trimmed];
  // 规范化空格后遍历匹配
  const normalized = trimmed.replace(/\s+/g, ' ').replace(/ Of /gi, ' of ').replace(/ And /gi, ' and ').replace(/ The /gi, ' the ');
  for (const [key, val] of Object.entries(COUNTRY_ZH)) {
    if (key.replace(/\s+/g, ' ').replace(/ Of /gi, ' of ').replace(/ And /gi, ' and ').replace(/ The /gi, ' the ') === normalized) return val;
  }
  // 去掉常见前缀再试
  const stripped = normalized
    .replace(/^The /i, '')
    .replace(/^Republic Of /i, '')
    .replace(/^The Republic Of /i, '')
    .replace(/^Bolivarian Republic Of /i, '')
    .replace(/^Islamic Republic Of /i, '')
    .replace(/^Syrian Arab Republic$/i, 'Syria')
    .replace(/^Korea$/i, 'South Korea')
    .replace(/ Arab Republic$/i, '')
    .replace(/ Republic$/i, '');
  if (stripped !== normalized) {
    for (const [key, val] of Object.entries(COUNTRY_ZH)) {
      if (key.replace(/\s+/g, ' ').replace(/ Of /gi, ' of ').replace(/ And /gi, ' and ').replace(/ The /gi, ' the ') === stripped) return val;
    }
  }
  return name;
}

function tTag(tag) {
  if (!tag) return '';
  let cleaned = tag.trim();
  // 去掉前导 #
  if (cleaned.startsWith('#')) cleaned = cleaned.slice(1);
  const lower = cleaned.toLowerCase();
  if (TAG_ZH[lower]) return TAG_ZH[lower];
  // 去掉重音符号再试 (música → musica)
  const ascii = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (TAG_ZH[ascii]) return TAG_ZH[ascii];
  return cleaned;
}

// ---- 状态 ----
const state = {
  currentPanel: 'discover',
  panelHistory: [],
  restoreDetail: null, // 从详情页跳转后恢复目标
  stationSource: 'discover', // 记录当前电台来自哪个面板
  playingStation: null,
  isPlaying: false,
  favorites: loadJSON(STORAGE_KEYS.favorites, []),
  history: loadJSON(STORAGE_KEYS.history, []),
  volume: loadJSON(STORAGE_KEYS.volume, 75),
  deadStations: (() => {
    const raw = loadJSON(STORAGE_KEYS.deadStations, []);
    // 兼容旧格式（纯 uuid 数组）→ 新格式（对象数组）
    if (raw.length > 0 && typeof raw[0] === 'string') {
      return raw.map(uuid => ({ stationuuid: uuid, name: '', country: '', tags: '', deadAt: 0 }));
    }
    return raw;
  })(),
  searchTimer: null,
  currentCountry: null,
  currentTag: null
};

// ---- DOM 缓存 ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  panels: $$('.panel'),
  navItems: $$('.nav-item'),
  discoverStations: $('#discover-stations'),
  countryList: $('#country-list'),
  countryStations: $('#country-stations'),
  countryIndex: $('#country-index'),
  countryDetail: $('#country-detail'),
  countryDetailTitle: $('#country-detail-title'),
  backFromCountry: $('#back-from-country'),
  genreList: $('#genre-list'),
  genreStations: $('#genre-stations'),
  genreIndex: $('#genre-index'),
  genreDetail: $('#genre-detail'),
  genreDetailTitle: $('#genre-detail-title'),
  backFromGenre: $('#back-from-genre'),
  searchInput: $('#search-input'),
  searchResults: $('#search-results'),
  favoritesList: $('#favorites-list'),
  historyList: $('#history-list'),
  playerName: $('#player-name'),
  playerTags: $('#player-tags'),
  playerArt: $('#player-art'),
  btnPlay: $('#btn-play'),
  audio: $('#audio-player'),
  volSlider: $('#vol-slider'),
  connectionStatus: $('#connection-status'),
  deadCount: $('#dead-count'),
  deadNum: $('#dead-num'),
  clearAllDead: $('#clear-all-dead'),
  deadStationsList: $('#dead-stations-list'),
  globalBack: $('#global-back'),
  npName: $('#np-name'),
  npTags: $('#np-tags'),
  npFreq: $('#np-freq'),
  npPlay: $('#np-play'),
  npArt: $('#np-art'),
  npCenter: document.querySelector('.np-center'),
  npBars: $('#np-bars')
};

// ---- 工具函数 ----
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function decodeHTML(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function countryFlag(code) {
  if (!code || code.length !== 2) return '🌐';
  const base = 0x1F1E6;
  const a = code.toUpperCase().charCodeAt(0) - 65;
  const b = code.toUpperCase().charCodeAt(1) - 65;
  return String.fromCodePoint(base + a, base + b);
}

function formatBitrate(br) {
  if (!br || br === 0) return '';
  return br >= 128 ? `${br} kbps` : '';
}

// ---- API 缓存 ----
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟

function getCached(key) {
  const entry = apiCache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  apiCache.delete(key);
  return null;
}

function setCache(key, data) {
  apiCache.set(key, { data, time: Date.now() });
}

// ---- API 层 ----
async function apiFetch(endpoint) {
  const cached = getCached(endpoint);
  if (cached) return cached;
  const url = `${API_BASE}${endpoint}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    setCache(endpoint, data);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function apiDiscover() {
  return apiFetch('/stations/topvote/20');
}

function apiGetCountries() {
  return apiFetch('/countries?order=stationcount&reverse=true&limit=100');
}

function apiGetTags() {
  return apiFetch('/tags?order=stationcount&reverse=true&limit=80');
}

function apiStationsByCountry(country) {
  return apiFetch(`/stations/bycountry/${encodeURIComponent(country)}?order=votes&reverse=true&limit=60`);
}

function apiStationsByTag(tag) {
  return apiFetch(`/stations/bytag/${encodeURIComponent(tag)}?order=votes&reverse=true&limit=60`);
}

function apiSearch(query) {
  return apiFetch(`/stations/search?name=${encodeURIComponent(query)}&order=votes&reverse=true&limit=60`);
}

// ---- 收藏管理 ----
function toggleFavorite(station) {
  const idx = state.favorites.findIndex(f => f.stationuuid === station.stationuuid);
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
  } else {
    state.favorites.unshift({
      stationuuid: station.stationuuid,
      name: station.name,
      tags: station.tags,
      country: station.country,
      countrycode: station.countrycode,
      url: station.url,
      url_resolved: station.url_resolved,
      bitrate: station.bitrate,
      favicon: station.favicon,
      addedAt: Date.now()
    });
  }
  saveJSON(STORAGE_KEYS.favorites, state.favorites);
}

function isFavorited(uuid) {
  return state.favorites.some(f => f.stationuuid === uuid);
}

// ---- 失效电台管理 ----
function markStationDead(uuid, name, country, tags) {
  if (state.deadStations.some(d => d.stationuuid === uuid)) return;
  state.deadStations.unshift({
    stationuuid: uuid,
    name: name || '',
    country: country || '',
    tags: tags || '',
    deadAt: Date.now()
  });
  if (state.deadStations.length > 500) state.deadStations = state.deadStations.slice(0, 300);
  saveJSON(STORAGE_KEYS.deadStations, state.deadStations);
  updateDeadCount();
  $$('.station-card').forEach(card => {
    if (card.dataset.uuid === uuid) card.remove();
  });
}

function isDead(uuid) {
  return state.deadStations.some(d => d.stationuuid === uuid);
}

function reviveStation(uuid) {
  state.deadStations = state.deadStations.filter(d => d.stationuuid !== uuid);
  saveJSON(STORAGE_KEYS.deadStations, state.deadStations);
  updateDeadCount();
}

function clearDeadStations() {
  state.deadStations = [];
  saveJSON(STORAGE_KEYS.deadStations, []);
  updateDeadCount();
}

// ---- 播放历史 ----
function addToHistory(station) {
  state.history = state.history.filter(h => h.stationuuid !== station.stationuuid);
  state.history.unshift({
    stationuuid: station.stationuuid,
    name: station.name,
    tags: station.tags,
    country: station.country,
    countrycode: station.countrycode,
    url: station.url,
    url_resolved: station.url_resolved,
    bitrate: station.bitrate,
    favicon: station.favicon,
    playedAt: Date.now()
  });
  if (state.history.length > 50) state.history = state.history.slice(0, 50);
  saveJSON(STORAGE_KEYS.history, state.history);
}

// ---- 播放控制 ----
let hls = null;
let audioCtx = null;
let analyser = null;
let animFrame = null;

function initAudioContext() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.8;
  try {
    const source = audioCtx.createMediaElementSource(dom.audio);
    source.connect(analyser);
  } catch (e) {
    // MediaElementSource 已存在，忽略
  }
  analyser.connect(audioCtx.destination);
}

function startSpectrum() {
  if (!analyser) return;
  const bars = dom.npBars.querySelectorAll('.np-bar');
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
  function draw() {
    animFrame = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    // 取前15个频段映射到15条柱子
    for (let i = 0; i < bars.length && i < dataArray.length; i++) {
      const val = dataArray[i] / 255;
      bars[i].style.height = (val * 100) + '%';
      bars[i].style.opacity = 0.3 + val * 0.7;
    }
  }
  draw();
}

function stopSpectrum() {
  if (animFrame) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }
  // 重置柱子
  const bars = dom.npBars?.querySelectorAll('.np-bar');
  if (bars) bars.forEach(b => { b.style.height = ''; b.style.opacity = ''; });
}

function onPlaySuccess(station) {
  // 记录是否从内部详情页跳转
  if (dom.countryDetail && dom.countryDetail.style.display !== 'none') {
    state.restoreDetail = 'country';
  } else if (dom.genreDetail && dom.genreDetail.style.display !== 'none') {
    state.restoreDetail = 'genre';
  } else {
    state.restoreDetail = null;
  }
  addToHistory(station);
  updatePlayerUI();
  updateAllCards();
  switchPanel('nowplaying', true);
  saveJSON(STORAGE_KEYS.lastStation, {
    stationuuid: station.stationuuid,
    name: station.name,
    tags: station.tags,
    country: station.country,
    countrycode: station.countrycode,
    url: station.url,
    url_resolved: station.url_resolved,
    bitrate: station.bitrate,
    favicon: station.favicon
  });
}

function playStation(station) {
  const url = station.url_resolved || station.url;
  if (!url) return;

  // 先清理旧播放器
  destroyHLS();
  stopSpectrum();

  state.playingStation = station;
  state.isPlaying = true;
  state.stationSource = state.currentPanel;

  // 检测 HLS (m3u8) 流
  if (/\.m3u8(\?|$)/i.test(url) && window.Hls && Hls.isSupported()) {
    hls = new Hls({
      manifestLoadTimeOut: 8000,
      manifestLoadMaxRetry: 1
    });
    hls.loadSource(url);
    hls.attachMedia(dom.audio);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      dom.audio.play().then(() => {
        if (audioCtx?.state === 'suspended') audioCtx.resume();
        startSpectrum();
        onPlaySuccess(station);
      }).catch(err => {
        console.warn('HLS 播放失败:', err.message);
        state.isPlaying = false;
        markStationDead(station.stationuuid, station.name, station.country, station.tags);
        updatePlayerUI();
      });
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.warn('HLS 错误:', data.type, data.details);
        destroyHLS();
        stopSpectrum();
        state.isPlaying = false;
        state.playingStation = null;
        markStationDead(station.stationuuid, station.name, station.country, station.tags);
        updatePlayerUI();
      }
    });
  } else {
    dom.audio.src = url;
    dom.audio.play().then(() => {
      if (audioCtx?.state === 'suspended') audioCtx.resume();
      startSpectrum();
      onPlaySuccess(station);
    }).catch(err => {
      console.warn('播放失败:', err.message);
      state.isPlaying = false;
      markStationDead(station.stationuuid, station.name, station.country, station.tags);
      updatePlayerUI();
    });
  }
}

function destroyHLS() {
  if (hls) {
    hls.destroy();
    hls = null;
  }
  dom.audio.pause();
  dom.audio.src = '';
}

function stopPlayback() {
  destroyHLS();
  state.isPlaying = false;
  state.playingStation = null;
  updatePlayerUI();
  updateAllCards();
}

function pausePlayback() {
  destroyHLS();
  stopSpectrum();
  state.isPlaying = false;
  updatePlayerUI();
  updateAllCards();
}

function togglePlay() {
  if (state.isPlaying) {
    pausePlayback();
  } else if (state.playingStation) {
    playStation(state.playingStation);
  }
}

function updatePlayerUI() {
  const st = state.playingStation;
  if (st) {
    dom.playerInfo.style.cursor = 'pointer';
    dom.playerInfo.title = '点击回到电台所在页面';
    dom.playerName.textContent = decodeHTML(st.name);
    const tags = st.tags ? st.tags.split(',').slice(0, 3).map(t => tTag(t)).join(' · ') : '';
    const extra = [tCountry(st.country), formatBitrate(st.bitrate)].filter(Boolean).join(' · ');
    dom.playerTags.textContent = [tags, extra].filter(Boolean).join('  |  ');
    dom.playerArt.classList.toggle('playing', state.isPlaying);
    dom.btnPlay.disabled = false;
  } else {
    dom.playerInfo.style.cursor = 'default';
    dom.playerInfo.title = '';
    dom.playerName.textContent = '未选择电台';
    dom.playerTags.textContent = '';
    dom.playerArt.classList.remove('playing');
    dom.btnPlay.disabled = true;
  }

  dom.btnPlay.classList.toggle('playing', state.isPlaying);
  const icon = state.isPlaying
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  dom.btnPlay.innerHTML = icon;

  updateNowPlaying();
}

function updateNowPlaying() {
  const st = state.playingStation;
  if (st) {
    dom.npName.textContent = decodeHTML(st.name);
    const tags = st.tags ? st.tags.split(',').slice(0, 4).map(t => tTag(t)).join(' · ') : '';
    const extra = [tCountry(st.country), formatBitrate(st.bitrate)].filter(Boolean).join(' · ');
    dom.npTags.textContent = tags;
    dom.npFreq.textContent = extra;
    dom.npPlay.disabled = false;
    dom.npCenter.classList.toggle('pulse', state.isPlaying);
    dom.npArt.classList.toggle('playing', state.isPlaying);
  } else {
    dom.npName.textContent = '未选择电台';
    dom.npTags.textContent = '';
    dom.npFreq.textContent = '';
    dom.npPlay.disabled = true;
    dom.npCenter.classList.remove('pulse');
    dom.npArt.classList.remove('playing');
  }

  dom.npPlay.classList.toggle('playing', state.isPlaying);
  const icon = state.isPlaying
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  dom.npPlay.innerHTML = icon;

  // 频谱条动画开关
  // 由 Web Audio API 实时驱动
}

function updateAllCards() {
  const uuid = state.playingStation?.stationuuid;
  $$('.station-card').forEach(card => {
    card.classList.toggle('playing', card.dataset.uuid === uuid);
  });
}

// ---- 电台卡片渲染 ----
function createStationCard(station) {
  const card = document.createElement('div');
  card.className = 'station-card';
  card.dataset.uuid = station.stationuuid;

  if (state.playingStation?.stationuuid === station.stationuuid) {
    card.classList.add('playing');
  }

  const name = decodeHTML(station.name);
  const tags = station.tags
    ? station.tags.split(',').slice(0, 3).map(t => `<span class="card-tag">${tTag(t)}</span>`).join('')
    : '';

  const freqText = station.bitrate ? `${station.bitrate} kbps` : '';
  const countryText = tCountry(station.country) || '';
  const favClass = isFavorited(station.stationuuid) ? 'favorited' : '';

  card.innerHTML = `
    <button class="card-dismiss" title="隐藏此电台">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div class="card-name" title="${name}">${name}</div>
    <div class="card-meta">
      ${tags}
      ${countryText ? `<span class="card-country">${countryText}</span>` : ''}
    </div>
    <div class="card-footer">
      <span class="card-freq">${freqText}</span>
      <button class="card-fav ${favClass}" data-uuid="${station.stationuuid}">
        <svg viewBox="0 0 24 24" fill="${favClass ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-fav') || e.target.closest('.card-dismiss')) return;
    playStation(station);
  });

  // 隐藏按钮
  card.querySelector('.card-dismiss').addEventListener('click', (e) => {
    e.stopPropagation();
    markStationDead(station.stationuuid, station.name, station.country, station.tags);
  });

  const favBtn = card.querySelector('.card-fav');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(station);
    favBtn.classList.toggle('favorited', isFavorited(station.stationuuid));
    const svg = favBtn.querySelector('svg');
    svg.setAttribute('fill', isFavorited(station.stationuuid) ? 'currentColor' : 'none');
  });

  return card;
}

function renderStations(container, stations, skipFilter = false) {
  container.innerHTML = '';
  const alive = skipFilter ? stations : stations.filter(s => !isDead(s.stationuuid));
  if (!alive || alive.length === 0) {
    container.innerHTML = '<div class="empty-state"><span>暂无可用电台</span></div>';
    return;
  }
  const fragment = document.createDocumentFragment();
  alive.forEach(st => fragment.appendChild(createStationCard(st)));
  container.appendChild(fragment);
}

function showLoading(container, text = '加载中...') {
  container.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <span>${text}</span>
    </div>
  `;
}

function showError(container, msg, onRetry) {
  container.innerHTML = `
    <div class="error-state">
      <span>${msg}</span>
      ${onRetry ? '<button class="error-retry">重试</button>' : ''}
    </div>
  `;
  if (onRetry) {
    container.querySelector('.error-retry').addEventListener('click', onRetry);
  }
}

// ---- 导航 ----
function switchPanel(panelId, addToHistory = true) {
  if (addToHistory && state.currentPanel !== panelId) {
    state.panelHistory.push(state.currentPanel);
    if (state.panelHistory.length > 30) state.panelHistory.shift();
  }
  state.currentPanel = panelId;

  dom.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.panel === panelId && ['nowplaying','discover','countries','genres','search','favorites','history'].includes(panelId));
  });

  dom.panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${panelId}`);
  });

  updateBackButton();
}

function updateBackButton() {
  const inDetail = (dom.countryDetail && dom.countryDetail.style.display !== 'none') ||
                   (dom.genreDetail && dom.genreDetail.style.display !== 'none');
  state._needsBack = state.panelHistory.length > 0 || inDetail;
  // 不直接显示，由鼠标行为控制
}

let backTimer = null;
function showBackButton() {
  if (!state._needsBack) return;
  dom.globalBack.classList.add('show');
  clearTimeout(backTimer);
  backTimer = setTimeout(() => dom.globalBack.classList.remove('show'), 2000);
}
function hideBackButton() {
  dom.globalBack.classList.remove('show');
}

function goBack() {
  // 先检查是否在内部详情页（国家/流派）
  if (dom.genreDetail && dom.genreDetail.style.display !== 'none') {
    dom.genreDetail.style.display = 'none';
    dom.genreIndex.style.display = 'block';
    updateBackButton();
    return;
  }
  if (dom.countryDetail && dom.countryDetail.style.display !== 'none') {
    dom.countryDetail.style.display = 'none';
    dom.countryIndex.style.display = 'block';
    updateBackButton();
    return;
  }
  // 全局面板回退
  if (state.panelHistory.length === 0) return;
  const prev = state.panelHistory.pop();
  switchPanel(prev, false);
  // 恢复内部详情页
  if (state.restoreDetail === 'country' && dom.countryDetail) {
    dom.countryIndex.style.display = 'none';
    dom.countryDetail.style.display = 'block';
    state.restoreDetail = null;
  } else if (state.restoreDetail === 'genre' && dom.genreDetail) {
    dom.genreIndex.style.display = 'none';
    dom.genreDetail.style.display = 'block';
    state.restoreDetail = null;
  }
  if (prev === 'favorites') loadFavorites();
  if (prev === 'history') loadHistory();
}

// ---- 数据加载 ----
async function loadDiscover() {
  showLoading(dom.discoverStations, '正在搜索全球热门电台...');
  try {
    const stations = await apiDiscover();
    renderStations(dom.discoverStations, stations);
    updateAllCards();
  } catch (err) {
    showError(dom.discoverStations, '加载失败，请检查网络连接', () => loadDiscover());
    dom.connectionStatus.textContent = '离线';
  }
}

async function loadCountries() {
  showLoading(dom.countryList, '加载国家列表...');
  try {
    const countries = await apiGetCountries();
    dom.countryList.innerHTML = '';
    countries.forEach(c => {
      const chip = document.createElement('button');
      chip.className = 'country-chip';
      const zhName = tCountry(c.name);
      chip.innerHTML = `
        <span class="country-flag">${countryFlag(c.iso_3166_1)}</span>
        <span>${zhName}</span>
        <span class="country-station-count">${c.stationcount}</span>
      `;
      chip.addEventListener('click', async () => {
        dom.countryIndex.style.display = 'none';
        dom.countryDetail.style.display = 'block';
        dom.countryDetailTitle.textContent = zhName;
        state.currentCountry = c.name;
        updateBackButton();
        await loadCountryStations(c.name, zhName);
      });
      dom.countryList.appendChild(chip);
    });
  } catch (err) {
    showError(dom.countryList, '加载失败', () => loadCountries());
  }
}

async function loadCountryStations(country, zhName) {
  const displayName = zhName || tCountry(country) || country;
  showLoading(dom.countryStations, `加载「${displayName}」的电台...`);
  try {
    const stations = await apiStationsByCountry(country);
    renderStations(dom.countryStations, stations);
    updateAllCards();
  } catch (err) {
    showError(dom.countryStations, '加载失败', () => loadCountryStations(country, zhName));
  }
}

async function loadGenres() {
  showLoading(dom.genreList, '加载流派列表...');
  try {
    const tags = await apiGetTags();
    dom.genreList.innerHTML = '';
    tags.slice(0, 48).forEach(t => {
      const chip = document.createElement('button');
      chip.className = 'tag-chip';
      const zhTag = tTag(t.name);
      chip.innerHTML = `${zhTag} <span class="tag-count">${t.stationcount}</span>`;
      chip.addEventListener('click', async () => {
        dom.genreIndex.style.display = 'none';
        dom.genreDetail.style.display = 'block';
        dom.genreDetailTitle.textContent = zhTag;
        state.currentTag = t.name;
        updateBackButton();
        await loadGenreStations(t.name, zhTag);
      });
      dom.genreList.appendChild(chip);
    });
  } catch (err) {
    showError(dom.genreList, '加载失败', () => loadGenres());
  }
}

async function loadGenreStations(tag, zhName) {
  const displayName = zhName || tTag(tag) || tag;
  showLoading(dom.genreStations, `加载「${displayName}」电台...`);
  try {
    const stations = await apiStationsByTag(tag);
    renderStations(dom.genreStations, stations);
    updateAllCards();
  } catch (err) {
    showError(dom.genreStations, '加载失败', () => loadGenreStations(tag, zhName));
  }
}

async function searchStations(query) {
  if (!query.trim()) {
    dom.searchResults.innerHTML = '<div class="empty-state"><span>输入关键词开始搜索</span></div>';
    return;
  }
  showLoading(dom.searchResults, `搜索「${query}」...`);
  try {
    const stations = await apiSearch(query);
    renderStations(dom.searchResults, stations);
    updateAllCards();
  } catch (err) {
    showError(dom.searchResults, '搜索失败', () => searchStations(query));
  }
}

function loadFavorites() {
  if (state.favorites.length === 0) {
    dom.favoritesList.innerHTML = `<div class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
      <span>还没有收藏电台</span>
    </div>`;
    return;
  }
  renderStations(dom.favoritesList, state.favorites);
}

function loadHistory() {
  if (state.history.length === 0) {
    dom.historyList.innerHTML = `<div class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>还没有播放记录</span>
    </div>`;
    return;
  }
  renderStations(dom.historyList, state.history);
}

function updateDeadCount() {
  const count = state.deadStations.length;
  if (count > 0) {
    dom.deadCount.style.display = 'block';
    dom.deadNum.textContent = count;
  } else {
    dom.deadCount.style.display = 'none';
  }
}

function loadDeadStationList() {
  if (state.deadStations.length === 0) {
    dom.deadStationsList.innerHTML = '<div class="empty-state"><span>暂无失效电台</span></div>';
    return;
  }
  // 为没有名字的旧数据补上默认名
  const list = state.deadStations.map((d, i) => ({
    ...d,
    name: d.name || `未知电台 #${i + 1}`,
    tags: d.tags || '',
    country: d.country || ''
  }));
  renderStations(dom.deadStationsList, list, true);
  dom.deadStationsList.querySelectorAll('.station-card').forEach(card => {
    card.querySelector('.card-fav')?.remove();
    // 隐藏右上角的 ×（失效列表里不需要再隐藏）
    const dismissBtn = card.querySelector('.card-dismiss');
    if (dismissBtn) dismissBtn.remove();
    // 左上角加恢复按钮
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'card-restore';
    restoreBtn.title = '恢复此电台';
    restoreBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>';
    restoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const uuid = card.dataset.uuid;
      reviveStation(uuid);
      card.style.opacity = '0';
      card.style.transform = 'translateX(20px)';
      card.style.transition = 'all 0.3s ease-out';
      setTimeout(() => {
        card.remove();
        updateDeadCount();
        if (state.deadStations.length === 0) {
          dom.deadStationsList.innerHTML = '<div class="empty-state"><span>暂无失效电台</span></div>';
        }
      }, 300);
    });
    card.appendChild(restoreBtn);
  });
}

// ---- 事件绑定 ----
function bindEvents() {
  // 全局返回按钮
  dom.globalBack.addEventListener('click', goBack);

  // 返回按钮鼠标行为：移动显示，2秒不动隐藏
  const mainContent = document.querySelector('.main-content');
  mainContent.addEventListener('mousemove', showBackButton);
  mainContent.addEventListener('mouseleave', hideBackButton);

  // 点击底部电台信息跳转到来源页
  dom.playerInfo = $('#player-info');
  dom.playerInfo.addEventListener('click', () => {
    if (!state.playingStation) return;
    const targetPanel = state.stationSource || 'discover';
    switchPanel(targetPanel);
    // 等面板渲染后滚动定位
    requestAnimationFrame(() => {
      const card = document.querySelector(`.station-card[data-uuid="${state.playingStation.stationuuid}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.boxShadow = '0 0 24px var(--accent-glow)';
        setTimeout(() => { card.style.boxShadow = ''; }, 2000);
      }
    });
  });

  // 侧边栏导航
  dom.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const panel = item.dataset.panel;
      state.panelHistory = [];
      switchPanel(panel);

      if (panel === 'favorites') loadFavorites();
      if (panel === 'history') loadHistory();
      if (panel === 'countries') {
        dom.countryIndex.style.display = 'block';
        dom.countryDetail.style.display = 'none';
      }
      if (panel === 'genres') {
        dom.genreIndex.style.display = 'block';
        dom.genreDetail.style.display = 'none';
      }
    });
  });

  // 点击「已隐藏x个」进入失效列表
  dom.deadCount.addEventListener('click', () => {
    switchPanel('dead');
    loadDeadStationList();
  });

  // 失效列表页的恢复全部按钮
  dom.clearAllDead.addEventListener('click', () => {
    if (confirm('确定要恢复所有已隐藏的失效电台吗？')) {
      clearDeadStations();
      switchPanel('discover');
      loadDiscover();
    }
  });

  // 搜索（300ms 防抖）
  dom.searchInput.addEventListener('input', () => {
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
      searchStations(dom.searchInput.value);
    }, 300);
  });

  // 播放按钮
  dom.btnPlay.addEventListener('click', togglePlay);
  dom.npPlay.addEventListener('click', togglePlay);

  // 第一次用户交互时初始化音频上下文
  document.addEventListener('click', function initAC() {
    initAudioContext();
  }, { once: true });

  // 音量
  dom.volSlider.value = state.volume;
  dom.audio.volume = state.volume / 100;
  dom.volSlider.addEventListener('input', () => {
    state.volume = parseInt(dom.volSlider.value);
    dom.audio.volume = state.volume / 100;
    saveJSON(STORAGE_KEYS.volume, state.volume);
  });

  // 音频事件
  dom.audio.addEventListener('play', () => {
    state.isPlaying = true;
    updatePlayerUI();
  });

  dom.audio.addEventListener('pause', () => {
    state.isPlaying = false;
    updatePlayerUI();
  });

  dom.audio.addEventListener('error', () => {
    state.isPlaying = false;
    updatePlayerUI();
    console.warn('音频流加载失败');
  });

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });
}

// ---- 启动 ----
async function init() {
  bindEvents();
  updatePlayerUI();
  updateDeadCount();

  // 并行加载初始数据
  Promise.all([
    loadDiscover(),
    loadCountries(),
    loadGenres()
  ]);

  // 自动续播上次电台
  const last = loadJSON(STORAGE_KEYS.lastStation, null);
  if (last && last.url_resolved) {
    state.playingStation = last;
    state.isPlaying = false;
    updatePlayerUI();
    switchPanel('nowplaying', false);
    // 延迟自动播放，等音频策略就绪
    setTimeout(() => playStation(last), 500);
  }
}

init();
