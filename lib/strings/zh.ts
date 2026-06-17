/**
 * 简体中文 strings — mirror of de.ts with identical structure and keys.
 * Source of truth for structure: ./de. Translate values only, keep keys.
 *
 * Voice: warm, hospitable, refined host. Natural Mandarin, not machine-stiff.
 */
import type { Strings } from './de';

export const zh: Strings = {
  brand: {
    name: 'Black Forest Retreats',
    location: '诺因比格',
    tagline: '黑森林，专属于你。',
  },
  formats: { decimal: '.' },
  nav: {
    retreats: '住宿',
    surroundings: '周边',
    gift: '礼券',
    about: '关于我们',
    book: '预订',
    menu: '菜单',
    close: '关闭',
  },
  booking: {
    cta: '直接预订',
    directBenefit: '直接预订，更省钱',
    bookStay: '预订你的假期',
  },

  hero: {
    eyebrow: '黑森林 · 诺因比格',
    title: '在黑森林里好好休息',
    subtitle:
      '林间精心布置的度假公寓。由我们亲自打理，直接向我们预订总是最划算。',
    scrollCue: '看一看',
  },

  intro: {
    eyebrow: '关于我们',
    title: '更直接，更贴心',
    text: '我们在诺因比格的度假公寓由我们自己出租，中间没有平台。这对你意味着：最优价格、一位真正可以联系的人，还有来自本地的第一手贴士。',
    features: [
      {
        title: '直接预订',
        text: '没有平台手续费。在我们这里，你总能拿到最低价。',
      },
      {
        title: '贴心相待',
        text: '不是冷冰冰的酒店，而是一位真正了解这片土地的主人。',
      },
      {
        title: '就在林间',
        text: '冷杉、山谷与诺因比格城堡，就在门外。',
      },
    ],
  },

  apartments: {
    eyebrow: '住宿',
    title: '我们的度假居所',
    text: '每一处公寓都各有不同：有的望见城堡，有的临河而望，但都带着一份黑森林的气息。看看哪一处最适合你。',
    cta: '查看更多',
    prev: '上一个',
    next: '下一个',
    exclusive: '独享',
    comingSoon: '即将开放',
    soldOut: {
      badge: '已订满',
      until: (year: string) => `已订满，至 ${year} 年`,
      featured: '非常抢手',
      detailTitle: '暂时已订满',
      detailText: (year: string) =>
        `这处住宿已全部订满，至 ${year} 年。欢迎看看我们其他可预订的公寓。`,
      detailCta: '可预订的住宿',
    },
    facts: {
      bedrooms: '卧室',
      beds: '床',
      guests: '房客',
      bathrooms: '浴室',
    },
    detail: {
      back: '所有住宿',
      overview: '一览',
      highlights: '与众不同之处',
      about: '关于这处住宿',
      amenities: '设施',
      gallery: '照片',
      showAllPhotos: '查看所有照片',
      showAllAmenities: '显示全部设施',
      showLess: '收起',
      reviewsTitle: '房客这样说',
      reviewsCount: (n: number) => `${n} 条评价`,
      ratingLine: (rating: string, n: number) => `${rating} · ${n} 条评价`,
      guestFavorite: '房客最爱',
      superhost: '超赞房东',
      bookTitle: '准备好走进黑森林了吗？',
      bookText: '锁定你在诺因比格的日子，直接预订，没有弯路。',
      book: '查看空房与预订',
      note: '目前通过 Airbnb 预订 · 直接预订即将上线',
    },
    // Meta templates (numbers come from data/retreats.ts)
    meta: (bedrooms: number, beds: number, guests: number) =>
      `${bedrooms} 间卧室 · ${beds} 张床 · ${guests} 位房客`,
  },

  surroundings: {
    eyebrow: '周边',
    title: '门外有什么',
    text: '美食、自然，还有几样地道的黑森林经典，大多几分钟就能到。',
    categories: {
      restaurants: {
        title: '餐厅',
        text: '从街角小馆到米其林星级。',
      },
      experiences: {
        title: '体验',
        text: '与羊驼同行、在恩茨河上划皮划艇、走进山谷。',
      },
      nature: {
        title: '自然与徒步',
        text: '艾亚赫山谷、Wildline 吊桥，还有国家公园。',
      },
      culture: {
        title: '文化与名胜',
        text: '诺因比格的城堡与矿坑、Gasometer 全景馆、斯图加特的各家博物馆。',
      },
      wellness: {
        title: '康养与温泉',
        text: '让人彻底放松的温泉与水疗，就在转角。',
      },
      regional: {
        title: '美味与本地特产',
        text: '产地直供的新鲜鳟鱼，地道的黑森林风味。',
      },
    },
    all: '探索全部',
    discover: '探索',
    hub: {
      eyebrow: '周边',
      title: '门外有什么',
      text: '从米其林星级到静谧的河谷。诺因比格周围的六个世界，大多几分钟即达。',
      highlights: '房客的最爱',
      highlightsText: '房客们最喜欢的地方。每个分类都有我们一份明确的推荐。',
      categories: '所有分类',
      categoriesText: '展开你感兴趣的分类，慢慢逛。',
    },
    detail: {
      back: '返回周边',
      kicker: '周边',
    },
    accordion: {
      open: '展开',
      close: '收起',
      viewAll: (title: string) => `查看全部${title}`,
    },
    card: {
      michelin: '米其林',
      dayTrip: '一日游',
      recommended: '我们的推荐',
      soon: '更多信息即将奉上',
      photo: '照片：',
    },
    filter: {
      aria: '按距离筛选',
      near: '就在附近',
      mid: '稍远一些',
      day: '一日游',
      empty: '这个选择下暂时没有内容。再开启一个区域试试。',
    },
  },

  facts: {
    eyebrow: '黑森林',
    fact1: {
      quote:
        '罗马人称它为「Silva Nigra」：冷杉密得几乎不让阳光照到林间的地面。\n\n这便是它名字的由来：黑森林。',
      source: '名字从何而来',
    },
    fact2: {
      quote:
        '布谷鸟钟、绒球帽、黑森林樱桃蛋糕：这片森林偏爱那些需要时间与手艺的东西。\n\n好在，你带来了时间。',
      source: '黑森林的味道',
    },
  },

  gift: {
    eyebrow: '送份心意',
    title: '把黑森林送给他',
    text: '一张礼券，换来黑森林里的几日时光。金额自定，任意公寓均可使用，全年有效。',
    cta: '购买礼券',
    trust: '邮件即时送达 · 有效期 3 年 · 金额自定',
  },

  apartmentsPreview: {
    eyebrow: '住宿',
    title: '你在黑森林的康养绿洲',
    text: '在诺因比格找到属于你的度假公寓：望见城堡，窗前冷杉，宁静自来。',
    cta: '查看住宿并预订',
  },

  park: {
    home: '我们的家',
    name: '北黑森林国家公园',
    tagline: '黑森林，专属于你。',
  },

  map: {
    eyebrow: '我们在这里',
    title: '就在北黑森林深处',
    subtitle: '北黑森林国家公园',
    marker: '诺因比格',
  },

  footer: {
    tagline: '黑森林，专属于你。诺因比格的度假公寓。',
    discover: {
      title: '探索',
      links: ['住宿', '周边', '礼券', '关于我们'],
    },
    service: {
      title: '服务',
      links: ['抵达方式', '常见问题', '取消政策', '联系我们'],
    },
    contact: {
      title: '联系我们',
      location: '诺因比格 · 北黑森林国家公园',
      email: 'hallo@blackforestretreats.de',
      newsletterTitle: '订阅通讯',
      newsletterText: '偶尔捎来黑森林的消息：新公寓与悄悄话般的优惠。仅此而已。',
      newsletterPlaceholder: '你的邮箱',
      newsletterCta: '订阅',
    },
    legal: ['法律声明', '隐私政策', '条款'],
    copyright: (year: number) => `© ${year} Black Forest Retreats`,
  },

  langSwitcher: {
    label: '语言',
  },

  /**
   * Localised stay content (text out of data/retreats.ts).
   * Key = retreat.id. usps[] and reviews[] in the SAME order as the data file.
   */
  retreatsContent: {
    'black-forest-penthouse': {
      name: 'Black Forest Penthouse',
      highlight: '顶层公寓 · 望见城堡',
      tagline: '我们最受欢迎的一处',
      shortDescription:
        '屋檐下别具个性的顶层公寓，带露台，望向诺因比格城堡。',
      description:
        '一处精装翻新的顶层公寓，屋顶下设有两间夹层卧室、现代厨房，以及一座俯瞰恩茨河的大露台。裸露的木梁、质朴的原木床，还有那些讲究的细节：半自动咖啡机、可看 Netflix 的智能电视，以及一台 Marshall 音箱。就在黑森林之中，毫无遮挡地望向诺因比格城堡。',
      usps: [
        { title: '望见城堡', text: '从床上和露台，直接望向诺因比格城堡。' },
        { title: '密码箱自助入住', text: '想几点到就几点到，无需交接钥匙。' },
        { title: '免费停车', text: '这一带难得的好处，在我们这里包含在内。' },
        { title: '一尘不染', text: '房客一次次特别称赞的地方。' },
      ],
      reviews: [
        { date: '2025年5月', text: '躺在床上就能望见城堡，这份景致无价。处处一尘不染，密码箱入住毫不费事。' },
        { date: '2025年4月', text: 'Tom 是位超棒的房东，回复很快，还给了不少周边的好建议。傍晚的露台简直如梦。' },
        { date: '2025年3月', text: '布置得很有格调，安静又不偏僻。停车就在门口。我们还会再来！' },
      ],
      amenities: [
        '大露台',
        '望见城堡',
        '设备齐全的厨房',
        '半自动咖啡机',
        '智能电视与 Netflix',
        'Marshall 音箱',
        '高速 WiFi 与办公区',
        '免费停车',
      ],
    },
    'fachwerk-apartment': {
      name: 'Fachwerk-Apartment',
      highlight: '木筋架构 · 露台与城堡景',
      tagline: '为两人世界而设',
      shortDescription:
        '地道的木筋架构，满室温润原木，还有一座望见城堡的屋顶露台。',
      description:
        '一处坐落于历史木筋老屋中的雅致公寓：裸露的梁架、天然石墙与温润的原木。两间卧室、一间私人浴室，以及一座高踞诺因比格屋顶之上的露台，毫无遮挡地望向城堡。这是为两到四位房客准备的静谧栖所。',
      usps: [
        { title: '屋顶露台望城堡', text: '高踞诺因比格的屋顶之上，城堡尽收眼底。' },
        { title: '地道的木筋架构', text: '裸露的梁架、天然石墙、温润的原木。' },
        { title: '私人浴室', text: '完全属于你，设施现代。' },
        { title: '高速 WiFi', text: '办公或追剧都游刃有余。' },
      ],
      reviews: [
        { date: '2025年5月', text: '老梁架的木筋结构太有韵味了。屋顶露台还能望见城堡，真是地道的度假。' },
        { date: '2025年4月', text: '布置得用心，干净得很，位置又安静。在黑森林过个周末再合适不过。' },
        { date: '2025年2月', text: '沟通很亲切，一切都顺顺利利。强烈推荐。' },
      ],
      amenities: [
        '屋顶露台',
        '望见城堡',
        '私人浴室',
        '设备齐全的厨房',
        '裸露的木筋架构',
        '免费 WiFi',
      ],
    },
    riverhouse: {
      name: 'Riverhouse',
      highlight: '临河而居 · 望向水面',
      tagline: '为全家人而设',
      shortDescription:
        '一座宽敞的房子，紧邻恩茨河，望向开阔的水面。',
      description:
        '一座宽敞的房子，就在恩茨河岸边。大面积的落地窗把河水引入室内，为家庭和团体留足空间。专属的河岸通道、宁静的环境，门外就是潺潺水声。',
      usps: [
        { title: '临河而居', text: '门外河水潺潺，还附带专属的河岸通道。' },
        { title: '可住 10 位房客', text: '八间卧室，适合家庭与团体。' },
        { title: '宽敞的用餐区', text: '设备齐全的厨房，还有供所有人围坐的长桌。' },
        { title: '高速 WiFi', text: '覆盖全屋，临水办公也没问题。' },
      ],
      reviews: [
        { date: '2024年8月', text: '伴着水声入睡太惬意了。全家人都有充足的空间。' },
        { date: '2024年7月', text: '宽敞、明亮，临河的景致独一无二。随时还想再来。' },
      ],
      amenities: [
        '临河而居',
        '望向水面',
        '专属河岸通道',
        '设备齐全的厨房',
        '宽敞的用餐区',
        '高速 WiFi',
      ],
    },
    'the-raccoon-house': {
      name: 'Raccoon House',
      highlight: 'Marktstraße 25 号 · 老城区',
      tagline: '老城韵味',
      shortDescription:
        '位于 Marktstraße 25 号、别具个性的城中宅邸，就在老城中心。',
      description:
        '一座用心修整的城中宅邸，坐落于 Marktstraße 25 号，就在诺因比格的历史核心。吱呀作响的木地板、厚实的墙体，多层楼里满是韵味。咖啡馆、面包店与城堡，都只在几步之遥。',
      usps: [
        { title: '就在老城中心', text: '咖啡馆、面包店与城堡，都只在几步之遥。' },
        { title: '上下数层', text: '历史城中宅邸里满是韵味与空间。' },
        { title: '设备齐全的厨房', text: '像在家一样下厨。' },
        { title: '免费 WiFi', text: '全屋快速又稳定。' },
      ],
      reviews: [
        { date: '2024年10月', text: '就在老城中心，迷人的城中宅邸上下数层。我们一进门就觉得自在。' },
        { date: '2024年9月', text: '位置绝佳，处处都能步行抵达。漂亮又布置得用心。' },
      ],
      amenities: [
        '就在老城中心',
        '上下数层',
        '历史城中宅邸',
        '设备齐全的厨房',
        '免费 WiFi',
      ],
    },
    'the-postal-office': {
      name: 'The Postal Office',
      highlight: '昔日的老邮局 · 诺因比格心脏地带',
      tagline: '我们的镇店之宝',
      shortDescription:
        '庄重的老邮局，经过宽敞改造，专为大型团体而设。',
      description:
        '诺因比格的历史邮局，被用心改造成一处非凡的栖居之所。高挑的天花板、开阔的空间，足以容纳大型团体或聚会。一处承载着历史的特别之地，就在城镇的心脏地带。',
      usps: [
        { title: '历史邮局', text: '一处承载历史的特别之地，就在诺因比格中心。' },
        { title: '最多可住 20 位房客', text: '十间卧室，适合大型团体与聚会。' },
        { title: '高挑天花板与开阔空间', text: '宽敞之处，少有住宿能比。' },
        { title: '宽敞的公共区域', text: '一起下厨、用餐、共度时光。' },
      ],
      reviews: [
        { date: '2024年11月', text: '多特别的一座房子！天花板高、空间大，正适合我们这一大群人。' },
        { date: '2024年9月', text: '触手可及的历史，加上真正充裕的空间。是一次难得的体验。' },
      ],
      amenities: [
        '历史邮局',
        '高挑天花板与开阔空间',
        '适合大型团体',
        '宽敞的公共区域',
        '设备齐全的厨房',
        '高速 WiFi',
      ],
    },
  } as Record<
    string,
    {
      name: string;
      highlight: string;
      tagline: string;
      shortDescription: string;
      description: string;
      usps: { title: string; text: string }[];
      reviews: { date: string; text: string }[];
      amenities: string[];
    }
  >,

  /**
   * Localised place content (text out of data/surroundings.ts).
   * Key = place.id.
   */
  surroundingsContent: {
    'berlins-krone': {
      name: 'Berlins Krone',
      town: '巴特泰因纳赫',
      blurb:
        'Hotel Berlins KroneLamm 内的星级料理。有值得庆祝的事时，专属于那个特别的夜晚。',
      features: ['米其林', '星级料理', '高级餐饮'],
    },
    'benders-birkenfeld': {
      name: 'Benders Birkenfeld',
      town: '比尔肯费尔德',
      blurb:
        '脚踏实地的家族小馆，主打地方风味，就在转角。',
      features: ['家常美味', '本地风味', '家族经营'],
    },
    'arlinger-gaststaette': {
      name: 'Arlinger Gaststätte',
      town: '普福尔茨海姆',
      blurb: '家常经典菜肴，还有一方适合夏夜的好露台。',
      features: ['家常', '露台'],
    },
    'seehaus-pforzheim': {
      name: 'Seehaus',
      town: '普福尔茨海姆',
      blurb: '林边的休闲餐馆，散步之后正合适。',
      features: ['休闲餐馆', '林边'],
    },
    'foerstlich-weinbar': {
      name: 'Förstlich Weinbar',
      town: '朗根施泰因巴赫',
      blurb: '一间酒吧，备有冷盘小食与本地佳酿，适合悠闲的夜晚。',
      features: ['酒吧', '冷盘小食', '本地葡萄酒'],
    },
    'muellers-event-alm': {
      name: 'Müllers Eventalm',
      blurb: '热闹的山间小屋氛围，带大啤酒花园，颇有活动气氛。',
      features: ['山间小屋', '啤酒花园', '活动'],
    },
    'cafe-blaich': {
      name: 'Café Blaich',
      town: '霍芬（恩茨河畔）',
      blurb:
        '自 1954 年起的西点店与咖啡馆，手工蛋糕，正好作甜蜜的午后一站。',
      features: ['咖啡馆', '西点店', '始于 1954 年'],
    },
    'alpaka-wanderung': {
      name: '羊驼徒步',
      town: '普福尔茨海姆',
      blurb: '由向导带领，与这些温顺的动物一起穿过森林与草地。',
      features: ['向导带领', '亲子', '约 2 小时'],
    },
    'wildpark-pforzheim': {
      name: '普福尔茨海姆野生动物园',
      town: '普福尔茨海姆',
      blurb: '近距离接触本地动物，全年皆宜，适合全家出游。',
      features: ['动物', '亲子', '全年开放'],
    },
    'kajak-enz': {
      name: '恩茨河皮划艇之旅',
      town: '恩茨河谷',
      blurb: '在水上穿行山谷。夏季有租赁与导览。',
      features: ['活力', '夏季', '租赁'],
    },
    fliegenfischen: {
      name: '飞蝇钓',
      town: '艾亚赫山谷',
      blurb: '在清澈的水边由向导授课，于自然中静心专注。',
      features: ['向导带领', '课程', '自然'],
    },
    minigolf: {
      name: '诺因比格迷你高尔夫',
      town: '诺因比格',
      blurb: '户外悠闲时光的经典之选。',
      features: ['亲子', '户外'],
    },
    freibad: {
      name: '诺因比格露天泳池',
      town: '诺因比格',
      blurb: '炎炎夏日里的清凉，轻松又适合全家。',
      features: ['夏季', '亲子'],
    },
    'ziegen-wanderung': {
      name: '山羊徒步',
      town: '施特劳本哈特',
      blurb: '与好奇的山羊一起出游，尤其是孩子们的一次体验。',
      features: ['向导带领', '适合孩子'],
    },
    'nationalpark-schwarzwald': {
      name: '黑森林国家公园',
      town: '鲁厄施泰因',
      blurb:
        '明日的原始森林：绵长的步道、高山沼泽与山巅景致。一次值得的一日游。',
      features: ['徒步', '景致', '一日游'],
    },
    eyachtal: {
      name: '艾亚赫山谷',
      town: '艾亚赫山谷',
      blurb: '静谧的河谷，适合徒步与深呼吸，就在近旁。',
      features: ['徒步', '河流', '宁静'],
    },
    'wildline-haengebruecke': {
      name: 'Wildline 吊桥',
      town: '巴特维尔德巴德',
      blurb:
        '高悬山谷之上、随风轻晃的吊桥，还有树冠步道，景致适合全家同享。',
      features: ['景致', '亲子', '树冠步道'],
    },
    'bergwerk-neuenburg': {
      name: 'Besucherbergwerk Frischglück 参观矿坑',
      town: '诺因比格',
      blurb:
        '历史矿坑与诺因比格城堡相伴，设有导览与「山中剧场」（Theater im Berg），就在门口。',
      features: ['历史', '导览', '山中剧场'],
    },
    'gasometer-pforzheim': {
      name: 'Gasometer Pforzheim 全景馆',
      town: '普福尔茨海姆',
      blurb: '老储气罐里的巨幅 360° 全景，一种别具一格的艺术体验。',
      features: ['艺术', '全景', '独一无二'],
    },
    'porsche-museum': {
      name: '保时捷博物馆',
      town: '斯图加特',
      blurb: '跑车经典与大胆建筑。一次为技术迷而设的一日游。',
      features: ['建筑', '一日游'],
    },
    'mercedes-museum': {
      name: '梅赛德斯-奔驰博物馆',
      town: '斯图加特',
      blurb: '逾百年的汽车史，沿着螺旋上升的时光之旅徐徐展开。',
      features: ['历史', '一日游'],
    },
    wilhelma: {
      name: 'Wilhelma 动植物园',
      town: '斯图加特',
      blurb: '摩尔风格的动植物园。一整天，全家同乐。',
      features: ['动物园与植物园', '亲子', '一日游'],
    },
    'palais-thermal': {
      name: 'Palais Thermal',
      town: '巴特维尔德巴德',
      blurb:
        '摩尔风格的历史温泉浴场，带桑拿区，是近旁一个静养的好去处。',
      features: ['历史温泉', '桑拿'],
    },
    'siebentaeler-therme': {
      name: 'Siebentäler Therme 温泉',
      town: '巴特黑伦阿尔布',
      blurb: '温暖的温泉水与开阔的桑拿区，让人彻底放松。',
      features: ['温泉', '桑拿'],
    },
    'mineraltherme-teinach': {
      name: 'Mineraltherme 矿泉',
      town: '巴特泰因纳赫',
      blurb: '位于静谧之地的疗养水与水疗，最适合放慢脚步。',
      features: ['疗养水', '水疗'],
    },
    'forellenzucht-zordel': {
      name: 'Forellenzucht Zordel 鳟鱼养殖场',
      town: '艾亚赫山谷',
      blurb:
        '产地直供的新鲜鳟鱼，烟熏好可带走。地道本地，本该如此。',
      features: ['新鲜鳟鱼', '烟熏坊', '现场销售'],
    },
  } as Record<
    string,
    { name: string; town?: string; blurb: string; features: string[] }
  >,
};
