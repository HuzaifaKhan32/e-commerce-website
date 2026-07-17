'use client';

import React, { useEffect, useState } from 'react';
import { FiStar, FiCheck, FiX, FiLoader, FiAlertCircle } from 'react-icons/fi';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
  products: {
    name: string;
    image_url: string;
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, approved: true }),
      });

      if (res.ok) {
        fetchReviews();
      } else {
        alert('Failed to approve review');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve review');
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') return !review.approved;
    if (filter === 'approved') return review.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary mb-2">Reviews</h1>
          <p className="text-grey">Moderate customer reviews</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200">
            <FiAlertCircle />
            <span className="text-sm font-bold">{pendingCount} pending review{pendingCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-xl border border-taupe/20 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            filter === 'all' ? 'bg-primary text-white shadow-md' : 'text-grey hover:bg-ivory'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            filter === 'pending' ? 'bg-primary text-white shadow-md' : 'text-grey hover:bg-ivory'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            filter === 'approved' ? 'bg-primary text-white shadow-md' : 'text-grey hover:bg-ivory'
          }`}
        >
          Approved ({reviews.filter((r) => r.approved).length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-taupe/20 p-6 hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex gap-4 flex-1">
                <img
                  src={review.products.image_url}
                  alt={review.products.name}
                  className="w-20 h-20 rounded-lg object-cover border border-taupe/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-secondary mb-1">{review.products.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`text-sm ${i < review.rating ? 'fill-current' : 'text-taupe'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-grey font-bold">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-grey text-sm mb-3 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-secondary">{review.users.name}</p>
                    <span className="text-xs text-taupe">•</span>
                    <p className="text-xs text-taupe">{review.users.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2 shrink-0">
                {review.approved ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200 text-xs font-bold uppercase tracking-widest">
                    <FiCheck /> Approved
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
                    >
                      <FiX /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-taupe/20 border-dashed p-12 text-center">
          <FiStar className="text-6xl text-taupe/40 mx-auto mb-4" />
          <p className="text-grey font-medium">No reviews to show</p>
        </div>
      )}
    </div>
  );
}
