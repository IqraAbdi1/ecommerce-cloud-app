import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Payments() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return navigate('/login')
    api.get('/api/payments/user/my-payments')
      .then(res => setPayments(res.data.payments))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const statusColor = (status) => {
    if (status === 'completed') return 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30'
    if (status === 'pending') return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30'
    return 'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-2">Payment History</h1>
      <p className="text-slate-300 text-sm mb-6">All your transaction records</p>
      {loading ? (
        <div className="text-center py-20 text-slate-300">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">💳</p>
          <p className="text-slate-300 mb-4">No payments yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map(payment => (
            <div key={payment.id} className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg text-white">Payment #{payment.id.substring(0, 8)}...</p>
                  <p className="text-slate-400 text-xs mt-1">Order ID: {payment.order_id}</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs">Method</p>
                  <p className="font-semibold mt-1 capitalize text-white">{payment.payment_method}</p>
                </div>
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs">Date</p>
                  <p className="font-semibold mt-1 text-xs text-white">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-green-900 bg-opacity-40 border border-green-700 border-opacity-40 rounded-lg p-3 text-center">
                  <p className="text-green-400 text-xs">Amount paid</p>
                  <p className="font-bold text-green-400 mt-1">${payment.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}