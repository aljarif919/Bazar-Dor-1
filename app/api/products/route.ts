import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const products = await fetchProducts(category);
  return NextResponse.json(
    { products, source: "bazardor-api", hasChangeData: products.some((product) => product.changeKnown) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
