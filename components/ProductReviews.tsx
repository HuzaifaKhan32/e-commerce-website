'use client';

import React, { useState, useEffect } from 'react';
import { FiStar, FiUser, FiLoader, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  status: string;
  users: {
    name: string;
    email: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, product }) => {
  const { session } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);

      // Check if current user has already reviewed
      if (session?.user?.id) {
        const userId = session.user.id;
        const userRev = data.find((r: Review) => r.user_id === userId);
        setUserReview(userRev || null);
      }
    } catch (err) {
      setError('Error fetching reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (userReview) {
      setError('You have already submitted a review for this product');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Reset form and refetch reviews
      setNewReview({ rating: 5, title: '', comment: '' });
      fetchReviews();
    } catch (err: any) {
      setError(err.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`text-lg ${i < rating ? 'fill-current text-primary' : 'text-taupe'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-serif font-bold text-secondary">Customer Reviews</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {renderStars(Math.round(product.rating))}
            <span className="ml-2 text-secondary font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-grey/50 font-bold ml-1 uppercase tracking-widest">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Review submission form for logged-in users */}
      {session?.user?.id && !userReview && (
        <div className="mb-16 p-8 bg-ivory rounded-2xl border border-secondary/10">
          <h4 className="text-lg font-bold text-secondary mb-6">Write a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-3">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-2xl focus:outline-none"
                  >
                    <FiStar
                      className={`${star <= newReview.rating ? 'fill-current text-primary' : 'text-taupe'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-3">Review Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full p-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-3">Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full p-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Share your experience with this product"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-secondary text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-taupe/10 pb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h4 className="font-bold text-secondary">{review.users.name || 'Anonymous'}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-[10px] text-taupe font-bold uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <h5 className="font-bold text-secondary mt-2">{review.title}</h5>
                  <p className="mt-3 text-grey/80 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-grey">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;