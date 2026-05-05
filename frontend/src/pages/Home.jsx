import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">CloudShop</h1>
        <p className="text-xl text-gray-600 mb-2">
          A full-stack cloud-native e-commerce application
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Built with microservices, edge computing, cloud storage and MapReduce analytics
        </p>
        <div className="flex gap-4 justify-center mb-12">
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Browse Products
          </Link>
          {!user && (
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-2xl mb-2">🌐</div>
            <p className="font-semibold text-gray-800">Edge Computing</p>
            <p className="text-xs text-gray-500 mt-1">Cloudflare Workers gateway — 300+ global locations</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="font-semibold text-gray-800">Microservices</p>
            <p className="text-xs text-gray-500 mt-1">4 independent services on Railway PaaS</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-2xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">MapReduce</p>
            <p className="text-xs text-gray-500 mt-1">Live sales analytics engine</p>
          </div>
        </div>
      </div>
    </div>
  )
}