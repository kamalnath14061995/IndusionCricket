import React, { useState } from 'react';
import { Star, Quote, ChevronDown, ChevronUp } from 'lucide-react';

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  photo: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = testimonial.comment.length > 100;

  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="p-4">
        {/* Header with user info */}
        <div className="flex items-center mb-3">
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            className="w-10 h-10 object-cover rounded-full shadow-sm"
          />
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-bold text-gray-900 truncate">{testimonial.name}</h4>
            <div className="flex items-center">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
              <span className="ml-1 text-xs font-medium text-yellow-600">{testimonial.rating}.0</span>
            </div>
          </div>
        </div>
        
        {/* Review content */}
        <div className="relative">
          <Quote className="w-4 h-4 text-gray-300 absolute -top-1 -left-1" />
          <p className={`text-sm text-gray-700 pl-4 italic ${!isExpanded && isLongText ? 'line-clamp-3' : ''}`}>
            "{testimonial.comment}"
          </p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;