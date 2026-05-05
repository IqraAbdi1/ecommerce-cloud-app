import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => setProduct(res.data.product))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleOrder = async () => {
  if (!user) return navigate('/login')
  setOrdering(true)
  setMessage('')
  try {
    const res = await api.post('/api/orders', { product_id: id, quantity })
    setIsSuccess(true)
    setMessage(`Your order for ${product.name} has been placed successfully!`)
  } catch (err) {
    setIsSuccess(false)
    setMessage(err.response?.data?.error || 'Order failed')
  } finally {
    setOrdering(false)
  }
}

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>
  if (!product) return <div className="text-center mt-20 text-gray-400">Product not found.</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 mb-6 hover:underline flex items-center gap-1"
      >
        ← Back to products
      </button>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-72 object-cover" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              isSuccess
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Qty:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 w-20 text-center"
              />
            </div>
            <button
              onClick={handleOrder}
              disabled={ordering || product.stock === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition"
            >
              {ordering ? 'Placing order...' : product.stock === 0 ? 'Out of stock' : 'Place Order'}
            </button>
          </div>
          {!user && (
            <p className="text-center text-sm text-gray-500 mt-3">
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate('/login')}
              >
                Login
              </span> to place an order
            </p>
          )}
        </div>
      </div>
    </div>
  )
}