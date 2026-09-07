import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import Shop from './pages/Shop'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Shop />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
