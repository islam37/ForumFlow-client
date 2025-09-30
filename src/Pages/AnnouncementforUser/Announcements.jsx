import React, { useEffect, useState } from "react";
import AxiosSecure from "../../api/AxiosSecure";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setError(null);
        const res = await AxiosSecure.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Loading state with premium skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load announcements</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!announcements.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-600">Check back later for updates and important information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'}
        </span>
      </div>
      
      <div className="space-y-6">
        {announcements.map((a, index) => (
          <div 
            key={a._id} 
            className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              {a.authorImage ? (
                <img 
                  src={a.authorImage} 
                  alt={a.authorName} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                  {a.authorName?.charAt(0) || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{a.authorName}</h3>
                <small className="text-gray-500 text-sm">
                  {new Date(a.createdAt).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </div>
            </div>
            
            <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 text-xl mb-3">
              {a.title}
            </h4>
            
            <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
              {a.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                Read more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;