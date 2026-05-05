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
    if (status === 'confirmed') return 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30'
    if (status === 'pending') return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30'
    return 'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-2">My Orders</h1>
      <p className="text-slate-300 text-sm mb-6">Track all your orders</p>
      {loading ? (
        <div className="text-center py-20 text-slate-300">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-slate-300 mb-4">No orders yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-white">{order.product_name}</h3>
                  <p className="text-slate-400 text-xs mt-1">ID: {order.id}</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs">Quantity</p>
                  <p className="font-semibold mt-1 text-white">{order.quantity}</p>
                </div>
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs">Unit price</p>
                  <p className="font-semibold mt-1 text-white">${order.unit_price}</p>
                </div>
                <div className="bg-blue-900 bg-opacity-40 border border-blue-700 border-opacity-40 rounded-lg p-3 text-center">
                  <p className="text-blue-400 text-xs">Total</p>
                  <p className="font-bold text-blue-400 mt-1">${order.total_price}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}