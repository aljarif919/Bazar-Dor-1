"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Product, formatTaka } from "@/lib/data";
export default function ProductCard({product}:{product:Product}) {
  const change = product.change || 0;
  const hasChange = product.changeKnown === true;
  const status = change > 0.05 ? "up" : change < -0.05 ? "down" : "flat";
  return <Link href={`/product/${encodeURIComponent(product.slug)}`} className="product-card">
    <div className="product-top"><span className={`product-emoji ${product.image ? "has-image" : ""}`}>{product.image ? <><span className="product-emoji-fallback">{product.emoji}</span><img src={product.image} alt={product.name} loading="lazy" onError={(event)=>{event.currentTarget.style.display="none";}} /></> : product.emoji}</span><span className={`change ${hasChange ? status : "flat"}`}>{hasChange ? <>{status==="up"?<ArrowUpRight size={13} style={{display:"inline"}}/>:status==="down"?<ArrowDownRight size={13} style={{display:"inline"}}/>:<Minus size={13} style={{display:"inline"}} />} {change>0?"+":change<0?"−":""}{Math.abs(change).toLocaleString("bn-BD",{maximumFractionDigits:1})}%</> : "পরিবর্তন তথ্য নেই"}</span></div>
    <h3>{product.name}</h3><div className="unit">{product.unit} · {product.category}</div>
    <div className="price-label">আজকের দাম</div><div className="price-row"><strong className="price">{formatTaka(product.price)}</strong></div>
    <div className="market-label">বিস্তারিত দেখতে ক্লিক করুন ↗</div>
  </Link>;
}