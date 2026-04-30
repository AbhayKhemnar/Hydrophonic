function ProductCard({ product, showContact = false, hideSaleType = false }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {product.farmer?.name || "Farmer"} • {product.farmer?.location?.district || "Local farm"}
          </p>
        </div>
        {!hideSaleType ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
            {product.saleType}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <p>
          Quantity: {product.quantity} {product.unit || "kg"}
        </p>
        <p>Price: Rs. {product.price}</p>
      </div>

      {showContact ? (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
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
