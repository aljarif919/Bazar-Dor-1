 "use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function ProtectedProfile(){
 const router=useRouter();const {data:session,isPending}=authClient.useSession() as unknown as {data:{user:{name?:string|null;email:string}}|null;isPending:boolean};
 useEffect(()=>{if(!isPending&&!session){toast.error("প্রোফাইল দেখতে আগে সাইন ইন করুন");router.replace("/signin?redirect=/profile")}},[isPending,session,router]);
 if(isPending||!session)return <section className="section"><div className="container"><div className="skeleton" style={{height:220,maxWidth:700,margin:"auto"}}/></div></section>;
 const user=session.user;
 return <section className="section section-soft"><div className="container"><div className="profile-card"><div style={{display:"flex",gap:17,alignItems:"center"}}><div className="avatar">{(user.name||user.email||"U").charAt(0).toUpperCase()}</div><div><h1 style={{margin:"0 0 3px"}}>আমার প্রোফাইল</h1><p style={{margin:0,color:"var(--muted)"}}>আপনার অ্যাকাউন্টের তথ্য</p></div></div><div style={{marginTop:25}}><div className="field"><label>নাম</label><div>{user.name||"নাম যোগ করা হয়নি"}</div></div><div className="field"><label>ইমেইল</label><div>{user.email}</div></div><Link className="btn btn-primary" href="/profile/update">তথ্য আপডেট করুন</Link></div></div></div></section>;
}