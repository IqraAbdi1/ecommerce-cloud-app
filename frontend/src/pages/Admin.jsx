import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Admin() {
  const { user, isAdmin, isAdminView } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: ''
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [products, setProducts] = useState([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user || !isAdmin() || !isAdminView()) {
      navigate('/')
      return
    }
    fetchProducts()
  }, [user])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products')
      setProducts(res.data.products)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key])
      })
      if (image) formData.append('image', image)
      await api.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setIsSuccess(true)
      setMessage('Product created successfully!')
      setForm({ name: '', description: '', price: '', stock: '', category: '' })
      setImage(null)
      fetchProducts()
    } catch (err) {
      setIsSuccess(false)
      setMessage(err.response?.data?.error || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/api/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-slate-300 text-sm mt-1">Manage your products</p>
        </div>
        <span className="bg-yellow-500 text-black text-xs px-3 py-1.5 rounded-full font-medium">
          Admin View
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Add new product</h2>
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
              isSuccess
                ? 'bg-green-900 bg-opacity-40 border border-green-700 border-opacity-40 text-green-400'
                : 'bg-red-900 bg-opacity-40 border border-red-700 border-opacity-40 text-red-400'
            }`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-2xl p-6 space-y-4">
            <input
              type="text"
              placeholder="Product name"
              className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Price"
                className="bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                className="bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.stock}
                onChange={e => setForm({...form, stock: e.target.value})}
              />
            </div>
            <input
              type="text"
              placeholder="Category"
              className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            />
            <div>
              <label className="block text-sm text-slate-300 mb-2">Product image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">
            Existing products ({products.length})
          </h2>
          {fetching ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : products.length === 0 ? (
            <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-slate-400 text-sm">No products yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-4 flex justify-between items-center hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-xl">📦</div>
                    )}
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs text-slate-400">${product.price} · Stock: {product.stock}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition px-3 py-1 rounded-lg hover:bg-red-900 hover:bg-opacity-30"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}