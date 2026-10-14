import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/data";
export function ProductSkeletons(){return <div className="product-grid">{Array.from({length:8}).map((_,i)=><div className="skeleton-card" key={i}><div className="skeleton" style={{width:55,height:55}}/><div className="skeleton" style={{width:"70%",height:20,marginTop:18}}/><div className="skeleton" style={{width:"50%",height:13,marginTop:10}}/><div className="skeleton" style={{width:"60%",height:25,marginTop:18}}/></div>)}</div>}
export default function ProductGrid({products}:{products:Product[]}) {
  if(!products.length) return <div className="empty"><span>🧺</span><h3>এখনো পণ্যের তথ্য পাওয়া যায়নি</h3><p>API সাময়িকভাবে ব্যস্ত থাকতে পারে। একটু পরে আবার চেষ্টা করুন।</p><Link className="btn btn-primary" href="/">হোম পেজে ফিরে যান</Link></div>;
  return <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>;
}