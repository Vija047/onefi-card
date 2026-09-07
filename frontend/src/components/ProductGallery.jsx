export default function ProductGallery({ imageUrl, name, variantLabel }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="aspect-square w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
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
      {variantLabel ? (
        <p className="text-sm text-slate-500">{variantLabel}</p>
      ) : null}
    </div>
  )
}
