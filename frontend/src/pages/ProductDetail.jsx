import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductBySlug } from '../api/products'
import ConfirmationModal from '../components/ConfirmationModal'
import EmiPlanList from '../components/EmiPlanList'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import ProductGallery from '../components/ProductGallery'
import VariantSelector from '../components/VariantSelector'
import { formatCurrency } from '../utils/format'

export default function ProductDetail() {
  const { slug } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const loadProduct = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSelectedEmiPlan(null)
    setShowConfirmation(false)

    try {
      const data = await getProductBySlug(slug)
      const nextProduct = data.product
      setProduct(nextProduct)

      const firstVariant = nextProduct.variants?.[0]
      setSelectedColor(firstVariant?.color || '')
      setSelectedStorage(firstVariant?.storage || '')
    } catch (err) {
      setProduct(null)
      setError({
        status: err.status,
        message: err.message || 'Failed to load product',
      })
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  const colors = useMemo(() => {
    if (product?.details?.colors?.length) return product.details.colors
    if (!product?.variants) return []
    return [...new Set(product.variants.map((variant) => variant.color))]
  }, [product])

  const storages = useMemo(() => {
    if (product?.details?.storages?.length) return product.details.storages
    if (!product?.variants) return []
    return [...new Set(product.variants.map((variant) => variant.storage))]
  }, [product])

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null

    const exactMatch = product.variants.find(
      (variant) =>
        variant.color === selectedColor && variant.storage === selectedStorage,
    )
    if (exactMatch) return exactMatch

    const colorMatch = product.variants.find(
      (variant) => variant.color === selectedColor,
    )
    if (colorMatch) return colorMatch

    const storageMatch = product.variants.find(
      (variant) => variant.storage === selectedStorage,
    )
    if (storageMatch) return storageMatch

    return product.variants[0]
  }, [product, selectedColor, selectedStorage])

  const handleColorChange = (color) => {
    setSelectedColor(color)

    const matching = product?.variants?.find(
      (variant) =>
        variant.color === color && variant.storage === selectedStorage,
    )
    if (matching) return

    const firstForColor = product?.variants?.find(
      (variant) => variant.color === color,
    )
    if (firstForColor) {
      setSelectedStorage(firstForColor.storage)
    }
  }

  const handleStorageChange = (storage) => {
    setSelectedStorage(storage)

    const matching = product?.variants?.find(
      (variant) =>
        variant.storage === storage && variant.color === selectedColor,
    )
    if (matching) return

    const firstForStorage = product?.variants?.find(
      (variant) => variant.storage === storage,
    )
    if (firstForStorage) {
      setSelectedColor(firstForStorage.color)
    }
  }

  const selectedPrice = selectedVariant?.price ?? product?.price ?? 0
  const selectedMrp = selectedVariant?.mrp ?? product?.mrp ?? 0
  // EMI plans come from the database as-is — no client-side mock recalculation.
  const selectedEmiPlans = product?.emiPlans || []

  const variantLabel = selectedVariant
    ? `${selectedVariant.color} · ${selectedVariant.storage}`
    : null

  if (loading) {
    return <Loading label="Loading product..." />
  }

  if (error) {
    const isNotFound = error.status === 404
    return (
      <div className="space-y-4">
        <Link
          to="/marketplace"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to Marketplace
        </Link>
        <ErrorState
          title={isNotFound ? 'Product not found' : 'Could not load product'}
          message={
            isNotFound
              ? `No product matches “${slug}”. Check the URL or return to the marketplace.`
              : error.message
          }
          onRetry={isNotFound ? undefined : loadProduct}
        />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:text-teal-700">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/marketplace" className="hover:text-teal-700">
              Marketplace
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-800">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          selectedImageUrl={selectedVariant?.imageUrl}
          name={product.name}
          variantLabel={variantLabel}
        />

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {product.name}
            </h1>
            {variantLabel ? (
              <p className="mt-2 text-base text-slate-600">{variantLabel}</p>
            ) : null}
            {product.description ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {product.description}
              </p>
            ) : null}
            {product.details ? (
              <p className="mt-2 text-sm text-slate-500">
                {product.details.variantCount} variants ·{' '}
                {product.details.emiPlanCount} EMI plans
                {product.details.startingEmi != null
                  ? ` · EMI from ${formatCurrency(product.details.startingEmi)}/mo`
                  : ''}
              </p>
            ) : null}
          </div>

          <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-5">
            {selectedMrp && selectedMrp > selectedPrice ? (
              <p className="text-sm text-slate-400 line-through">
                MRP {formatCurrency(selectedMrp)}
              </p>
            ) : null}
            <p className="text-3xl font-semibold text-slate-900">
              {formatCurrency(selectedPrice)}
            </p>
            <p className="text-sm text-slate-500">Selling price</p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Available variants
            </h2>
            {product.variants?.length ? (
              <VariantSelector
                colors={colors}
                storages={storages}
                selectedColor={selectedColor}
                selectedStorage={selectedStorage}
                onColorChange={handleColorChange}
                onStorageChange={handleStorageChange}
              />
            ) : (
              <p className="text-sm text-slate-500">No variants available.</p>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              EMI plans
            </h2>
            <EmiPlanList
              plans={selectedEmiPlans}
              selectedPlanId={selectedEmiPlan?.id}
              onSelect={setSelectedEmiPlan}
            />
          </div>

          <button
            type="button"
            disabled={!selectedEmiPlan}
            onClick={() => setShowConfirmation(true)}
            className="w-full rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Proceed with Selected Plan
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={showConfirmation}
        productName={product.name}
        variantLabel={variantLabel}
        emiPlan={selectedEmiPlan}
        onClose={() => setShowConfirmation(false)}
      />
    </div>
  )
}
