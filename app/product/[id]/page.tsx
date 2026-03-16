// Server component — required for static export to handle dynamic [id] route.
import ProductDetailPage from "./ProductDetailPage";
import { supabase } from "@/lib/supabase";

export async function generateStaticParams() {
  const { data: products, error } = await supabase.from("products").select("id");
  
  if (error || !products || products.length === 0) {
    // Next.js static export crashes if generateStaticParams returns an empty array.
    // We return a dummy path to satisfy the build requirement.
    return [{ id: "placeholder" }];
  }

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProductDetailPage params={resolvedParams} />;
}
