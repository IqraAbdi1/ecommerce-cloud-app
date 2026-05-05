import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orders, total, paymentMethod, items } = location.state || {}

  useEffect(() => {
    if (!orders) navigate('/')
  }, [orders])

  if (!orders) return null

  const paymentLabels = {
    card: '💳 Credit / Debit Card',
    mobile_money: '📱 Mobile Money',
    cash: '💵 Cash on Delivery'
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-md p-8 text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="font-semibold text-lg mb-4">Order Receipt</h2>
        <div className="space-y-3 mb-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs">Qty: {item.quantity} × ${item.price}</p>
              </div>
              <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Payment method</span>
            <span>{paymentLabels[paymentMethod]}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total paid</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {orders.map((order, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
              Order ID: {order.id}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/my-orders')}
          className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate('/products')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}