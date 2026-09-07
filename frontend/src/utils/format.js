export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return '—'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatInterestRate(rate) {
  if (rate === null || rate === undefined) return '—'
  const value = Number(rate)
  if (value === 0) return '0% interest'
  return `${value}% interest`
}
