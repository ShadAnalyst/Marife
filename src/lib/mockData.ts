// Real product data from marife.ch — prices in CHF

export interface MockVariant {
  id: string;
  sku: string;
  variantName: string;
  sizeValue: string | null;
  colorValue: string | null;
  priceModifier: number | null;
  currentStock: number;
  lowStockThreshold: number;
  isAvailable: boolean;
}

export interface MockImage {
  id: string;
  urlMain: string;
  urlThumbnail: string;
  urlZoom: string | null;
  sortOrder: number;
}

export interface MockProduct {
  id: string;
  skuPrefix: string;
  name: string;
  slug: string;
  descriptionShort: string;
  descriptionLong: string;
  basePrice: number;
  salePrice?: number;
  isActive: boolean;
  images: MockImage[];
  variants: MockVariant[];
  category: string;
  tags: string[];
}

export const makeVariants = (prefix: string, sizes: string[], stock?: number[]): MockVariant[] =>
  sizes.map((size, i) => ({
    id: `${prefix}-v${i}`,
    sku: `${prefix}-${size.replace(/\//g, "-")}`,
    variantName: `Size ${size}`,
    sizeValue: size,
    colorValue: null,
    priceModifier: null,
    currentStock: stock ? stock[i] ?? 10 : Math.floor(Math.random() * 15) + 3,
    lowStockThreshold: 5,
    isAvailable: (stock ? stock[i] ?? 10 : 10) > 0,
  }));

export const MOCK_PRODUCTS: MockProduct[] = [

  // ── FASHION ─────────────────────────────────────────────────────────────────
  {
    id: "fash-001",
    skuPrefix: "FASH-001",
    name: "Bustier Leopard Velours",
    slug: "bustier-leopard-velours",
    descriptionShort: "Sexy Crop Top im Leopardendesign aus glänzendem Velours-Stoff. Gepolsterter Bügel-BH mit 4 Kunststoff-Stäbchen.",
    descriptionLong: "Dieses super coole, sexy Crop Top aus glänzendem Velours-Stoff im angesagten Leopardendesign ist ein absoluter Blickfang für Clubbing, Tanzen und Partys.",
    basePrice: 79.90,
    salePrice: 39.90,
    isActive: true,
    category: "fashion",
    tags: ["bustier", "leopard", "velours", "top"],
    images: [
      { id: "fash-001-img1", urlMain: "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg", urlThumbnail: "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("FASH-001", ["S", "M", "L", "XL"], [5, 8, 10, 6]),
  },
  {
    id: "fash-002",
    skuPrefix: "FASH-002",
    name: "Seamless Bustier",
    slug: "seamless-bustier",
    descriptionShort: "Figurbetontes Seamless Bustier mit wellenförmigen Rändern und elastischem Bündchen für einen sicheren Sitz.",
    descriptionLong: "Dieses Seamless Bustier vereint Komfort, Stil und perfekte Passform. Das figurbetonte Design schmiegt sich sanft an die Körperform.",
    basePrice: 31.70,
    isActive: true,
    category: "fashion",
    tags: ["bustier", "seamless", "basic"],
    images: [
      { id: "fash-002-img1", urlMain: "https://marife.ch/media/02/a9/a6/1735211412/12480.jpg", urlThumbnail: "https://marife.ch/media/02/a9/a6/1735211412/12480.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("FASH-002", ["XS", "S", "M", "L"], [6, 8, 10, 5]),
  },
  {
    id: "fash-003",
    skuPrefix: "FASH-003",
    name: "Minikleid Elegant Schwarz",
    slug: "minikleid-elegant-schwarz",
    descriptionShort: "Figurbetontes schwarzes Minikleid aus 80% Polyester und 20% Elasthan. Perfekt für Partys und Abendveranstaltungen.",
    descriptionLong: "Dieses wunderschöne schwarze Minikleid vereint Eleganz und Stil in einem modernen Design.",
    basePrice: 64.30,
    isActive: true,
    category: "fashion",
    tags: ["kleid", "mini", "schwarz", "party"],
    images: [
      { id: "fash-003-img1", urlMain: "https://marife.ch/media/83/b0/0b/1732465042/R80508-1-1.jpg", urlThumbnail: "https://marife.ch/media/83/b0/0b/1732465042/R80508-1-1.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("FASH-003", ["XS", "S", "M", "L"], [4, 6, 7, 3]),
  },
  {
    id: "fash-004",
    skuPrefix: "FASH-004",
    name: "Wetlook Top Premium",
    slug: "wetlook-top-premium",
    descriptionShort: "Eng anliegendes Wetlook-Top mit Hochglanzeffekt. Ideal für Clubwear, Partys oder besondere Anlässe.",
    descriptionLong: "Dieses eng anliegende Wetlook-Top ist das perfekte Kleidungsstück für selbstbewusste Styles und auffällige Outfits.",
    basePrice: 59.40,
    isActive: true,
    category: "fashion",
    tags: ["top", "wetlook", "glanz"],
    images: [
      { id: "fash-004-img1", urlMain: "https://marife.ch/media/c1/8e/4e/1735208421/0000T9410_19064.jpg", urlThumbnail: "https://marife.ch/media/c1/8e/4e/1735208421/0000T9410_19064.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("FASH-004", ["One Size"], [12]),
  },
  {
    id: "fash-005",
    skuPrefix: "FASH-005",
    name: "Swing Kleid Blumenmuster",
    slug: "swing-kleid-blumenmuster",
    descriptionShort: "Elegantes Swing-Kleid mit farbenfrohem Blumenmuster und breitem Bauchband für eine betonte Taille.",
    descriptionLong: "Zeitloses Swing-Kleid mit floralem Charme. Breites Bauchband betont die Taille und sorgt für eine schöne Silhouette.",
    basePrice: 74.40,
    isActive: true,
    category: "fashion",
    tags: ["kleid", "swing", "blumen"],
    images: [
      { id: "fash-005-img1", urlMain: "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg", urlThumbnail: "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("FASH-005", ["XS", "S", "M", "L", "XL"], [3, 5, 8, 5, 2]),
  },

  // ── DESSOUS (LINGERIE) ──────────────────────────────────────────────────────
  {
    id: "des-001",
    skuPrefix: "DES-001",
    name: "Babydoll mit ausgefallenem Muster",
    slug: "babydoll-ausgefallenem-muster",
    descriptionShort: "Verführerisches Babydoll mit einzigartigem Muster. Betont die feminine Silhouette auf elegante Weise.",
    descriptionLong: "Dieses formschöne Babydoll ist die perfekte Wahl für Frauen, die nach einem stilvollen und verführerischen Dessous-Stück suchen.",
    basePrice: 32.80,
    isActive: true,
    category: "dessous",
    tags: ["babydoll", "lingerie", "dessous"],
    images: [
      { id: "des-001-img1", urlMain: "https://marife.ch/media/f9/86/9a/1730145264/h3506-7.jpg", urlThumbnail: "https://marife.ch/media/f9/86/9a/1730145264/h3506-7.jpg", urlZoom: null, sortOrder: 0 },
      { id: "des-001-img2", urlMain: "https://marife.ch/media/2a/7a/7b/1730145263/h3506-1.jpg", urlThumbnail: "https://marife.ch/media/2a/7a/7b/1730145263/h3506-1.jpg", urlZoom: null, sortOrder: 1 },
    ],
    variants: makeVariants("DES-001", ["XS/M", "L/2XL"], [8, 4]),
  },
  {
    id: "des-002",
    skuPrefix: "DES-002",
    name: "Babydoll Spitze Premium",
    slug: "babydoll-spitze-premium",
    descriptionShort: "Elegantes Babydoll aus hochwertiger Spitze. Romantisch und verführerisch zugleich.",
    descriptionLong: "Luxuriöses Babydoll aus feiner Spitze mit aufwändigen Details. Perfekt für besondere Momente.",
    basePrice: 44.30,
    salePrice: 36.90,
    isActive: true,
    category: "dessous",
    tags: ["babydoll", "spitze", "lingerie"],
    images: [
      { id: "des-002-img1", urlMain: "https://marife.ch/media/ed/5c/52/1730145226/r81171-1.jpg", urlThumbnail: "https://marife.ch/media/ed/5c/52/1730145226/r81171-1.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("DES-002", ["XS", "S", "M", "L"], [10, 12, 8, 3]),
  },
  {
    id: "des-003",
    skuPrefix: "DES-003",
    name: "Body Elegant Schwarz",
    slug: "body-elegant-schwarz",
    descriptionShort: "Hochwertiger Body in elegantem Schwarz. Perfekter Sitz und verführerisches Design.",
    descriptionLong: "Dieser elegante Body aus hochwertigen Materialien schmiegt sich perfekt an die Körperform an.",
    basePrice: 44.30,
    isActive: true,
    category: "dessous",
    tags: ["body", "schwarz", "elegant", "dessous"],
    images: [
      { id: "des-003-img1", urlMain: "https://marife.ch/media/b4/d8/d0/1730145111/r81046-2p-8.jpg", urlThumbnail: "https://marife.ch/media/b4/d8/d0/1730145111/r81046-2p-8.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("DES-003", ["XS", "S", "M", "L", "XL"], [4, 8, 12, 7, 3]),
  },
  {
    id: "des-004",
    skuPrefix: "DES-004",
    name: "Body Open Back Verführerisch",
    slug: "body-open-back",
    descriptionShort: "Sinnlicher Body mit offenem Rücken. Maximale Wirkung, minimales Design.",
    descriptionLong: "Dieser verführerische Body mit offenem Rücken ist ein echtes Statement-Piece.",
    basePrice: 46.90,
    isActive: true,
    category: "dessous",
    tags: ["body", "open-back", "sexy", "dessous"],
    images: [
      { id: "des-004-img1", urlMain: "https://marife.ch/media/a4/0c/6c/1730145144/r80875-1-5.jpg", urlThumbnail: "https://marife.ch/media/a4/0c/6c/1730145144/r80875-1-5.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("DES-004", ["S", "M", "L"], [5, 10, 6]),
  },
  {
    id: "des-005",
    skuPrefix: "DES-005",
    name: "Luxury Lace Body",
    slug: "luxury-lace-body",
    descriptionShort: "Luxuriöser Body aus feiner Spitze. Das Highlight jeder Lingerie-Kollektion.",
    descriptionLong: "Dieser exklusive Spitzen-Body ist ein wahres Meisterwerk der Dessous-Kunst.",
    basePrice: 64.90,
    isActive: true,
    category: "dessous",
    tags: ["body", "luxury", "spitze", "dessous"],
    images: [
      { id: "des-005-img1", urlMain: "https://marife.ch/media/00/a5/76/1730145011/r80594-3.jpg", urlThumbnail: "https://marife.ch/media/00/a5/76/1730145011/r80594-3.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("DES-005", ["XS", "S", "M", "L"], [3, 6, 8, 4]),
  },
  {
    id: "des-006",
    skuPrefix: "DES-006",
    name: "Besticktes BH Set",
    slug: "besticktes-bh-set",
    descriptionShort: "Wunderschön besticktes BH-Set. Feminine Details auf höchstem Niveau.",
    descriptionLong: "Dieses aufwändig bestickte BH-Set vereint handwerkliche Perfektion mit femininer Eleganz.",
    basePrice: 38.40,
    isActive: true,
    category: "dessous",
    tags: ["bh", "set", "bestickt", "dessous"],
    images: [
      { id: "des-006-img1", urlMain: "https://marife.ch/media/59/52/c0/1730145065/r80854-3-4.jpg", urlThumbnail: "https://marife.ch/media/59/52/c0/1730145065/r80854-3-4.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("DES-006", ["70B", "75B", "80B", "75C", "80C"], [4, 6, 8, 5, 3]),
  },
  {
    id: "des-007",
    skuPrefix: "DES-007",
    name: "Body Netz Verführerisch",
    slug: "body-netz-verfuhrerisch",
    descriptionShort: "Sinnlicher Netz-Body mit strategischen Details. Weniger ist mehr.",
    descriptionLong: "Dieser verführerische Netz-Body mit seinen strategisch platzierten Details ist ein absolutes Statement.",
    basePrice: 48.10,
    isActive: true,
    category: "dessous",
    tags: ["body", "netz", "sexy", "dessous"],
    images: [
      { id: "des-007-img1", urlMain: "https://marife.ch/media/67/44/e9/1732438775/R81336-2-1.jpg", urlThumbnail: "https://marife.ch/media/67/44/e9/1732438775/R81336-2-1.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("DES-007", ["XS", "S", "M", "L"], [4, 7, 9, 5]),
  },

  // ── KORSETTS & CORSAGEN ──────────────────────────────────────────────────────
  {
    id: "kors-001",
    skuPrefix: "KORS-001",
    name: "Burlesque Satin Corsage",
    slug: "burlesque-satin-corsage",
    descriptionShort: "Atemberaubendes Burlesque-Korsett aus edlem Satin. Drama und Eleganz in einem.",
    descriptionLong: "Dieses außergewöhnliche Satin-Korsett im Burlesque-Stil ist ein echter Hingucker. Mit aufwändigen Details und perfektem Sitz.",
    basePrice: 59.90,
    isActive: true,
    category: "korsetts",
    tags: ["korsett", "burlesque", "satin"],
    images: [
      { id: "kors-001-img1", urlMain: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", urlThumbnail: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("KORS-001", ["XS", "S", "M", "L", "XL"], [3, 5, 8, 6, 2]),
  },
  {
    id: "kors-002",
    skuPrefix: "KORS-002",
    name: "Gothic Victorian Jacquard Korsett",
    slug: "gothic-victorian-jacquard-korsett",
    descriptionShort: "Dramatisches Gothic-Korsett mit Spitzenärmeln. Für Königinnen der Nacht.",
    descriptionLong: "Dieses beeindruckende Jacquard-Korsett im viktorianischen Stil mit opulenten Spitzenärmeln ist ein Statement-Piece der Extraklasse.",
    basePrice: 79.90,
    isActive: true,
    category: "korsetts",
    tags: ["korsett", "gothic", "victorian", "jacquard"],
    images: [
      { id: "kors-002-img1", urlMain: "https://marife.ch/media/ac/0e/43/1730145095/o_n20249_15_26_330.jpg", urlThumbnail: "https://marife.ch/media/ac/0e/43/1730145095/o_n20249_15_26_330.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("KORS-002", ["S", "M", "L", "XL"], [2, 4, 5, 2]),
  },
  {
    id: "kors-003",
    skuPrefix: "KORS-003",
    name: "Fashion Satin Corsage Rot",
    slug: "fashion-satin-corsage-rot",
    descriptionShort: "Leidenschaftliches rotes Satin-Korsett. Für mutige Frauen mit Stil.",
    descriptionLong: "Dieses feurige rote Satin-Korsett ist der Inbegriff von Leidenschaft und Stil.",
    basePrice: 64.20,
    salePrice: 49.90,
    isActive: true,
    category: "korsetts",
    tags: ["korsett", "rot", "satin"],
    images: [
      { id: "kors-003-img1", urlMain: "https://marife.ch/media/7c/a8/g0/1730145174/o_n11306_19_27_71.jpg", urlThumbnail: "https://marife.ch/media/7c/a8/g0/1730145174/o_n11306_19_27_71.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("KORS-003", ["XS", "S", "M", "L"], [4, 6, 5, 3]),
  },
  {
    id: "kors-004",
    skuPrefix: "KORS-004",
    name: "Steampunk Brokat Overbust Korsett",
    slug: "steampunk-brokat-overbust-korsett",
    descriptionShort: "Edles Steampunk-Korsett aus Brokat. Zeitlos elegant mit edlem Retro-Flair.",
    descriptionLong: "Dieses trägerloses Steampunk Brokat Overbust Korsett vereint viktorianische Eleganz mit modernem Edge.",
    basePrice: 49.90,
    isActive: true,
    category: "korsetts",
    tags: ["korsett", "steampunk", "brokat"],
    images: [
      { id: "kors-004-img1", urlMain: "https://marife.ch/media/4f/79/14/1730145161/o_brocade-steel-boned-steampunk-corset-n19572_50_13_139.jpg", urlThumbnail: "https://marife.ch/media/4f/79/14/1730145161/o_brocade-steel-boned-steampunk-corset-n19572_50_13_139.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("KORS-004", ["XS", "S", "M", "L", "XL", "XXL"], [3, 5, 7, 6, 4, 2]),
  },
  {
    id: "kors-005",
    skuPrefix: "KORS-005",
    name: "Korsett Jacquard Weinrot",
    slug: "korsett-jacquard-weinrot",
    descriptionShort: "Luxuriöses Jacquard-Korsett in tiefem Weinrot. Edle Verarbeitung, perfekter Sitz.",
    descriptionLong: "Dieses exquisite Jacquard-Korsett in Weinrot ist ein Meisterwerk handwerklicher Perfektion.",
    basePrice: 74.80,
    isActive: true,
    category: "korsetts",
    tags: ["korsett", "jacquard", "weinrot"],
    images: [
      { id: "kors-005-img1", urlMain: "https://marife.ch/media/e8/02/f2/1732637546/A3436-9.jpg", urlThumbnail: "https://marife.ch/media/e8/02/f2/1732637546/A3436-9.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("KORS-005", ["S", "M", "L", "XL"], [2, 4, 3, 1]),
  },
  {
    id: "kors-006",
    skuPrefix: "KORS-006",
    name: "Vintage Korsett Floral",
    slug: "vintage-korsett-floral",
    descriptionShort: "Romantisches Vintage-Korsett mit floralem Muster. Zeitlose Eleganz.",
    descriptionLong: "Dieses romantische Vintage-Korsett mit seinem wunderschönen floralen Muster ist ein Tribut an zeitlose Weiblichkeit.",
    basePrice: 99.90,
    isActive: true,
    category: "korsetts",
    tags: ["korsett", "vintage", "floral"],
    images: [
      { id: "kors-006-img1", urlMain: "https://marife.ch/media/32/5a/b1/1730145096/o_n14283_30_52_1_705.jpg", urlThumbnail: "https://marife.ch/media/32/5a/b1/1730145096/o_n14283_30_52_1_705.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("KORS-006", ["XS", "S", "M", "L", "XL"], [1, 2, 3, 2, 1]),
  },

  // ── AFRICANSTYLE ─────────────────────────────────────────────────────────────
  {
    id: "afr-001",
    skuPrefix: "AFR-001",
    name: "Halskette 18K Gold Afrikanischer Kontinent",
    slug: "halskette-18k-gold-afrikanischer-kontinent",
    descriptionShort: "Elegante Halskette mit Anhänger — afrikanischer Kontinent mit Ankh Kreuz. Nickelfreier Edelstahl, 45 cm.",
    descriptionLong: "Diese elegante Halskette vereint stilvolles Design mit symbolischer Bedeutung. Der Anhänger zeigt den afrikanischen Kontinent, kombiniert mit einem Ankh Kreuz.",
    basePrice: 18.90,
    isActive: true,
    category: "africanstyle",
    tags: ["halskette", "gold", "afrikanisch", "ankh"],
    images: [
      { id: "afr-001-img1", urlMain: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlThumbnail: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("AFR-001", ["One Size"], [15]),
  },
  {
    id: "afr-002",
    skuPrefix: "AFR-002",
    name: "African Wax Shopper Tasche",
    slug: "african-wax-shopper-tasche",
    descriptionShort: "Handgefertigte Tragtasche aus doppellagigem Wachsdruckstoff, 100% Baumwolle. Lange & kurze Henkel.",
    descriptionLong: "Diese vielseitige Tragtasche ist ideal als Strandtasche, Einkaufstasche oder Pickniktasche. Wiederverwendbar und nachhaltig.",
    basePrice: 18.20,
    salePrice: 12.50,
    isActive: true,
    category: "africanstyle",
    tags: ["tasche", "wax", "afrikanisch", "baumwolle"],
    images: [
      { id: "afr-002-img1", urlMain: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlThumbnail: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("AFR-002", ["One Size"], [20]),
  },
  {
    id: "afr-003",
    skuPrefix: "AFR-003",
    name: "Kente Ohrringe aus Holz",
    slug: "kente-ohrringe-holz",
    descriptionShort: "Afrikanisch inspirierte Kente-Ohrringe aus Holz, ca. 7 cm lang. Nickelfreie Metallhaken.",
    descriptionLong: "Diese afrikanisch inspirierten Kente-Ohrringe aus Holz vereinen traditionelle Muster mit modernem Stil.",
    basePrice: 9.90,
    isActive: true,
    category: "africanstyle",
    tags: ["ohrringe", "kente", "holz", "afrikanisch"],
    images: [
      { id: "afr-003-img1", urlMain: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlThumbnail: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("AFR-003", ["One Size"], [25]),
  },
  {
    id: "afr-004",
    skuPrefix: "AFR-004",
    name: "Afrikanisches Dekokissen",
    slug: "afrikanisches-dekokissen",
    descriptionShort: "Dekokissen 45x45 cm aus 100% hochwertiger Baumwolle mit beidseitigem afrikanischen Muster.",
    descriptionLong: "Bringe Kultur, Farbe und Persönlichkeit in dein Zuhause mit diesem afrikanischen Dekokissen.",
    basePrice: 12.80,
    isActive: true,
    category: "africanstyle",
    tags: ["kissen", "deko", "afrikanisch", "baumwolle"],
    images: [
      { id: "afr-004-img1", urlMain: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlThumbnail: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("AFR-004", ["45x45cm"], [18]),
  },

  // ── LIFESTYLE ─────────────────────────────────────────────────────────────────
  {
    id: "life-001",
    skuPrefix: "LIFE-001",
    name: "Gothic Halsband Viktorianisch",
    slug: "gothic-halsband-viktorianisch",
    descriptionShort: "Viktorianisches Gothic Halsband aus floraler Spitze mit schwarzen Edelsteinen. Hinten mit Schnürung verstellbar.",
    descriptionLong: "Dieses viktorianische Gothic Halsband ist ein elegantes Accessoire, das viktorianischen Charme mit moderner Gothic-Ästhetik vereint.",
    basePrice: 34.50,
    isActive: true,
    category: "lifestyle",
    tags: ["halsband", "gothic", "viktorianisch", "accessoire"],
    images: [
      { id: "life-001-img1", urlMain: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlThumbnail: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("LIFE-001", ["One Size"], [12]),
  },
  {
    id: "life-002",
    skuPrefix: "LIFE-002",
    name: "Bambus Badebürste Naturborsten",
    slug: "bambus-badebuerste-naturborsten",
    descriptionShort: "Hochwertige Badebürste aus nachhaltigem Bambus mit weichen Naturborsten. Griff 39 cm. Regt die Durchblutung an.",
    descriptionLong: "Diese hochwertige Badebürste aus nachhaltigem Bambus vereint Funktionalität und Umweltbewusstsein.",
    basePrice: 19.60,
    isActive: true,
    category: "lifestyle",
    tags: ["bürste", "bambus", "wellness", "pflege"],
    images: [
      { id: "life-002-img1", urlMain: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlThumbnail: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("LIFE-002", ["One Size"], [30]),
  },
  {
    id: "life-003",
    skuPrefix: "LIFE-003",
    name: "Konjac Reinigungsschwamm",
    slug: "konjac-reinigungsschwamm",
    descriptionShort: "Natürlicher Konjac Schwamm für sanfte Gesichts- und Körperreinigung. Vegan, biologisch abbaubar.",
    descriptionLong: "Der Konjac Schwamm ist ein traditionelles Hautpflegeprodukt aus Japan. 100% natürlich, vegan und biologisch abbaubar.",
    basePrice: 7.80,
    isActive: true,
    category: "lifestyle",
    tags: ["schwamm", "konjac", "pflege", "natur"],
    images: [
      { id: "life-003-img1", urlMain: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlThumbnail: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("LIFE-003", ["One Size"], [50]),
  },

  // ── GOTHIC / COSTUMES ─────────────────────────────────────────────────────────
  {
    id: "goth-001",
    skuPrefix: "GOTH-001",
    name: "Gothic Victorian Korsett Schwarz",
    slug: "gothic-victorian-korsett-schwarz",
    descriptionShort: "Dramatisches schwarzes Gothic-Korsett im viktorianischen Stil. Mit Stahlfischbeinstäbchen für perfekte Formgebung.",
    descriptionLong: "Klassisches viktorianisches Gothic-Korsett aus hochwertigem schwarzem Stoff mit Stahlfischbeinstäbchen.",
    basePrice: 89.90,
    isActive: true,
    category: "gothic-costumes",
    tags: ["gothic", "korsett", "viktorianisch", "schwarz"],
    images: [
      { id: "goth-001-img1", urlMain: "https://marife.ch/media/ac/0e/43/1730145095/o_n20249_15_26_330.jpg", urlThumbnail: "https://marife.ch/media/ac/0e/43/1730145095/o_n20249_15_26_330.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("GOTH-001", ["XS", "S", "M", "L", "XL"], [3, 5, 6, 4, 2]),
  },
  {
    id: "goth-002",
    skuPrefix: "GOTH-002",
    name: "Steampunk Brokat Corsage",
    slug: "steampunk-brokat-corsage",
    descriptionShort: "Authentisches Steampunk-Korsett aus Brokat mit Metallösen. Für Cosplay und besondere Events.",
    descriptionLong: "Edles Steampunk-Korsett aus Brokat. Zeitlos elegant mit viktorianischem Retro-Flair.",
    basePrice: 69.90,
    isActive: true,
    category: "gothic-costumes",
    tags: ["steampunk", "korsett", "brokat", "cosplay"],
    images: [
      { id: "goth-002-img1", urlMain: "https://marife.ch/media/4f/79/14/1730145161/o_brocade-steel-boned-steampunk-corset-n19572_50_13_139.jpg", urlThumbnail: "https://marife.ch/media/4f/79/14/1730145161/o_brocade-steel-boned-steampunk-corset-n19572_50_13_139.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("GOTH-002", ["XS", "S", "M", "L", "XL"], [2, 4, 5, 3, 2]),
  },
  {
    id: "goth-003",
    skuPrefix: "GOTH-003",
    name: "Burlesque Kostüm Set",
    slug: "burlesque-kostuem-set",
    descriptionShort: "Komplettes Burlesque-Kostüm-Set. Korsett, Minirock und Accessoires für den großen Auftritt.",
    descriptionLong: "Atemberaubendes Burlesque-Kostüm-Set aus edlem Satin. Drama und Eleganz in einem kompletten Outfit.",
    basePrice: 79.90,
    salePrice: 59.90,
    isActive: true,
    category: "gothic-costumes",
    tags: ["burlesque", "kostüm", "set", "satin"],
    images: [
      { id: "goth-003-img1", urlMain: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", urlThumbnail: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("GOTH-003", ["XS", "S", "M", "L"], [3, 5, 4, 2]),
  },

  // ── SALE / OUTLET ─────────────────────────────────────────────────────────────
  {
    id: "sale-001",
    skuPrefix: "SALE-001",
    name: "Babydoll Transparent Chic",
    slug: "babydoll-transparent-chic",
    descriptionShort: "Transparentes Babydoll mit zarten Details. Modern und verführerisch. Jetzt im Sale!",
    descriptionLong: "Dieses transparente Babydoll kombiniert moderne Ästhetik mit verführerischen Details.",
    basePrice: 38.60,
    salePrice: 19.90,
    isActive: true,
    category: "sale",
    tags: ["babydoll", "transparent", "sale"],
    images: [
      { id: "sale-001-img1", urlMain: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlThumbnail: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("SALE-001", ["S/M", "L/XL"], [6, 9]),
  },
  {
    id: "sale-002",
    skuPrefix: "SALE-002",
    name: "Black Vinyl Gloves Sale",
    slug: "black-vinyl-gloves-sale",
    descriptionShort: "Verführerische schwarze Vinyl-Handschuhe. Das perfekte Accessoire — jetzt reduziert!",
    descriptionLong: "Diese eleganten schwarzen Vinyl-Handschuhe sind das ultimative Accessoire für mutige Styles.",
    basePrice: 34.90,
    salePrice: 22.90,
    isActive: true,
    category: "sale",
    tags: ["handschuhe", "vinyl", "schwarz", "sale"],
    images: [
      { id: "sale-002-img1", urlMain: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlThumbnail: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("SALE-002", ["S/M", "L/XL"], [8, 6]),
  },
  {
    id: "sale-003",
    skuPrefix: "SALE-003",
    name: "Fashion Corsage Rot Sale",
    slug: "fashion-corsage-rot-sale",
    descriptionShort: "Leidenschaftliches rotes Satin-Korsett. Stark reduziert im Outlet.",
    descriptionLong: "Dieses feurige rote Satin-Korsett ist der Inbegriff von Leidenschaft und Stil — jetzt zum Schnäppchenpreis.",
    basePrice: 64.20,
    salePrice: 34.90,
    isActive: true,
    category: "sale",
    tags: ["korsett", "rot", "satin", "sale"],
    images: [
      { id: "sale-003-img1", urlMain: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", urlThumbnail: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("SALE-003", ["XS", "S", "M", "L"], [3, 4, 3, 2]),
  },

  // ── AUSLAUFMODELLE (DISCONTINUED) ────────────────────────────────────────────
  {
    id: "ausl-001",
    skuPrefix: "AUSL-001",
    name: "Vintage Korsett Floral Auslauf",
    slug: "vintage-korsett-floral-auslauf",
    descriptionShort: "Romantisches Vintage-Korsett mit floralem Muster — letzte Stücke verfügbar.",
    descriptionLong: "Dieses romantische Vintage-Korsett mit seinem wunderschönen floralen Muster ist in limitierter Stückzahl verfügbar.",
    basePrice: 99.90,
    salePrice: 59.90,
    isActive: true,
    category: "auslaufmodelle",
    tags: ["korsett", "vintage", "floral", "auslauf"],
    images: [
      { id: "ausl-001-img1", urlMain: "https://marife.ch/media/32/5a/b1/1730145096/o_n14283_30_52_1_705.jpg", urlThumbnail: "https://marife.ch/media/32/5a/b1/1730145096/o_n14283_30_52_1_705.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("AUSL-001", ["XS", "S", "M", "L", "XL"], [1, 2, 1, 1, 0]),
  },
  {
    id: "ausl-002",
    skuPrefix: "AUSL-002",
    name: "Thermo Workout Leggings Sport",
    slug: "thermo-workout-leggings-sport",
    descriptionShort: "Trendy Thermo Workout Leggings — letzte verfügbare Exemplare. Material 85% Polyamid, 15% Elasthan.",
    descriptionLong: "Trendy Thermo Workout Leggings in Schwarz, Freesize. Letzte Stücke, solange Vorrat reicht.",
    basePrice: 39.90,
    salePrice: 24.90,
    isActive: true,
    category: "auslaufmodelle",
    tags: ["leggings", "sport", "workout", "auslauf"],
    images: [
      { id: "ausl-002-img1", urlMain: "https://marife.ch/media/c1/8e/4e/1735208421/0000T9410_19064.jpg", urlThumbnail: "https://marife.ch/media/c1/8e/4e/1735208421/0000T9410_19064.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("AUSL-002", ["One Size"], [3]),
  },

  // ── ISABELLE (FEATURED COLLECTION) ───────────────────────────────────────────
  {
    id: "isa-001",
    skuPrefix: "ISA-001",
    name: "Isabelle Signature Body Spitze",
    slug: "isabelle-signature-body-spitze",
    descriptionShort: "Exklusiver Spitzen-Body aus der Isabelle-Kollektion. Kuratiert von Sonja Isabelle — Curvy Model & Coach.",
    descriptionLong: "Dieser exklusive Spitzen-Body ist Teil der Isabelle-Signature-Kollektion. Kuratiert von Sonja Isabelle, Curvy Model und Coach mit Schwerpunkt Selbstbewusstsein und weiblicher Identität.",
    basePrice: 64.90,
    isActive: true,
    category: "isabelle",
    tags: ["isabelle", "body", "spitze", "luxury", "signature"],
    images: [
      { id: "isa-001-img1", urlMain: "https://marife.ch/media/00/a5/76/1730145011/r80594-3.jpg", urlThumbnail: "https://marife.ch/media/00/a5/76/1730145011/r80594-3.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("ISA-001", ["XS", "S", "M", "L"], [3, 6, 8, 4]),
  },
  {
    id: "isa-002",
    skuPrefix: "ISA-002",
    name: "Isabelle Korsett Premium Weinrot",
    slug: "isabelle-korsett-premium-weinrot",
    descriptionShort: "Luxuriöses Jacquard-Korsett in tiefem Weinrot. Teil der Isabelle-Kollektion.",
    descriptionLong: "Dieses exquisite Jacquard-Korsett in Weinrot ist Teil der kuratierten Isabelle-Kollektion.",
    basePrice: 84.80,
    isActive: true,
    category: "isabelle",
    tags: ["isabelle", "korsett", "jacquard", "luxury"],
    images: [
      { id: "isa-002-img1", urlMain: "https://marife.ch/media/e8/02/f2/1732637546/A3436-9.jpg", urlThumbnail: "https://marife.ch/media/e8/02/f2/1732637546/A3436-9.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("ISA-002", ["S", "M", "L", "XL"], [2, 4, 3, 2]),
  },
  {
    id: "isa-003",
    skuPrefix: "ISA-003",
    name: "Isabelle Luxury Babydoll",
    slug: "isabelle-luxury-babydoll",
    descriptionShort: "Handverlesenes Luxury-Babydoll aus der Isabelle-Kollektion. Für Frauen, die Echtheit leben.",
    descriptionLong: "Handverlesenes Luxury Babydoll — Teil der Isabelle-Signature-Linie. Kuratiert nach dem Motto: Sexy kennt keine Regeln, nur dich.",
    basePrice: 59.90,
    isActive: true,
    category: "isabelle",
    tags: ["isabelle", "babydoll", "luxury", "signature"],
    images: [
      { id: "isa-003-img1", urlMain: "https://marife.ch/media/ed/5c/52/1730145226/r81171-1.jpg", urlThumbnail: "https://marife.ch/media/ed/5c/52/1730145226/r81171-1.jpg", urlZoom: null, sortOrder: 0 },
    ],
    variants: makeVariants("ISA-003", ["XS", "S", "M", "L"], [4, 5, 6, 3]),
  },
];

export const MOCK_CATEGORIES = [
  { id: 1, name: "Fashion", slug: "fashion", imageUrl: "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg", count: 48 },
  { id: 2, name: "Dessous", slug: "dessous", imageUrl: "https://marife.ch/media/f9/86/9a/1730145264/h3506-7.jpg", count: 89 },
  { id: 3, name: "Korsetts & Corsagen", slug: "korsetts", imageUrl: "https://marife.ch/media/f6/55/15/1730145130/13990-014-xxx-00.jpg", count: 56 },
  { id: 4, name: "Africanstyle", slug: "africanstyle", imageUrl: "https://marife.ch/media/7c/a5/9f/1730145190/o_hg1912_44_56_682.jpg", count: 32 },
  { id: 5, name: "Lifestyle", slug: "lifestyle", imageUrl: "https://marife.ch/media/b0/c1/1d/1730145243/h3551-9.jpg", count: 24 },
  { id: 6, name: "Gothic / Costumes", slug: "gothic-costumes", imageUrl: "https://marife.ch/media/ac/0e/43/1730145095/o_n20249_15_26_330.jpg", count: 35 },
  { id: 7, name: "Sale / Outlet", slug: "sale", imageUrl: "https://marife.ch/media/ed/5c/52/1730145226/r81171-1.jpg", count: 40 },
  { id: 8, name: "Auslaufmodelle", slug: "auslaufmodelle", imageUrl: "https://marife.ch/media/32/5a/b1/1730145096/o_n14283_30_52_1_705.jpg", count: 18 },
  { id: 9, name: "Isabelle", slug: "isabelle", imageUrl: "https://marife.ch/media/00/a5/76/1730145011/r80594-3.jpg", count: 12 },
];
