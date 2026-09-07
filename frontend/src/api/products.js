const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://onefi-card.onrender.com'

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      data?.message || `Request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

export function getProducts() {
  return request('/api/products')
}

export function getProductBySlug(slug) {
  return request(`/api/products/${encodeURIComponent(slug)}`)
}

export { API_BASE_URL }
