"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function ProtectedContent({children,redirectPath="/"}:{children:React.ReactNode;redirectPath?:string}) {
  const router=useRouter();
  const {data:session,isPending}=authClient.useSession();
  useEffect(()=>{if(!isPending&&!session){toast.error("এই পৃষ্ঠাটি দেখতে আগে সাইন ইন করুন");router.replace(`/signin?redirect=${encodeURIComponent(redirectPath)}`)}},[isPending,session,router]);
  if(isPending||!session) return <section className="section"><div className="container"><div className="skeleton" style={{height:320,maxWidth:850,margin:"auto"}}/></div></section>;
  return <>{children}</>;
}
