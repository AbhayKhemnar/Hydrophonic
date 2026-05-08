import { useEffect, useMemo, useState } from "react";
import { fetchBidsByProduct, fetchProducts, placeBid } from "../../api/marketApi";

function AuctionCard({ product, bids, onBid, loadingProductId }) {
  const [bidAmount, setBidAmount] = useState("");
  const highestBid = bids[0];
  const hasEnded = product.auctionEndAt && new Date(product.auctionEndAt).getTime() <= Date.now();
  const winner = bids.find((bid) => bid.status === "accepted");

  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Auction</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {product.farmer?.name} • {product.quantity} kg • Ends{" "}
            {product.auctionEndAt ? new Date(product.auctionEndAt).toLocaleString() : "--"}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
          {hasEnded ? "Closed" : "Open"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs uppercase text-slate-400">Base price</p>
          <p className="mt-1 font-semibold text-slate-900">Rs. {product.price}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs uppercase text-slate-400">Minimum bid</p>
          <p className="mt-1 font-semibold text-slate-900">Rs. {product.minBidAmount || "--"}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs uppercase text-slate-400">Highest bid</p>
          <p className="mt-1 font-semibold text-slate-900">
            {highestBid ? `Rs. ${highestBid.amount}` : "No bids yet"}
          </p>
        </div>
      </div>

      {winner ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Winning trader: {winner.trader?.name} with Rs. {winner.amount}
        </div>
      ) : null}

      {!hasEnded ? (
        <div className="mt-4 flex gap-3">
          <input
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5"
            type="number"
            min={product.minBidAmount || 1}
            placeholder="Enter your bid amount"
            value={bidAmount}
            onChange={(event) => setBidAmount(event.target.value)}
          />
          <button
            type="button"
            disabled={loadingProductId === product._id}
            onClick={async () => {
              await onBid(product._id, bidAmount);
              setBidAmount("");
            }}
            className="rounded-2xl bg-emerald-700 px-4 py-2.5 font-semibold text-white"
          >
            {loadingProductId === product._id ? "Bidding..." : "Place Bid"}
          </button>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-900">Bid History</p>
        <div className="mt-3 space-y-2">
          {bids.length === 0 ? (
            <p className="text-sm text-slate-500">No bids placed yet.</p>
          ) : (
            bids.map((bid) => (
              <div key={bid._id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{bid.trader?.name}</span>
                <span className="font-semibold text-slate-900">Rs. {bid.amount}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TraderMarket() {
  const [products, setProducts] = useState([]);
  const [bidsByProduct, setBidsByProduct] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingProductId, setLoadingProductId] = useState("");

  const loadMarket = async () => {
    const response = await fetchProducts();
    const marketProducts = response.data;
    setProducts(marketProducts);

    const auctionProducts = marketProducts.filter((product) => product.saleType === "auction");
    const bidResults = await Promise.all(
      auctionProducts.map(async (product) => {
        const bidResponse = await fetchBidsByProduct(product._id);
        return [product._id, bidResponse.data];
      })
    );

    setBidsByProduct(Object.fromEntries(bidResults));
  };

  useEffect(() => {
    loadMarket().catch((loadError) => console.error(loadError));
  }, []);

  const auctionProducts = useMemo(
    () => products.filter((product) => product.saleType === "auction"),
    [products]
  );

  const directProducts = useMemo(
    () => products.filter((product) => product.saleType === "fixed"),
    [products]
  );

  const handleBid = async (productId, amount) => {
    setMessage("");
    setError("");
    setLoadingProductId(productId);

    try {
      await placeBid({ product: productId, amount: Number(amount) });
      setMessage("Bid placed successfully.");
      await loadMarket();
    } catch (bidError) {
      setError(bidError.response?.data?.message || "Unable to place bid");
    } finally {
      setLoadingProductId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Trader Market</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Bid on live auctions</h2>
        <p className="mt-2 text-sm text-slate-600">
          Multiple traders can bid during the auction window. When the time ends, the highest valid bid
          becomes the winner automatically.
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
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-950">Ongoing Auctions</h3>
        {auctionProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No auction products are live right now.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {auctionProducts.map((product) => (
              <AuctionCard
                key={product._id}
                product={product}
                bids={bidsByProduct[product._id] || []}
                onBid={handleBid}
                loadingProductId={loadingProductId}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <h3 className="text-xl font-bold text-slate-950">Direct Bulk Buying</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {directProducts.map((product) => (
            <div key={product._id} className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="mt-1 text-sm text-slate-500">{product.farmer?.name}</p>
              <p className="mt-3 text-sm text-slate-600">
                {product.quantity} kg available at Rs. {product.price} per kg
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TraderMarket;
