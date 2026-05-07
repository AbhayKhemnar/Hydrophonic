import { useEffect, useState } from "react";
import { fetchProducts } from "../api/marketApi";
import ProductCard from "../components/market/ProductCard";

function Market() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((response) => setProducts(response.data))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Marketplace</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            Buy direct from hydroponic farms and track live listings.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
            Browse fixed-price produce and auction-ready crops from farmers already on the platform.
          </p>
        </section>

        {isLoading ? (
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 text-slate-600 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
            Loading marketplace products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
            <h2 className="text-xl font-bold text-slate-950">No products listed yet</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              The marketplace is live, but no farmer products have been added yet. Once a farmer lists
              crops, they will appear here for direct per-kg sales and auctions.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Market;
