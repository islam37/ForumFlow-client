// components/mainComponents/PostCard.jsx
import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition flex flex-col md:flex-row gap-4">
      <img
        src={post.author?.avatar || "/default-avatar.png"}
        alt={post.author?.name || "User"}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <h2 className="font-bold text-lg">{post.title}</h2>
        <p className="text-gray-600 mt-1">{post.content}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500 flex gap-4">
          <span>Votes: {post.upVote - post.downVote}</span>
          <span>Comments: {post.commentCount}</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
