import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Analytics() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return navigate('/login')
    if (!isAdmin()) return navigate('/')
    api.get('/api/orders/analytics/sales')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const maxRevenue = data?.top_products?.length
    ? Math.max(...data.top_products.map(p => p.total_revenue))
    : 1

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sales Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">
          Powered by MapReduce — maps over every order and reduces into aggregated totals
        </p>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading analytics...</div>
      ) : !data ? (
        <div className="text-center py-20 text-gray-400">No data available.</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
              <p className="text-blue-400 text-sm mb-2">Total orders</p>
              <p className="text-4xl font-bold text-blue-600">{data.summary.total_orders}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
              <p className="text-green-400 text-sm mb-2">Items sold</p>
              <p className="text-4xl font-bold text-green-600">{data.summary.total_items_sold}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 text-center">
              <p className="text-purple-400 text-sm mb-2">Total revenue</p>
              <p className="text-4xl font-bold text-purple-600">${data.summary.total_revenue}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-semibold mb-4">Revenue by product</h2>
            <div className="space-y-3">
              {data.top_products.map((p, i) => {
                const barWidth = maxRevenue > 0
                  ? Math.round((p.total_revenue / maxRevenue) * 100)
                  : 0
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
                  'bg-orange-500', 'bg-pink-500'
                ]
                return (
                  <div key={p.product_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{p.product_name}</span>
                      <span className="text-gray-500">${p.total_revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-semibold mb-4">Units sold by product</h2>
            <div className="flex items-end gap-4 h-40">
              {data.top_products.map((p, i) => {
                const maxQty = Math.max(...data.top_products.map(x => x.total_quantity_sold))
                const height = maxQty > 0
                  ? Math.round((p.total_quantity_sold / maxQty) * 100)
                  : 0
                const colors = [
                  'bg-blue-400', 'bg-green-400', 'bg-purple-400',
                  'bg-orange-400', 'bg-pink-400'
                ]
                return (
                  <div key={p.product_id} className="flex flex-col items-center flex-1">
                    <span className="text-xs text-gray-500 mb-1">{p.total_quantity_sold}</span>
                    <div
                      className={`w-full rounded-t-lg ${colors[i % colors.length]} transition-all duration-500`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-1 text-center truncate w-full px-1">
                      {p.product_name.length > 8
                        ? p.product_name.substring(0, 8) + '...'
                        : p.product_name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold">Top products — full breakdown</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">#</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">Product</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">Units sold</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.top_products.map((p, i) => (
                  <tr key={p.product_id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4 font-medium">{p.product_name}</td>
                    <td className="px-6 py-4">{p.total_quantity_sold}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      ${p.total_revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}