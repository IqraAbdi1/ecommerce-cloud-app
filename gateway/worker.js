

const SERVICES = {
  auth: 'https://your-auth-service.railway.app',
  products: 'https://your-products-service.railway.app',
  orders: 'https://your-orders-service.railway.app',
  payments: 'https://your-payments-service.railway.app'
}

const PUBLIC_ROUTES = [
  { method: 'POST', path: '/api/auth/register' },
  { method: 'POST', path: '/api/auth/login' },
  { method: 'GET', path: '/api/products' },
  { method: 'GET', path: '/api/health' }
]

async function verifyJWT(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (e) {
    return null
  }
}

function isPublicRoute(method, path) {
  return PUBLIC_ROUTES.some(route =>
    route.method === method && path.startsWith(route.path)
  )
}

function getServiceUrl(path) {
  if (path.startsWith('/api/auth')) {
    return { url: SERVICES.auth, newPath: path.replace('/api/auth', '/auth') }
  }
  if (path.startsWith('/api/products')) {
    return { url: SERVICES.products, newPath: path.replace('/api/products', '/products') }
  }
  if (path.startsWith('/api/orders')) {
    return { url: SERVICES.orders, newPath: path.replace('/api/orders', '/orders') }
  }
  if (path.startsWith('/api/payments')) {
    return { url: SERVICES.payments, newPath: path.replace('/api/payments', '/payments') }
  }
  return null
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname
    const method = request.method

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({
        status: 'Gateway running on Cloudflare Edge',
        location: request.cf?.city + ', ' + request.cf?.country,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    const service = getServiceUrl(path)
    if (!service) {
      return new Response(JSON.stringify({ error: 'Route not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!isPublicRoute(method, path)) {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Access denied. No token provided.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const token = authHeader.split(' ')[1]
      const payload = await verifyJWT(token)

      if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    const targetUrl = service.url + service.newPath + url.search

    const newHeaders = new Headers(request.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: method !== 'GET' && method !== 'HEAD' ? request.body : undefined
    })

    const responseBody = await response.text()

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'Cloudflare Edge Worker'
      }
    })
  }
}