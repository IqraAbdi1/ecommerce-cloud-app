import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin, isAdminView, toggleView } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold text-blue-400">
        CloudShop
      </Link>
      <div className="flex gap-5 items-center text-sm">
        <Link to="/products" className="hover:text-blue-400 transition">Products</Link>
        {user ? (
          <>
            {!isAdminView() && (
              <>
                <Link to="/my-orders" className="hover:text-blue-400 transition">My Orders</Link>
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
    </nav>
  )
}