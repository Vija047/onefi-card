import { formatCurrency, formatInterestRate } from '../utils/format'

export default function ConfirmationModal({
  open,
  productName,
  variantLabel,
  emiPlan,
  onClose,
}) {
  if (!open || !emiPlan) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirmation-title"
          className="text-xl font-semibold text-slate-900"
        >
          Plan confirmation
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Review your selection before continuing. No payment will be processed.
        </p>

        <dl className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Product</dt>
            <dd className="text-right font-medium text-slate-900">
              {productName}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Variant</dt>
            <dd className="text-right font-medium text-slate-900">
              {variantLabel || '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Tenure</dt>
            <dd className="text-right font-medium text-slate-900">
              {emiPlan.tenureMonths} months
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Monthly payment</dt>
            <dd className="text-right font-medium text-slate-900">
              {formatCurrency(emiPlan.monthlyPayment)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Interest rate</dt>
            <dd className="text-right font-medium text-slate-900">
              {formatInterestRate(emiPlan.interestRate)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Close
        </button>
      </div>
    </div>
  )
}
