import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <span className="inline-block bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 text-blue-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            Cloud-Native E-Commerce Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Shop Smarter with
            <span className="text-blue-400"> CloudShop</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
            A full-stack e-commerce experience powered by microservices, edge computing, and cloud storage.
          </p>
          <p className="text-sm text-slate-400 mb-10">
            Built on Railway · Cloudflare Edge · Supabase · Vercel
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-blue-900"
            >
              Shop Now →
            </Link>
            {!user && (
              <Link
                to="/register"
                className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 text-white px-8 py-3.5 rounded-xl font-semibold transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-3">
          Why CloudShop?
        </h2>
        <p className="text-center text-slate-500 mb-10 text-sm">
          Every layer of this app demonstrates a real cloud computing concept
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: '🌐',
              title: 'Edge Computing',
              desc: 'API gateway runs on Cloudflare Workers at 300+ global locations — requests are handled closest to you.',
              badge: 'Unit 6'
            },
            {
              icon: '⚙️',
              title: 'Microservices',
              desc: '4 independent services — Auth, Products, Orders, Payments — each with its own database and deployment.',
              badge: 'Unit 1'
            },
            {
              icon: '🗄️',
              title: 'Cloud Storage',
              desc: 'Product images stored in Supabase Storage (S3-compatible). PostgreSQL databases per service.',
              badge: 'Unit 4'
            },
            {
              icon: '📊',
              title: 'MapReduce Analytics',
              desc: 'Sales analytics endpoint maps over every order and reduces into aggregated revenue totals.',
              badge: 'Unit 5'
            },
            {
              icon: '🐳',
              title: 'Containerisation',
              desc: 'Every microservice runs in its own Docker container — isolated, portable, and scalable.',
              badge: 'Unit 3'
            },
            {
              icon: '🔄',
              title: 'CI/CD Pipeline',
              desc: 'GitHub Actions + Railway auto-deploy — every push to main deploys all services automatically.',
              badge: 'DevOps'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start shopping?</h2>
        <p className="text-blue-200 mb-8">Browse our products and experience cloud commerce</p>
        <Link
          to="/products"
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-semibold transition shadow-lg"
        >
          Browse Products →
        </Link>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">CloudShop</h3>
            <p className="text-sm leading-relaxed">
              A cloud-native e-commerce platform built as a demonstration of modern cloud computing concepts.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Infrastructure</h3>
            <ul className="text-sm space-y-1">
              <li>Frontend — Vercel CDN</li>
              <li>Gateway — Cloudflare Workers</li>
              <li>Services — Railway PaaS</li>
              <li>Database — Supabase PostgreSQL</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Course</h3>
            <ul className="text-sm space-y-1">
              <li>CSC 3206 — Edge & Cloud Computing</li>
              <li>Islamic University in Uganda</li>
              <li>Year III — Computer Science</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-8 pt-6 text-center text-xs">
          Built with microservices, edge computing, cloud storage and MapReduce analytics
        </div>
      </footer>
    </div>
  )
}