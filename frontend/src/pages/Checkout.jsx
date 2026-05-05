import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '', name: '', expiry: '', cvv: ''
  })
  const [mobileMoney, setMobileMoney] = useState({ phone: '', provider: 'mtn' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/login')
    return null
  }

  if (cart.length === 0) {
    navigate('/products')
    return null
  }

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        return 'Please enter a valid 16-digit card number.'
      }
      if (!cardDetails.name) return 'Please enter the cardholder name.'
      if (!cardDetails.expiry) return 'Please enter the card expiry date.'
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) return 'Please enter a valid CVV.'
    }
    if (paymentMethod === 'mobile_money') {
      if (!mobileMoney.phone || mobileMoney.phone.length < 10) {
        return 'Please enter a valid phone number.'
      }
    }
    return null
  }

  const handleCheckout = async () => {
    const validationError = validatePayment()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    setError('')
    try {
      const orderResults = []
      for (const item of cart) {
        const orderRes = await api.post('/api/orders', {
          product_id: item.id,
          quantity: item.quantity
        })
        orderResults.push(orderRes.data.order)
      }
      clearCart()
      navigate('/order-confirmation', {
        state: {
          orders: orderResults,
          total: cartTotal,
          paymentMethod,
          items: cart
        }
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3 mb-6">
              {[
                { value: 'card', label: '💳 Credit / Debit Card' },
                { value: 'mobile_money', label: '📱 Mobile Money' },
                { value: 'cash', label: '💵 Cash on Delivery' }
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    paymentMethod === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="font-medium text-sm">{option.label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 text-white mb-4">
                  <p className="text-xs opacity-70 mb-3">Card Number</p>
                  <p className="text-lg font-mono tracking-widest mb-4">
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs opacity-70">Cardholder</p>
                      <p className="text-sm font-medium">{cardDetails.name || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Expires</p>
                      <p className="text-sm font-medium">{cardDetails.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Card number"
                  maxLength={19}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cardDetails.number}
                  onChange={e => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                />
                <input
                  type="text"
                  placeholder="Cardholder name"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cardDetails.name}
                  onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.expiry}
                    onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={4}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.cvv}
                    onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'mobile_money' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {['mtn', 'airtel'].map(provider => (
                    <label
                      key={provider}
                      className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                        mobileMoney.provider === provider
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="provider"
                        value={provider}
                        checked={mobileMoney.provider === provider}
                        onChange={e => setMobileMoney({...mobileMoney, provider: e.target.value})}
                        className="hidden"
                      />
                      <span className="font-medium text-sm uppercase">{provider} Money</span>
                    </label>
                  ))}
                </div>
                <input
                  type="tel"
                  placeholder="Phone number e.g. 0771234567"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={mobileMoney.phone}
                  onChange={e => setMobileMoney({...mobileMoney, phone: e.target.value})}
                />
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  You will receive a payment prompt on {mobileMoney.phone || 'your phone'}. Enter your PIN to confirm.
                </p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Pay with cash when your order is delivered. Please have the exact amount ready.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3">
                <span>Total</span>
                <span className="text-blue-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Your payment information is secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}