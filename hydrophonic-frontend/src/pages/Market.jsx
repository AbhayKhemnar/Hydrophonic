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
    <div className="min-h-screen bg-slate-100 px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-950">Marketplace</h1>
        {isLoading ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            Loading marketplace products...
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">No products listed yet</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              The marketplace is live, but no farmer products have been added yet. Once a farmer lists
              crops, they will appear here for direct per-kg sales and auctions.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
