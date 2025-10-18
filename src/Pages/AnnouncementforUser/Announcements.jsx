import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosSecure from "../../api/AxiosSecure";

// Custom hook for announcements
const useAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await AxiosSecure.get("/announcements");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Skeleton Loader Component
const AnnouncementSkeleton = ({ count = 3 }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="animate-pulse p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Unable to load announcements
      </h3>
      <p className="text-red-600 mb-6 max-w-md mx-auto">
        {error?.message || "Something went wrong while fetching announcements."}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-purple-100">
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No announcements yet</h3>
      <p className="text-gray-600 text-lg max-w-md mx-auto">
        There are no announcements at the moment. Check back later for updates and important information.
      </p>
    </div>
  </div>
);

// Announcement Card Component
const AnnouncementCard = ({ announcement, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxPreviewLength = 200;
  const needsTruncation = announcement.description.length > maxPreviewLength;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded 
    ? announcement.description 
    : announcement.description.slice(0, maxPreviewLength) + (needsTruncation ? "..." : "");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || "?";
  };

  return (
    <article
      className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
      style={{ 
        animationDelay: `${index * 75}ms`,
        animation: `fadeInUp 0.5s ease-out ${index * 75}ms both`
      }}
      tabIndex={0}
    >
      <header className="flex items-start gap-4 mb-4">
        {announcement.authorImage ? (
          <img
            src={announcement.authorImage}
            alt={`${announcement.authorName}'s profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            {getInitials(announcement.authorName)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {announcement.authorName}
          </h3>
          <time 
            className="text-gray-500 text-sm"
            dateTime={announcement.createdAt}
          >
            {new Date(announcement.createdAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </header>

      <div className="mb-4">
        <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 text-xl mb-3 line-clamp-2">
          {announcement.title}
        </h2>

        <div className="text-gray-700 leading-relaxed">
          <p className="whitespace-pre-line">
            {displayText}
            {needsTruncation && (
              <button
                onClick={toggleExpand}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus:underline"
              >
                {isExpanded ? " Show less" : " Read more"}
              </button>
            )}
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatDate(announcement.createdAt)}</span>
        </div>

        <div className="flex items-center gap-3">
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span>{announcement.attachments.length}</span>
            </div>
          )}
          
          <button 
            onClick={toggleExpand}
            className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 focus:outline-none focus:underline"
          >
            {isExpanded ? "Show less" : "Read more"}
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </footer>
    </article>
  );
};

// Main Component
const Announcements = () => {
  const {
    data: announcements = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAnnouncements();

  if (isLoading) {
    return <AnnouncementSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!announcements.length) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Stay updated with the latest news and updates</p>
        </div>
        <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
          {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"}
        </span>
      </header>

      {/* Announcements List */}
      <section className="space-y-6" aria-label="Announcements list">
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement._id}
            announcement={announcement}
            index={index}
          />
        ))}
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Announcements;