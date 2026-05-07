import { useEffect, useMemo, useState } from "react";
import { createProduct, fetchBidsByProduct, fetchProducts } from "../../api/marketApi";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/market/ProductCard";

const initialForm = {
  name: "",
  description: "",
  quantity: "",
  price: "",
  saleType: "fixed",
  minBidAmount: "",
  auctionEndAt: ""
};

function FarmerMarket() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [myProducts, setMyProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [auctionBids, setAuctionBids] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = async () => {
    try {
      const [mine, market] = await Promise.all([
        fetchProducts({ farmer: user._id }),
        fetchProducts()
      ]);

      setMyProducts(mine.data);
      setAllProducts(market.data);

      const myAuctionProducts = mine.data.filter((product) => product.saleType === "auction");
      const bidResults = await Promise.all(
        myAuctionProducts.map(async (product) => {
          const response = await fetchBidsByProduct(product._id);
          return [product._id, response.data];
        })
      );

      setAuctionBids(Object.fromEntries(bidResults));
    } catch (loadError) {
      console.error(loadError);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const marketPreview = useMemo(
    () => allProducts.filter((product) => product.farmer?._id !== user._id),
    [allProducts, user._id]
  );
  const myAuctionProducts = useMemo(
    () => myProducts.filter((product) => product.saleType === "auction"),
    [myProducts]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        quantity: Number(form.quantity),
        price: Number(form.price),
        saleType: form.saleType
      };

      if (form.saleType === "auction") {
        payload.minBidAmount = Number(form.minBidAmount || 0);
        payload.auctionEndAt = form.auctionEndAt;
      }

      await createProduct(payload);
      setMessage("Product listed successfully.");
      setForm(initialForm);
      await loadProducts();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Farmer Market
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Sell your produce</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add crop listings for direct per-kg sales or auction bidding. Because you are already logged
            in as a farmer, this page gives you direct selling access.
          </p>

          {message ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <textarea
              className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              placeholder="Short description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-lg border border-slate-300 px-3 py-2.5"
                placeholder="Quantity in kg"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2.5"
                placeholder="Price per kg"
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              value={form.saleType}
              onChange={(e) => handleChange("saleType", e.target.value)}
            >
              <option value="fixed">Direct sale per kg</option>
              <option value="auction">Auction sale</option>
            </select>

            {form.saleType === "auction" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="rounded-lg border border-slate-300 px-3 py-2.5"
                  placeholder="Minimum bid amount"
                  type="number"
                  min="1"
                  value={form.minBidAmount}
                  onChange={(e) => handleChange("minBidAmount", e.target.value)}
                />
                <input
                  className="rounded-lg border border-slate-300 px-3 py-2.5"
                  type="datetime-local"
                  value={form.auctionEndAt}
                  onChange={(e) => handleChange("auctionEndAt", e.target.value)}
                  required
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white"
            >
              {isSubmitting ? "Listing..." : "List Product"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">My Listings</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Manage current products</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {myProducts.length} active
            </span>
          </div>

          {myProducts.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              You have not listed any products yet. Use the form on the left to sell directly per kg or
              open an auction for traders.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {myProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Market Feed</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Other active listings</h2>

        {marketPreview.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            No other farmer listings are available yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {marketPreview.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Auction Monitor</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Your ongoing auctions</h2>

        {myAuctionProducts.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            You do not have any auction listings yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {myAuctionProducts.map((product) => {
              const bids = auctionBids[product._id] || [];
              const highestBid = bids[0];
              const winner = bids.find((bid) => bid.status === "accepted");
              const hasEnded = product.auctionEndAt && new Date(product.auctionEndAt).getTime() <= Date.now();

              return (
                <div key={product._id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Ends {product.auctionEndAt ? new Date(product.auctionEndAt).toLocaleString() : "--"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                      {hasEnded ? "Closed" : "Ongoing"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs uppercase text-slate-400">Min bid</p>
                      <p className="mt-1 font-semibold text-slate-900">Rs. {product.minBidAmount || "--"}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs uppercase text-slate-400">Highest bid</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {highestBid ? `Rs. ${highestBid.amount}` : "No bids yet"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs uppercase text-slate-400">Total bids</p>
                      <p className="mt-1 font-semibold text-slate-900">{bids.length}</p>
                    </div>
                  </div>

                  {winner ? (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Winner: {winner.trader?.name} with Rs. {winner.amount}
                    </div>
                  ) : null}

                  <div className="mt-4 space-y-2">
                    {bids.map((bid) => (
                      <div key={bid._id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{bid.trader?.name}</span>
                        <span className="font-semibold text-slate-900">Rs. {bid.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default FarmerMarket;
