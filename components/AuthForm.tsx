 "use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { ShoppingBasket } from "lucide-react";

export default function AuthForm({mode}:{mode:"signin"|"signup"}) {
 const router=useRouter(); const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);
 const signup=mode==="signup";
 function getRedirect(){if(typeof window==="undefined")return "/";const value=new URLSearchParams(window.location.search).get("redirect")||"/";return value.startsWith("/")&&!value.startsWith("//")?value:"/";}
 async function submit(e:React.FormEvent){e.preventDefault();if(busy)return;if(!email.trim()||!password){toast.error("ইমেইল ও পাসওয়ার্ড দিন");return}if(signup && password.length<8){toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");return}if(signup&&!name.trim()){toast.error("আপনার নাম লিখুন");return}
 setBusy(true);try{const cleanEmail=email.trim().toLowerCase();const result=signup?await authClient.signUp.email({name:name.trim(),email:cleanEmail,password}):await authClient.signIn.email({email:cleanEmail,password});if(result.error){
 const message = result.error.message || "";
 console.error("BazarDor authentication error:", result.error);
 toast.error(message || "অনুরোধ সম্পন্ন হয়নি। DATABASE_URL ও auth migration যাচাই করুন।");
 return;
}toast.success(signup?"অ্যাকাউন্ট তৈরি হয়েছে":"সফলভাবে সাইন ইন হয়েছে");const redirect=getRedirect();if(signup)router.push(redirect==="/"?"/signin":`/signin?redirect=${encodeURIComponent(redirect)}`);else router.push(redirect);router.refresh() }catch(error){console.error("BazarDor authentication request failed:", error);toast.error("সার্ভার/Database সংযোগ ব্যর্থ। DATABASE_URL, Database migration এবং BETTER_AUTH_URL যাচাই করুন।")}finally{setBusy(false)}}
 async function social(provider:"google"|"github"){try{await authClient.signIn.social({provider,callbackURL:getRedirect()})}catch{toast.error("সোশ্যাল লগইন ব্যর্থ। OAuth সেটিংস যাচাই করুন।")}}
 return <div className="auth-page"><div className="auth-card"><Link href="/" className="brand"><span className="brandmark"><ShoppingBasket/></span><span>বাজার দর<small>প্রয়োজনীয় পণ্যের দাম এক নজরে</small></span></Link><h1>{signup?"নতুন অ্যাকাউন্ট তৈরি করুন":"আবার স্বাগতম!"}</h1><p>{signup?"বাজারদরের আপডেট পেতে নিবন্ধন করুন।":"আপনার অ্যাকাউন্টে সাইন ইন করুন।"}</p>
 <form onSubmit={submit}>{signup&&<div className="field"><label htmlFor="name">আপনার নাম</label><input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="সম্পূর্ণ নাম" autoComplete="name" required/></div>}<div className="field"><label htmlFor="email">ইমেইল</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div><div className="field"><label htmlFor="password">পাসওয়ার্ড</label><input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={signup?"কমপক্ষে ৮ অক্ষর":"আপনার পাসওয়ার্ড"} autoComplete={signup?"new-password":"current-password"} required minLength={signup?8:undefined}/></div><button className="btn btn-primary" disabled={busy}>{busy?"অপেক্ষা করুন…":signup?"অ্যাকাউন্ট তৈরি করুন":"সাইন ইন"}</button></form>
 {!signup&&<p className="auth-hint">প্রথমবার হলে আগে সাইন আপ করুন। এখানে আপনার Google/Gmail অ্যাকাউন্টের পাসওয়ার্ড নয়—এই সাইটে তৈরি করা পাসওয়ার্ড ব্যবহার করুন।</p>}<div className="auth-divider">অথবা সোশ্যাল অ্যাকাউন্ট দিয়ে</div><div className="social-row"><button className="btn btn-outline" onClick={()=>social("google")}>Google দিয়ে চালিয়ে যান</button><button className="btn btn-outline" onClick={()=>social("github")}>GitHub দিয়ে চালিয়ে যান</button></div>
 <div className="auth-switch">{signup?"আগে থেকেই অ্যাকাউন্ট আছে? ":"অ্যাকাউন্ট নেই? "}<Link href={signup?(typeof window!=="undefined"&&new URLSearchParams(window.location.search).get("redirect")?`/signin?redirect=${encodeURIComponent(new URLSearchParams(window.location.search).get("redirect") as string)}`:"/signin"):"/signup"}>{signup?"সাইন ইন":"সাইন আপ"}</Link></div>
 <div className="notice">Google/GitHub লগইন চালু করতে .env.local ফাইলে OAuth Client ID ও Secret যোগ করুন।</div></div></div>;
}