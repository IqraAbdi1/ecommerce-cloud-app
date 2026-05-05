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

    Promise.all([
      api.get('/api/orders/analytics/sales'),
      api.get('/api/products')
    ]).then(([analyticsRes, productsRes]) => {
      const analytics = analyticsRes.data
      const products = productsRes.data.products
      const enriched = {
        ...analytics,
        top_products: analytics.top_products.map(p => ({
          ...p,
          image_url: products.find(prod => prod.id === p.product_id)?.image_url || null
        }))
      }
      setData(enriched)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const maxRevenue = data?.top_products?.length
    ? Math.max(...data.top_products.map(p => p.total_revenue))
    : 1

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sales Analytics</h1>
        <p className="text-slate-300 text-sm mt-1">
          Powered by MapReduce — maps over every order and reduces into aggregated totals
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-300">Loading analytics...</div>
      ) : !data ? (
        <div className="text-center py-20 text-slate-300">No data available.</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-blue-400 text-sm mb-2">Total orders</p>
              <p className="text-4xl font-bold text-blue-400">{data.summary.total_orders}</p>
            </div>
            <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-green-400 text-sm mb-2">Items sold</p>
              <p className="text-4xl font-bold text-green-400">{data.summary.total_items_sold}</p>
            </div>
            <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-purple-400 text-sm mb-2">Total revenue</p>
              <p className="text-4xl font-bold text-purple-400">${data.summary.total_revenue}</p>
            </div>
          </div>

          <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-4 text-white">Revenue by product</h2>
            <div className="space-y-4">
              {data.top_products.map((p, i) => {
                const barWidth = maxRevenue > 0
                  ? Math.round((p.total_revenue / maxRevenue) * 100)
                  : 0
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
                return (
                  <div key={p.product_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-200">{p.product_name}</span>
                      <span className="text-slate-400">${p.total_revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
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

          <div className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-6 text-white">Units sold by product</h2>
            <div className="space-y-4">
              {data.top_products.map((p, i) => {
                const maxQty = Math.max(...data.top_products.map(x => x.total_quantity_sold))
                const width = maxQty > 0 ? Math.round((p.total_quantity_sold / maxQty) * 100) : 0
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
                return (
                  <div key={p.product_id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">📦</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-200 font-medium">{p.product_name}</span>
                        <span className="text-slate-400">{p.total_quantity_sold} units</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-slate-800 bg-opacity-60 rounded-xl overflow-hidden border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="font-semibold text-white">Top products — full breakdown</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-900 bg-opacity-50">
                <tr>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">#</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">Product</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">Units sold</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.top_products.map((p, i) => (
                  <tr key={p.product_id} className="border-t border-slate-700 hover:bg-slate-700 hover:bg-opacity-30">
                    <td className="px-6 py-4 text-slate-400">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3 mt-1">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.product_name} className="w-8 h-8 rounded object-cover" />
                      )}
                      {p.product_name}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{p.total_quantity_sold}</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">
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