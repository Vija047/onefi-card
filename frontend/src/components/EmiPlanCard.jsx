import { formatCurrency, formatInterestRate } from '../utils/format'

export default function EmiPlanCard({ plan, selected, onSelect }) {
  const hasCashback = plan.cashback != null && Number(plan.cashback) > 0

  return (
    <label
      className={[
        'flex cursor-pointer gap-3 rounded-2xl border p-4 transition',
        selected
          ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-600/20'
          : 'border-slate-200 bg-white hover:border-teal-300',
      ].join(' ')}
    >
      <input
        type="radio"
        name="emi-plan"
        className="mt-1 h-4 w-4 accent-teal-600"
        checked={selected}
        onChange={onSelect}
      />
      <div className="min-w-0 flex-1 text-left">
        <p className="font-semibold text-slate-900">
          {formatCurrency(plan.monthlyPayment)} × {plan.tenureMonths} months
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {formatInterestRate(plan.interestRate)}
        </p>
        {hasCashback ? (
          <p className="mt-1 text-sm font-medium text-emerald-700">
            Cashback {formatCurrency(plan.cashback)}
          </p>
        ) : null}
      </div>
    </label>
  )
}
