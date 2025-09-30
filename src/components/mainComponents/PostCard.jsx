// components/mainComponents/PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200">
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={post.authorImage || post.author?.avatar || "/default-avatar.png"}
          alt={post.authorName || post.author?.name || "User"}
          className="w-12 h-12 rounded-full object-cover border"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <div>
          <h4 className="font-bold text-gray-900">
            {post.authorName || post.author?.name || "Anonymous"}
          </h4>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <h2 className="text-xl font-bold mb-3 text-gray-900">
        {post.postTitle || post.title}
      </h2>
      
      <p className="text-gray-700 mb-4 line-clamp-3">
        {post.postDescription || post.content}
      </p>

      {/* Tags */}
      <div className="mb-4">
        {post.tags?.map((tag, i) => (
          <span
            key={i}
            className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
        {post.tag && !post.tags && (
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            #{post.tag}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <span className="text-green-500">👍</span> {post.upVote || 0}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-500">👎</span> {post.downVote || 0}
        </span>
        <span className="flex items-center gap-1">
          💬 {post.commentCount || (post.comments ? post.comments.length : 0)}
        </span>
      </div>

      {/* Read More Button - THIS IS WHAT WAS MISSING */}
      <div className="border-t pt-4">
        <Link 
          to={`/post/${post._id}`}
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
        >
          Read Full Post
        </Link>
      </div>
    </div>
  );
};

export default PostCard;