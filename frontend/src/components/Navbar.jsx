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
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-400">
          CloudShop
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 text-gray-400 hover:text-white text-sm px-2"
            >
              🔍
            </button>
          </div>
        </form>

        <div className="flex gap-5 items-center text-sm">
          <Link to="/products" className="hover:text-blue-400 transition">Products</Link>
          {user ? (
            <>
              {!isAdminView() && (
                <>
                  <Link to="/my-orders" className="hover:text-blue-400 transition">My Orders</Link>
                  <Link to="/payments" className="hover:text-blue-400 transition">Payments</Link>
                  <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
                </>
              )}
              {isAdminView() && (
                <>
                  <Link to="/admin" className="hover:text-yellow-400 transition">Manage Products</Link>
                  <Link to="/analytics" className="hover:text-yellow-400 transition">Analytics</Link>
                </>
              )}
              {isAdmin() && (
                <button
                  onClick={toggleView}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    isAdminView()
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  {isAdminView() ? 'Switch to Customer View' : 'Switch to Admin View'}
                </button>
              )}
              <Link to="/cart" className="relative hover:text-blue-400 transition">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{user.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isAdmin()
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {isAdminView() ? 'admin' : 'customer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/cart" className="relative hover:text-blue-400 transition">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
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