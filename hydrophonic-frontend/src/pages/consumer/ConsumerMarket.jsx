import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/marketApi";
import ProductCard from "../../components/market/ProductCard";

function ConsumerMarket() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ saleType: "fixed" })
      .then((response) => setProducts(response.data))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Local Consumer Market
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Buy direct fixed-price products</h2>
        <p className="mt-2 text-sm text-slate-600">
          Auction listings are hidden for local consumers. Only direct per-kg products are shown here.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-white/70 bg-white/90 p-8 text-slate-600 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
          Loading available products...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
          <h3 className="text-xl font-bold text-slate-950">No fixed-price products available</h3>
          <p className="mt-3 text-slate-600">
            When farmers list direct-sale crops, they will appear here with contact details.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} showContact hideSaleType />
          ))}
        </div>
      )}
    </div>
  );
}

export default ConsumerMarket;
