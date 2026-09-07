import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import ProductCard from '../components/ProductCard'

export default function Marketplace({ showIntro = true }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts()
      setProducts(data.products || [])
    } catch (err) {
      setProducts([])
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <section aria-labelledby="marketplace-heading">
      {showIntro ? (
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            1Fi Marketplace
          </p>
          <h1
            id="marketplace-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
          >
            Shop with flexible EMI plans
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Browse products, choose a variant, and pick an EMI plan that works for you.
          </p>
        </div>
      ) : (
        <h2
          id="marketplace-heading"
          className="mb-6 text-2xl font-semibold tracking-tight text-slate-900"
        >
          1Fi Marketplace
        </h2>
      )}

      {loading ? <Loading label="Loading products..." /> : null}

      {!loading && error ? (
        <ErrorState
          title="Could not load marketplace"
          message={error}
          onRetry={loadProducts}
        />
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <ErrorState
          title="No products yet"
          message="The marketplace is empty. Seed the backend database and try again."
          onRetry={loadProducts}
        />
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
