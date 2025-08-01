import {Star} from 'lucide-react';  
export const RatingStars = ({ rating, totalReviews }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      ))}
    </div>
    {totalReviews > 0 && <span className="text-sm text-gray-600">({totalReviews})</span>}
  </div>
);