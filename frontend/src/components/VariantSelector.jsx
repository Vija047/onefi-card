function OptionGroup({ label, options, selected, onSelect, name }) {
  if (!options.length) return null

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-900">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option
          return (
            <label
              key={option}
              className={[
                'cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition',
                isSelected
                  ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300',
              ].join(' ')}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option}
                checked={isSelected}
                onChange={() => onSelect(option)}
              />
              {option}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function VariantSelector({
  colors,
  storages,
  selectedColor,
  selectedStorage,
  onColorChange,
  onStorageChange,
}) {
  return (
    <div className="space-y-5">
      <OptionGroup
        label="Color"
        name="color"
        options={colors}
        selected={selectedColor}
        onSelect={onColorChange}
      />
      <OptionGroup
        label="Storage"
        name="storage"
        options={storages}
        selected={selectedStorage}
        onSelect={onStorageChange}
      />
    </div>
  )
}
