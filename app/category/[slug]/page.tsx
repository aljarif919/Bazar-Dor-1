import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { fetchCategories, fetchCategory, fetchProducts, Product } from "@/lib/data";
import CategoryClient from "./sort-client";

export const dynamic = "force-dynamic";

type CategoryPageMeta = { title: string; icon: string; slugs: string[] };
const groupedCategories: Record<string, CategoryPageMeta> = {
  "chal-dal": { title: "চাল-ডাল", icon: "🍚", slugs: ["chal", "dal"] },
  "mach-mangsho": { title: "মাছ-মাংস", icon: "🐟", slugs: ["mach", "mangsho"] },
  "tel-mosla": { title: "তেল-মসলা", icon: "🌶️", slugs: ["tel", "mosla"] },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const group = groupedCategories[slug];
  const apiCategory = group ? undefined : categories.find((category) => category.slug === slug);
  if (!group && !apiCategory) notFound();

  const slugs = group ? group.slugs : [slug];
  // Read the category endpoint for its API metadata, then use the filtered products endpoint
  // for the actual card list. Group pages combine the relevant API categories only.
  const categoryDetails = await Promise.all(slugs.map((categorySlug) => fetchCategory(categorySlug)));
  const resultLists = await Promise.all(slugs.map((categorySlug) => fetchProducts(categorySlug)));
  const byId = new Map<string, Product>();
  for (const list of resultLists) for (const product of list) byId.set(String(product.id), product);
  const products = [...byId.values()];
  const title = group?.title ?? categoryDetails[0]?.name ?? apiCategory?.name ?? slug;
  const icon = group?.icon ?? categoryDetails[0]?.icon ?? apiCategory?.icon ?? "🛒";

  return <>
    <section className="page-head"><div className="container"><div className="breadcrumbs"><Link href="/">হোম</Link> / ক্যাটাগরি</div><h1>{icon} {title}</h1><p>{title} বিভাগের পণ্যের বর্তমান দাম দেখুন।</p></div></section>
    <section className="section"><div className="container">
      {products.length ? <CategoryClient products={products}/> : <div className="empty"><span>{icon}</span><h3>এই ক্যাটাগরিতে পণ্যের তথ্য পাওয়া যায়নি</h3><p>API-তে এই ক্যাটাগরির পণ্য না থাকলে অথবা API সাময়িকভাবে ব্যস্ত থাকলে এই বার্তাটি দেখানো হবে।</p><Link className="btn btn-primary" href="/">হোম পেজে ফিরে যান</Link></div>}
    </div></section>
  </>;
}
