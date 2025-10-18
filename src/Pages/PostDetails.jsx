// components/mainComponents/PostDetails.jsx
import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../components/authComponents/AuthContext";
import { FacebookShareButton, FacebookIcon } from "react-share";
import Axios from "../api/Axios";

// Custom hooks for data management
const usePost = (id) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await Axios.get(`/posts/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

const useVote = (postId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (type) => {
      const { data } = await Axios.put(`/posts/vote/${postId}`, { type });
      return data;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", postId], updatedPost);
    },
  });
};

const useComment = (postId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ comment, userId }) => {
      const { data } = await Axios.post(`/posts/comment/${postId}`, {
        comment: comment.trim(),
        userId,
      });
      return data;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", postId], updatedPost);
    },
  });
};

// Skeleton Loader Component
const PostSkeleton = () => (
  <div className="max-w-3xl mx-auto p-6 space-y-6">
    {/* Post Skeleton */}
    <div className="border rounded-lg p-6 shadow-sm bg-white animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </div>

    {/* Comments Skeleton */}
    <div className="border rounded-lg p-6 shadow-sm bg-white animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ error, onRetry }) => (
  <div className="max-w-3xl mx-auto p-6">
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
      <div className="text-red-600 font-semibold text-lg mb-2">Error</div>
      <div className="text-red-500 mb-6 max-w-md mx-auto">
        {error?.message || "Something went wrong"}
      </div>
      <div className="space-x-4">
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// Post Header Component
const PostHeader = ({ post }) => (
  <div className="flex items-center gap-4 mb-4">
    <img
      src={post.authorImage || "/default-avatar.png"}
      alt={post.authorName}
      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
      onError={(e) => {
        e.target.src = "/default-avatar.png";
      }}
    />
    <div>
      <h4 className="font-bold text-gray-900 text-lg">{post.authorName}</h4>
      <time className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
    </div>
  </div>
);

// Post Stats Component
const PostStats = ({ post, onVote, voting }) => (
  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
    <span className="flex items-center gap-1 font-medium">
      <span className="text-green-500 text-lg">👍</span> 
      {post.upVote || 0} upvotes
    </span>
    <span className="flex items-center gap-1 font-medium">
      <span className="text-red-500 text-lg">👎</span> 
      {post.downVote || 0} downvotes
    </span>
    <span className="flex items-center gap-1 font-medium">
      <span className="text-blue-500 text-lg">💬</span> 
      {post.comments?.length || 0} comments
    </span>
  </div>
);

// Vote Actions Component
const VoteActions = ({ post, onVote, voting, shareUrl }) => (
  <div className="flex items-center gap-4 mt-6 pt-4 border-t">
    <button
      className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
        voting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-500 hover:bg-green-600 shadow-sm hover:shadow-md'
      } text-white`}
      onClick={() => onVote("upvote")}
      disabled={voting}
    >
      👍 Upvote
    </button>
    <button
      className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
        voting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md'
      } text-white`}
      onClick={() => onVote("downvote")}
      disabled={voting}
    >
      👎 Downvote
    </button>

    <FacebookShareButton 
      url={shareUrl} 
      quote={post.postTitle}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <FacebookIcon size={32} round />
      <span className="text-sm text-gray-600 font-medium">Share</span>
    </FacebookShareButton>
  </div>
);

// Comment Component
const CommentItem = ({ comment }) => (
  <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
    <div className="flex items-center gap-3 mb-2">
      <p className="font-semibold text-gray-900">
        {comment.authorName || "Anonymous"}
      </p>
      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
        {new Date(comment.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
      {comment.text}
    </p>
  </div>
);

// Comment Form Component
const CommentForm = ({ onSubmit, loading }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-6">
      <textarea
        className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
        placeholder="Share your thoughts..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={handleKeyPress}
        rows="4"
        disabled={loading}
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">
          Press Enter to post • Shift+Enter for new line
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || !comment.trim()}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            loading || !comment.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
          } text-white`}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
};

// Main Component
const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = usePost(id);

  const voteMutation = useVote(id);
  const commentMutation = useComment(id);

  const handleVote = async (type) => {
    if (!user) {
      alert("Please login to vote!");
      return;
    }
    voteMutation.mutate(type);
  };

  const handleComment = async (commentText) => {
    if (!user) {
      alert("Please login to comment!");
      return;
    }
    commentMutation.mutate({ 
      comment: commentText, 
      userId: user.uid || user._id || user.id 
    });
  };

  if (isLoading) return <PostSkeleton />;

  if (isError) {
    return (
      <ErrorState 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center bg-white rounded-lg border p-8">
          <div className="text-gray-600 text-lg mb-4">Post not found</div>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/post/${id}`;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Post Content */}
      <article className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
        <PostHeader post={post} />
        
        <h1 className="text-2xl font-bold mb-4 text-gray-900 leading-tight">
          {post.postTitle}
        </h1>
        
        <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed text-lg">
          {post.postDescription}
        </p>
        
        {post.tag && (
          <div className="mb-4">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              #{post.tag}
            </span>
          </div>
        )}

        <PostStats post={post} />
        <VoteActions 
          post={post} 
          onVote={handleVote} 
          voting={voteMutation.isLoading}
          shareUrl={shareUrl}
        />
      </article>

      {/* Comments Section */}
      <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
        <h2 className="font-bold text-xl mb-6 text-gray-900">
          Comments ({post.comments?.length || 0})
        </h2>

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {post.comments.map((comment, index) => (
              <CommentItem key={index} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-lg">No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        )}

        {user ? (
          <CommentForm 
            onSubmit={handleComment} 
            loading={commentMutation.isLoading}
          />
        ) : (
          <div className="text-center py-6 border-t border-gray-100">
            <p className="text-gray-500 mb-3">Please login to leave a comment</p>
            <button
              onClick={() => navigate("/login", { state: { from: `/post/${id}` } })}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm"
            >
              Login to Comment
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetails;