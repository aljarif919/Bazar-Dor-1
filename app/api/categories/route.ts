import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await fetchCategories();
  return NextResponse.json({ categories }, { headers: { "Cache-Control": "no-store" } });
}
