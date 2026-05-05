import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function MyOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return navigate('/login')
    api.get('/api/orders/user/my-orders')
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const statusColor = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No orders yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.product_name}</h3>
                  <p className="text-gray-400 text-xs mt-1">ID: {order.id}</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">Quantity</p>
                  <p className="font-semibold mt-1">{order.quantity}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">Unit price</p>
                  <p className="font-semibold mt-1">${order.unit_price}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-blue-400 text-xs">Total</p>
                  <p className="font-bold text-blue-600 mt-1">${order.total_price}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}