import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [addedId, setAddedId] = useState(null)
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => { fetchProducts() }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/products' + (category ? `?category=${category}` : ''))
      setProducts(res.data.products)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    addToCart(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setCategory('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  category === '' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    category === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-slate-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-slate-500 text-lg">No products found</p>
            <button onClick={() => setCategory('')} className="mt-4 text-blue-600 hover:underline text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-200 group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.image_url ? (
                    <div className="overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-800 text-lg leading-tight">{product.name}</h3>
                    </div>
                    {product.category && (
                      <span className="inline-block text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mb-3">
                        {product.category}
                      </span>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold text-xl">${product.price}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.stock === 0
                          ? 'bg-red-50 text-red-600'
                          : product.stock <= 5
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-green-50 text-green-600'
                      }`}>
                        {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `${product.stock} left` : 'In stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                      addedId === product.id
                        ? 'bg-green-500 text-white'
                        : product.stock === 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {addedId === product.id ? '✓ Added!' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}