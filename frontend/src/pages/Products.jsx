import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchProducts() }, [category])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products' + (category ? `?category=${category}` : ''))
      setProducts(res.data.products)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <input
          type="text"
          placeholder="Filter by category..."
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-all duration-200 overflow-hidden"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold text-lg">${product.price}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}