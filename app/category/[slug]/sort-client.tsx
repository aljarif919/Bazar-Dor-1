 "use client";
import { useMemo,useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/lib/data";
export default function CategoryClient({products}:{products:Product[]}) {
 const [sort,setSort]=useState("default");
 const sorted=useMemo(()=>{const a=[...products];if(sort==="asc")a.sort((x,y)=>x.price-y.price);if(sort==="desc")a.sort((x,y)=>y.price-x.price);return a},[products,sort]);
 return <><div className="controls"><strong>মোট {products.length.toLocaleString("bn-BD")}টি পণ্য</strong><label className="sort-wrap">সাজান <select aria-label="পণ্য সাজান" value={sort} onChange={e=>setSort(e.target.value)}><option value="default">ডিফল্ট</option><option value="asc">দাম: কম থেকে বেশি</option><option value="desc">দাম: বেশি থেকে কম</option></select></label></div><ProductGrid products={sorted}/></>;
}