import { useEffect, useMemo, useState } from 'react'

export default function ProductGallery({
  images,
  selectedImageUrl,
  name,
  variantLabel,
}) {
  const gallery = useMemo(() => {
    const urls = []

    if (images?.hero) urls.push(images.hero)
    if (Array.isArray(images?.gallery)) urls.push(...images.gallery)
    if (selectedImageUrl) urls.push(selectedImageUrl)

    return [...new Set(urls.filter(Boolean))]
  }, [images, selectedImageUrl])

  const [activeImage, setActiveImage] = useState(
    selectedImageUrl || gallery[0] || null,
  )

  useEffect(() => {
    setActiveImage(selectedImageUrl || gallery[0] || null)
  }, [selectedImageUrl, gallery])

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="aspect-square w-full">
          {activeImage ? (
            <img
              src={activeImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No product image
            </div>
          )}
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {gallery.map((url) => {
            const isActive = url === activeImage
            return (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(url)}
                className={[
                  'overflow-hidden rounded-xl border bg-white transition',
                  isActive
                    ? 'border-teal-600 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-teal-300',
                ].join(' ')}
                aria-label="Show product image"
                aria-pressed={isActive}
              >
                <img
                  src={url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      ) : null}

      {variantLabel ? (
        <p className="text-sm text-slate-500">{variantLabel}</p>
      ) : null}
    </div>
  )
}
