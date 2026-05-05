import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Profile() {
  const { user, login, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await api.put('/api/auth/profile', {
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword || undefined
      })
      login(res.data.user, token)
      setIsSuccess(true)
      setMessage('Profile updated successfully!')
      setForm({...form, currentPassword: '', newPassword: ''})
    } catch (err) {
      setIsSuccess(false)
      setMessage(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg text-white">{user.name}</p>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
              user.role === 'admin' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
            isSuccess
              ? 'bg-green-900 bg-opacity-40 border border-green-700 border-opacity-40 text-green-400'
              : 'bg-red-900 bg-opacity-40 border border-red-700 border-opacity-40 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
            <input
              type="text"
              className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
            <input
              type="email"
              className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-medium text-slate-300 mb-3">Change password (optional)</p>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                value={form.currentPassword}
                onChange={e => setForm({...form, currentPassword: e.target.value})}
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full bg-slate-900 bg-opacity-50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                value={form.newPassword}
                onChange={e => setForm({...form, newPassword: e.target.value})}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}