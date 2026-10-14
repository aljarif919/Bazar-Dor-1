 "use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingBasket, UserRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Product, fallbackCategories, Category } from "@/lib/data";
import toast from "react-hot-toast";

const categoryGroups = [
  { name: "সব পণ্য", href: "/#সব-পণ্য", slugs: [] as string[] },
  { name: "চাল-ডাল", href: "/category/chal-dal", slugs: ["chal", "dal"] },
  { name: "সবজি", href: "/category/sobji", slugs: ["sobji"] },
  { name: "মাছ-মাংস", href: "/category/mach-mangsho", slugs: ["mach", "mangsho"] },
  { name: "তেল-মসলা", href: "/category/tel-mosla", slugs: ["tel", "mosla"] },
];
export default function SiteShell({children}:{children:React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen,setMenuOpen] = useState(false);
  const [banglaDate,setBanglaDate] = useState("");
  const [tickerProducts,setTickerProducts] = useState<Product[]>([]);
  const [navCategories,setNavCategories] = useState<Category[]>(fallbackCategories);
  const {data:session,isPending} = authClient.useSession() as unknown as { data: { user: { id: string; name?: string | null; email: string } } | null; isPending: boolean };
  useEffect(()=>setMenuOpen(false),[pathname]);
  useEffect(()=>{setBanglaDate(new Date().toLocaleDateString("bn-BD",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));},[]);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);
        if (productResponse.ok) {
          const json = await productResponse.json();
          const list = Array.isArray(json?.products) ? json.products : [];
          if (alive) setTickerProducts(list);
        }
        if (categoryResponse.ok) {
          const json = await categoryResponse.json();
          const list = Array.isArray(json?.categories) ? json.categories : [];
          if (alive && list.length) setNavCategories(list);
        }
      } catch {}
    })();
    return ()=>{alive=false};
  },[]);
  async function logout(){
    try { await authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/"); router.refresh(); } } }); toast.success("সফলভাবে লগআউট হয়েছে"); }
    catch { toast.error("লগআউট করা যায়নি, আবার চেষ্টা করুন"); }
  }
  return <>
    <div className="topline"/>
    <header className="navwrap"><div className="container nav-container">
      <div className="navbar">
        <Link href="/" className="brand"><span className="brandmark"><ShoppingBasket size={25}/></span><span>বাজার দর<small>{banglaDate || "আজকের বাজারদর"}</small></span></Link>
        <div className="authlinks">
          {!isPending && session?.user ? <>
            <Link className="btn btn-soft" href="/profile"><UserRound size={16}/><span className="hidden sm:inline">প্রোফাইল</span></Link>
            <button className="btn btn-outline" onClick={logout}><LogOut size={16}/><span className="hidden sm:inline">লগআউট</span></button>
          </>:<><Link className="btn btn-outline" href="/signin">সাইন ইন</Link><Link className="btn btn-primary" href="/signup">সাইন আপ</Link></>}
        </div>
        <button className="mobile-toggle" aria-label="মেনু খুলুন" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><Menu size={22}/></button>
      </div>
      <nav className={`navlinks ${menuOpen?"menu-open":""}`}>
        {categoryGroups.filter((group) => group.slugs.length === 0 || group.slugs.some((slug) => navCategories.some((category) => category.slug === slug))).map((c,i)=><Link key={c.href} className={(i===0?pathname==="/":pathname===c.href)?"active":""} href={c.href}>{c.name}</Link>)}
      </nav>
    </div></header>
    <div className="ticker" aria-label="চলমান পণ্যের দামের তালিকা"><div className="ticker-label">📈 আজকের বাজার</div><div className="ticker-track">{tickerProducts.length ? [0,1].map(n=><span key={n} style={{display:"contents"}}>{tickerProducts.map((p,i)=><span className="ticker-item" key={`${n}-${p.id}-${i}`}>{p.emoji} {p.name} <b className={(p.change||0)>0?"ticker-up":(p.change||0)<0?"ticker-down":""}>{p.changeKnown ? `${(p.change||0)>0?"▲ ":(p.change||0)<0?"▼ ":"— "}${Math.abs(p.change||0).toLocaleString("bn-BD",{maximumFractionDigits:1})}%` : "দাম পরিবর্তনের তথ্য নেই"} · {p.price.toLocaleString("bn-BD")} টাকা / {p.unit}</b></span>)}</span>) : <span className="ticker-item">বাজারদরের তথ্য লোড হচ্ছে…</span>}</div></div>
    <main>{children}</main>
    <footer className="footer"><div className="container">
      <div className="footer-main"><Link href="/" className="brand"><span className="brandmark"><ShoppingBasket size={25}/></span><span>বাজার দর<small>প্রয়োজনীয় পণ্যের দাম এক নজরে।</small></span></Link></div>
      <div className="footer-bottom"><span>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</span><span>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</span></div>
    </div></footer>
  </>;
}