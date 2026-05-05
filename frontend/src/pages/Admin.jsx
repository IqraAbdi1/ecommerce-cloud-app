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
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your products</p>
        </div>
        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1.5 rounded-full font-medium">
          Admin View
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Add new product</h2>
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              isSuccess
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
            <input
              type="text" placeholder="Product name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number" placeholder="Price"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                required
              />
              <input
                type="number" placeholder="Stock"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.stock}
                onChange={e => setForm({...form, stock: e.target.value})}
              />
            </div>
            <input
              type="text" placeholder="Category"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">Product image</label>
              <input
                type="file" accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="w-full text-sm text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Existing products ({products.length})
          </h2>
          {fetching ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-400">${product.price} · Stock: {product.stock}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
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