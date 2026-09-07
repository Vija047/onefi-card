import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

export default function ProductCard({ product }) {
  const variantLabel =
    product.variantCount > 0
      ? `${product.variantCount} variant${product.variantCount > 1 ? 's' : ''} available`
      : 'No variants listed'

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {product.imageUrl || product.images?.hero ? (
          <img
            src={product.imageUrl || product.images.hero}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 text-left">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{variantLabel}</p>
        </div>

        <div className="mt-auto space-y-1">
          <p className="text-xl font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </p>
          {product.mrp && product.mrp > product.price ? (
            <p className="text-sm text-slate-400 line-through">
              MRP {formatCurrency(product.mrp)}
            </p>
          ) : null}
          {product.startingEmi != null ? (
            <p className="text-sm text-teal-700">
              EMI from {formatCurrency(product.startingEmi)}/mo
            </p>
          ) : null}
        </div>

        <span className="inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:bg-teal-700">
          View Product
        </span>
      </div>
    </Link>
  )
}
