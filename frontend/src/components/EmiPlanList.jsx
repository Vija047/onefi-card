import EmiPlanCard from './EmiPlanCard'

export default function EmiPlanList({ plans, selectedPlanId, onSelect }) {
  if (!plans?.length) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-800">
        No EMI plans are available for this product right now.
      </div>
    )
  }

  return (
    <div className="space-y-3" role="radiogroup" aria-label="EMI plans">
      {plans.map((plan) => (
        <EmiPlanCard
          key={plan.id}
          plan={plan}
          selected={selectedPlanId === plan.id}
          onSelect={() => onSelect(plan)}
        />
      ))}
    </div>
  )
}
