import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => setProduct(res.data.product))
      .catch(console.error)
      .finally(() => setLoading(false))
    const stored = JSON.parse(localStorage.getItem(`reviews_${id}`) || '[]')
    setReviews(stored)
  }, [id])

  const handleAddToCart = () => {
    if (!user) return navigate('/login')
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmittingReview(true)
    const review = {
      id: Date.now(),
      user_name: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString()
    }
    const updated = [review, ...reviews]
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated))
    setReviews(updated)
    setNewReview({ rating: 5, comment: '' })
    setSubmittingReview(false)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>
  if (!product) return <div className="text-center mt-20 text-gray-400">Product not found.</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 mb-6 hover:underline"
      >
        ← Back to products
      </button>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-72 object-cover" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {avgRating && (
                <span className="ml-2 text-sm text-yellow-500">
                  ★ {avgRating} ({reviews.length} reviews)
                </span>
              )}
            </div>
            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex gap-4 items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Qty:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 w-20 text-center"
              />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
              }`}
            >
              {added ? '✓ Added to cart!' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              View Cart
            </button>
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-orange-500 text-sm">Only {product.stock} left in stock!</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{review.user_name}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        {user && (
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <h3 className="font-medium text-sm">Write a review</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rating:</label>
              <select
                value={newReview.rating}
                onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="border rounded px-2 py-1 text-sm"
              >
                {[5,4,3,2,1].map(n => (
                  <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Share your thoughts about this product..."
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={newReview.comment}
              onChange={e => setNewReview({...newReview, comment: e.target.value})}
              required
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  )
}