export const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  unit: string;
  price: number;
  previousPrice?: number;
  change?: number;
  /** False when the API does not supply a comparable previous price/change. */
  changeKnown?: boolean;
  emoji: string;
  image?: string;
  description?: string;
  market?: string;
  marketPrices?: { market: string; division?: string; price?: number; min?: number; max?: number }[];
  priceStats?: { min?: number; max?: number; average?: number };
};

export type Category = { id: string; slug: string; name: string; icon: string };

export const fallbackCategories: Category[] = [
  { id: "chal", slug: "chal", name: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", name: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", name: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", name: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", name: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", name: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", name: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", name: "মসলা", icon: "🌶️" },
];

const emojiByName: Record<string, string> = {
  "স্বর্ণমাছি চাল": "🍚", "মিনিকেট চাল": "🍚", "চাল": "🍚", chal: "🍚", rice: "🍚",
  "পেঁয়াজ": "🧅", "পেঁয়াজ": "🧅", onion: "🧅", "আলু": "🥔", potato: "🥔", "ঢেঁড়স": "🥒", okra: "🥒", "বেগুন": "🍆", eggplant: "🍆", "টমেটো": "🍅", tomato: "🍅",
  "মসুর ডাল": "🫘", "ডাল": "🫘", dal: "🫘", lentil: "🫘", chickpea: "🫘",
  "ইলিশ মাছ": "🐟", "মাছ": "🐟", fish: "🐟", rui: "🐟", katla: "🐟",
  "গরুর মাংস": "🥩", beef: "🥩", "মাংস": "🍖", meat: "🍖", chicken: "🍗", "মুরগি": "🍗",
  "ডিম": "🥚", egg: "🥚", "দুধ": "🥛", milk: "🥛", "কলা": "🍌", banana: "🍌", "আপেল": "🍎", apple: "🍎", orange: "🍊", "কমলা": "🍊",
  "তেল": "🫗", oil: "🫗", soybean: "🫗", "সয়াবিন": "🫗", "সয়াবিন": "🫗", "রসুন": "🧄", garlic: "🧄", "আদা": "🫚", ginger: "🫚",
  "মরিচ": "🌶️", chili: "🌶️", "হলুদ": "🟡", turmeric: "🟡", "জিরা": "🌰", cumin: "🌰", "লবণ": "🧂", salt: "🧂", "চিনি": "🍚", sugar: "🍚",
  "সবজি": "🥬", vegetable: "🥬", sobji: "🥬", "ফল": "🍎", fruit: "🍎", default: "🛒"
};
function numeric(value: any, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") return numeric(pick(value, ["amount", "value", "price", "current", "percent", "percentage", "change", "rate", "min", "max", "average", "avg"], fallback), fallback);
  const normalized = String(value ?? "").replace(/[০-৯]/g, d => String("০১২৩৪৫৬৭৮৯".indexOf(d))).replace(/,/g, "");
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : fallback;
}

export function toBengaliDigits(value: string | number) {
  return String(value).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[Number(d)]);
}
export function fromBengaliDigits(value: string | number) {
  return Number(String(value).replace(/[০-৯]/g, d => String("০১২৩৪৫৬৭৮৯".indexOf(d))).replace(/[^\d.-]/g, "")) || 0;
}
export function formatTaka(value: number) {
  return `${toBengaliDigits(Math.round(value).toLocaleString("en-US"))} টাকা`;
}
function pick(obj: any, keys: string[], fallback: any = "") {
  for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  return fallback;
}
function categorySlug(v: any) {
  return String(v || "other").toLowerCase().replace(/[^a-z0-9\u0980-\u09FF-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
export function normalizeProduct(raw: any, index = 0): Product {
  const name = String(pick(raw, ["nameBn", "name_bn", "productNameBn", "product_name_bn", "name", "title", "productName", "product_name", "bnName", "bn_name"], "পণ্যের নাম"));
  const categoryRaw = pick(raw, ["category", "categorySlug", "category_slug", "categoryId", "category_id", "type"], "other");
  const categorySlug = String(typeof categoryRaw === "object" ? pick(categoryRaw, ["slug", "id", "name"], "other") : categoryRaw);
  const category = String(pick(raw, ["categoryNameBn", "category_name_bn", "categoryName", "category_name"], ({ chal: "চাল", dal: "ডাল", tel: "তেল", sobji: "সবজি", mach: "মাছ", mangsho: "মাংস", "dim-dui": "ডিম-দুধ", mosla: "মসলা" } as Record<string, string>)[categorySlug] || categorySlug));

  // This API uses `today` and a nested `{ dir, pct }` change object.
  const price = numeric(pick(raw, ["today", "price", "currentPrice", "current_price", "todayPrice", "today_price", "priceToday", "price_today", "amount", "current", "marketPrice", "market_price"], 0), 0);
  const previousRaw = pick(raw, ["yesterday", "previousPrice", "previous_price", "oldPrice", "old_price", "lastPrice", "last_price", "yesterdayPrice", "yesterday_price", "previousDayPrice", "previous_day_price"], undefined);
  const previousPrice = previousRaw === undefined ? undefined : numeric(previousRaw, 0);
  const changeObject = pick(raw, ["change"], undefined);
  const nestedPct = changeObject && typeof changeObject === "object" ? pick(changeObject, ["pct", "percent", "percentage"], undefined) : undefined;
  const explicitChange = pick(raw, ["changePercent", "change_percent", "changePercentage", "change_percentage", "changePct", "change_pct", "dailyChangePercent", "daily_change_percent"], nestedPct);
  let change = explicitChange === undefined || explicitChange === null || explicitChange === ""
    ? (previousPrice && previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : 0)
    : numeric(explicitChange, 0);
  const direction = String(changeObject && typeof changeObject === "object" ? pick(changeObject, ["dir", "direction"], "") : "").toLowerCase();
  if (direction === "down") change = -Math.abs(change);
  else if (direction === "up") change = Math.abs(change);
  else if (direction === "flat") change = 0;
  const changeKnown = nestedPct !== undefined || (explicitChange !== undefined && explicitChange !== null && explicitChange !== "") || (previousRaw !== undefined && previousRaw !== null && previousRaw !== "");

  const slug = String(pick(raw, ["slug", "productSlug", "product_slug"], `${categorySlug}-${pick(raw, ["id", "_id"], index + 1)}`));
  const rawImage = pick(raw, ["image", "imageUrl", "image_url", "thumbnail", "thumbnailUrl", "thumbnail_url", "photo", "picture", "img", "imageLink", "image_link", "imageURL", "productImage", "product_image", "imageSrc", "image_src", "images"], "");
  const imageText = typeof rawImage === "string" ? rawImage : String(pick(rawImage, ["url", "src", "secure_url"], ""));
  const isEmoji = /^\p{Extended_Pictographic}+$/u.test(imageText.trim());
  const image = isEmoji || !/^https?:\/\//i.test(imageText) ? undefined : imageText;
  const emoji = String(pick(raw, ["categoryIcon", "emoji", "icon"], isEmoji ? imageText : "")) || Object.entries(emojiByName).find(([k]) => `${category} ${name}`.toLowerCase().includes(k))?.[1] || emojiByName.default;

  const marketRowsRaw = pick(raw, ["markets", "marketPrices", "market_prices", "pricesByMarket", "prices_by_market", "districtPrices", "district_prices", "marketData", "market_data", "prices"], []);
  const marketRows: any[] = Array.isArray(marketRowsRaw) ? marketRowsRaw : [];
  const marketPrices = marketRows.map((row: any) => ({
    market: String(pick(row, ["market", "bazaar", "name", "marketName", "market_name", "location"], "")),
    division: String(pick(row, ["division", "district", "region"], "")) || undefined,
    min: numeric(pick(row, ["min", "minimum", "minPrice", "min_price"], 0), 0) || undefined,
    max: numeric(pick(row, ["max", "maximum", "maxPrice", "max_price"], 0), 0) || undefined,
    price: numeric(pick(row, ["today", "price", "currentPrice", "current_price", "amount", "value"], 0), 0) || undefined,
  })).filter((row: any) => row.market && (row.price || row.min || row.max));
  const marketMins = marketPrices.map(row => row.min).filter((v): v is number => typeof v === "number" && v > 0);
  const marketMaxs = marketPrices.map(row => row.max).filter((v): v is number => typeof v === "number" && v > 0);
  const midpoints = marketPrices.map(row => row.min && row.max ? (row.min + row.max) / 2 : row.price).filter((v): v is number => typeof v === "number" && v > 0);
  const explicitStats = pick(raw, ["priceStats", "price_stats", "stats", "statistics"], {});
  const statMin = numeric(pick(raw, ["minPrice", "min_price", "min"], pick(explicitStats, ["min", "minimum", "minPrice"], 0)), 0);
  const statMax = numeric(pick(raw, ["maxPrice", "max_price", "max"], pick(explicitStats, ["max", "maximum", "maxPrice"], 0)), 0);
  const statAverage = numeric(pick(raw, ["averagePrice", "average_price", "avgPrice", "avg_price", "average", "avg"], pick(explicitStats, ["average", "avg", "mean"], 0)), 0);
  const min = statMin || (marketMins.length ? Math.min(...marketMins) : undefined);
  const max = statMax || (marketMaxs.length ? Math.max(...marketMaxs) : undefined);
  const average = statAverage || (midpoints.length ? midpoints.reduce((sum, v) => sum + v, 0) / midpoints.length : undefined);

  return {
    id: pick(raw, ["id", "_id"], index + 1), slug, name, category, categorySlug,
    unit: String(pick(raw, ["unit", "unitBn", "unit_bn", "unitName", "unit_name", "measurement"], "একক উল্লেখ নেই")),
    price, previousPrice, change, changeKnown, emoji, image,
    description: String(pick(raw, ["description", "details", "summary", "shortDescription", "short_description"], "")),
    marketPrices, priceStats: { min, max, average },
  };
}
function unwrapList(json: any): any[] | null {
  if (Array.isArray(json)) return json;
  if (!json || typeof json !== "object") return null;

  // The API normally returns a list, but some responses/tools expose one
  // product object directly. Treat that object as a one-item list.
  if (json.slug && (json.nameBn || json.name || json.today !== undefined || json.price !== undefined)) {
    return [json];
  }

  for (const key of ["data", "products", "categories", "result", "items", "results"]) {
    const value = json[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapList(value);
      if (nested) return nested;
    }
  }
  return null;
}
export function normalizeCategory(raw: any, index = 0): Category {
  const slug = String(pick(raw, ["slug", "id", "categorySlug", "category_slug"], `category-${index + 1}`));
  const name = String(pick(raw, ["nameBn", "name_bn", "name", "title", "categoryName", "category_name"], slug));
  return { id: String(pick(raw, ["id", "_id"], slug)), slug, name, icon: String(pick(raw, ["icon", "emoji", "symbol"], "🛒")) };
}

export async function fetchCategories(): Promise<Category[]> {
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}/categories`, { cache: "no-store", signal: AbortSignal.timeout(7000) });
      if (!res.ok) continue;
      const json = await res.json();
      const list = unwrapList(json) ?? (Array.isArray(json?.categories) ? json.categories : null);
      if (list) return list.map(normalizeCategory).filter((c) => c.slug && c.name);
    } catch {}
  }
  return fallbackCategories;
}

export async function fetchCategory(slug: string): Promise<Category | undefined> {
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}/categories/${encodeURIComponent(slug)}`, { cache: "no-store", signal: AbortSignal.timeout(7000) });
      if (!res.ok) continue;
      const json = await res.json();
      const raw = json?.data?.category ?? json?.category ?? json?.data ?? json?.result ?? json;
      if (!raw || typeof raw !== "object") continue;
      const category = normalizeCategory(raw);
      if (category.slug && category.name && category.name !== category.slug) return category;
      // Some APIs return the category name with its slug as the only identifier.
      if (category.slug) return category;
    } catch {}
  }
  return fallbackCategories.find((c) => c.slug === slug);
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  let lastError: unknown;
  for (const base of API_BASES) {
    try {
      const url = new URL(`${base}/products`);
      if (category) url.searchParams.set("category", category);
      const res = await fetch(url.toString(), { cache: "no-store", signal: AbortSignal.timeout(9000) });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      const list = unwrapList(json) ?? (json && typeof json === "object" && (json.slug || json.nameBn || json.today !== undefined) ? [json] : null);
      if (!list) throw new Error("Unexpected API response");
      // Never render broken API rows as ০ টাকা or substitute made-up market prices.
      return list.map(normalizeProduct).filter((product) => product.price > 0 && product.name !== "পণ্যের নাম");
    } catch (err) { lastError = err; }
  }
  console.warn("BazarDor API unavailable:", lastError);
  return [];
}
export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const products = await fetchProducts();
  const listed = products.find(p => p.slug === slug || String(p.id) === slug);
  const directCandidates = [...new Set([slug, listed ? String(listed.id) : ""].filter(Boolean))];
  for (const base of API_BASES) {
    for (const candidate of directCandidates) {
      try {
        const res = await fetch(`${base}/products/${encodeURIComponent(candidate)}`, { cache: "no-store", signal: AbortSignal.timeout(7000) });
        if (!res.ok) continue;
        const json = await res.json();
        const raw = json?.data?.product ?? json?.product ?? json?.data?.item ?? json?.item ?? json?.data ?? json?.result ?? json;
        const detail = normalizeProduct(raw);
        if (detail && detail.name && detail.name !== "পণ্যের নাম" && detail.price > 0) {
          return listed ? { ...listed, ...detail, marketPrices: detail.marketPrices?.length ? detail.marketPrices : listed.marketPrices, priceStats: { min: detail.priceStats?.min ?? listed.priceStats?.min, max: detail.priceStats?.max ?? listed.priceStats?.max, average: detail.priceStats?.average ?? listed.priceStats?.average } } : detail;
        }
      } catch {}
    }
  }
  return listed;
}

