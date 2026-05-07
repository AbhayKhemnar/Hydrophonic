function ProductCard({ product, showContact = false, hideSaleType = false }) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {product.farmer?.name || "Farmer"} • {product.farmer?.location?.district || "Local farm"}
          </p>
        </div>
        {!hideSaleType ? (
          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
            {product.saleType}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quantity</p>
          <p className="mt-2 font-semibold text-slate-900">
            {product.quantity} {product.unit || "kg"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Price</p>
          <p className="mt-2 font-semibold text-slate-900">Rs. {product.price}</p>
        </div>
      </div>

      {showContact ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Farmer contact: {product.farmer?.contact?.phone || "Not available"}
        </div>
      ) : null}

      {product.description ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
      ) : null}
    </article>
  );
}

export default ProductCard;
