import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-2xl p-16">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-slate-300 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <p className="text-slate-300 text-sm mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm transition">
          Clear cart
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-4 flex gap-4">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📦</div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
                <p className="text-slate-400 text-sm mb-3">{item.category}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition"
                    >−</button>
                    <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition"
                    >+</button>
                  </div>
                  <span className="font-bold text-blue-400">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4 text-white">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.name} × {item.quantity}</span>
                  <span className="text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-blue-400">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition"
            >
              {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full mt-3 border border-slate-600 text-slate-300 py-2.5 rounded-xl text-sm hover:bg-slate-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}