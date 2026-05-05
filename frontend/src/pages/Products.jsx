import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

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

  const filtered = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          {searchQuery && (
            <p className="text-gray-400 text-sm mt-1">
              Showing results for "{searchQuery}" — {filtered.length} found
            </p>
          )}
        </div>
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
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div
                className="cursor-pointer"
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
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-600 font-bold text-lg">${product.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > 0
                        ? product.stock <= 5
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}