import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin, isAdminView, toggleView } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-400 whitespace-nowrap">
          ☁ CloudShop
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2 text-slate-400 hover:text-white">
              🔍
            </button>
          </div>
        </form>

        <div className="flex gap-4 items-center text-sm">
          <Link to="/products" className="text-slate-300 hover:text-white transition">Products</Link>

          {user ? (
            <>
              {!isAdminView() && (
                <>
                  <Link to="/my-orders" className="text-slate-300 hover:text-white transition hidden md:block">Orders</Link>
                  <Link to="/payments" className="text-slate-300 hover:text-white transition hidden md:block">Payments</Link>
                  <Link to="/profile" className="text-slate-300 hover:text-white transition hidden md:block">Profile</Link>
                </>
              )}
              {isAdminView() && (
                <>
                  <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition hidden md:block">Manage</Link>
                  <Link to="/analytics" className="text-yellow-400 hover:text-yellow-300 transition hidden md:block">Analytics</Link>
                </>
              )}
              {isAdmin() && (
                <button
                  onClick={toggleView}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isAdminView()
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {isAdminView() ? '👤 Customer' : '⚙ Admin'}
                </button>
              )}

              <Link to="/cart" className="relative">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 text-xs hidden md:block">{user.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full hidden md:block ${
                  isAdmin() ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'
                }`}>
                  {isAdminView() ? 'admin' : 'customer'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/cart" className="relative">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/login" className="text-slate-300 hover:text-white transition">Login</Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}