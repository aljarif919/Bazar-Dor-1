import { ArrowRight, TrendingUp } from "lucide-react";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await fetchProducts();
  const productsWithChange = products.filter((product) => product.changeKnown);
  const rising = productsWithChange
    .filter((product) => (product.change ?? 0) > 0)
    .sort((a, b) => (b.change ?? 0) - (a.change ?? 0))
    .slice(0, 6);
  const falling = productsWithChange
    .filter((product) => (product.change ?? 0) < 0)
    .sort((a, b) => (a.change ?? 0) - (b.change ?? 0))
    .slice(0, 6);
  const changeInfoUnavailable = products.length > 0 && productsWithChange.length === 0;

  return <>
    <section className="hero"><div className="container hero-grid"><div>
      <span className="eyebrow"><TrendingUp size={16}/> প্রতিদিনের বাজারদর, এক জায়গায়</span>
      <h1>বাজারের দাম জানুন, <span>সাশ্রয় করুন</span></h1>
      <p>নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন। কেনাকাটার আগে বিভিন্ন পণ্যের দাম ও পরিবর্তন জেনে নিন।</p>
      <div className="hero-actions"><a href="#সব-পণ্য" className="btn btn-primary">আজকের দাম দেখুন <ArrowRight size={17}/></a></div>
    </div><div className="hero-art" aria-label="বাজারের পণ্যের ছবি"><div className="hero-image-wrap"><Image src="/images/market-basket.png" alt="বাজারের পণ্যের ঝুড়ি" width={315} height={263} priority /></div></div></div></section>

    <section className="section section-soft"><div className="container">
      <div className="section-head"><div><div className="section-kicker">দামের ঊর্ধ্বমুখী পরিবর্তন</div><h2>আজ দাম বেড়েছে ▲</h2><p>যেসব পণ্যের দাম আগের তুলনায় বেড়েছে</p></div></div>
      {changeInfoUnavailable && <p className="notice">API থেকে পণ্যের বর্তমান দাম পাওয়া গেছে, কিন্তু আগের দিনের দামের তুলনা পাওয়া যায়নি। তাই ভুল শতাংশ দেখানো হচ্ছে না।</p>}
      {!products.length && <p className="notice">এখন API থেকে পণ্যের তথ্য পাওয়া যাচ্ছে না। ইন্টারনেট সংযোগ বা API সার্ভার পরীক্ষা করে আবার চেষ্টা করুন।</p>}
      {rising.length ? <ProductGrid products={rising}/> : <div className="trend-empty">{changeInfoUnavailable ? "দাম বাড়ার নির্ভরযোগ্য তথ্য API-তে নেই।" : "এ মুহূর্তে দাম বেড়েছে এমন পণ্যের তথ্য পাওয়া যায়নি।"}</div>}
    </div></section>

    <section className="section"><div className="container">
      <div className="section-head"><div><div className="section-kicker">দামের নিম্নমুখী পরিবর্তন</div><h2>আজ দাম কমেছে ▼</h2><p>যেসব পণ্যের দাম আগের তুলনায় কমেছে</p></div></div>
      {changeInfoUnavailable && <p className="notice">API থেকে পণ্যের বর্তমান দাম পাওয়া গেছে, কিন্তু আগের দিনের দামের তুলনা পাওয়া যায়নি। তাই ভুল শতাংশ দেখানো হচ্ছে না।</p>}
      {!products.length && <p className="notice">এখন API থেকে পণ্যের তথ্য পাওয়া যাচ্ছে না। ইন্টারনেট সংযোগ বা API সার্ভার পরীক্ষা করে আবার চেষ্টা করুন।</p>}
      {falling.length ? <ProductGrid products={falling}/> : <div className="trend-empty">{changeInfoUnavailable ? "দাম কমার নির্ভরযোগ্য তথ্য API-তে নেই।" : "এ মুহূর্তে দাম কমেছে এমন পণ্যের তথ্য পাওয়া যায়নি।"}</div>}
    </div></section>

    <section className="section section-soft" id="সব-পণ্য"><div className="container">
      <div className="section-head"><div><div className="section-kicker">প্রয়োজনীয় পণ্যের তালিকা</div><h2>সব পণ্য</h2><p>পণ্যে ক্লিক করে বিস্তারিত বাজারদর দেখুন</p></div></div>
      {!products.length && <div className="empty"><span>🧺</span><h3>পণ্যের তথ্য পাওয়া যায়নি</h3><p>API সাময়িকভাবে ব্যস্ত থাকতে পারে। পরে আবার চেষ্টা করুন।</p></div>}
      {products.length > 0 && <ProductGrid products={products}/>}
    </div></section>
  </>;
}
