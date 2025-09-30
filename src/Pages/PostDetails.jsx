// components/mainComponents/PostDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../api/Axios"; 
import { AuthContext } from "../components/authComponents/AuthContext";
import { FacebookShareButton, FacebookIcon } from "react-share";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);
  const [commenting, setCommenting] = useState(false);

  // Fetch post details
  useEffect(() => {
    if (!id) {
      setError("Post ID is required");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await Axios.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        if (err.response?.status === 404) {
          setError("Post not found");
        } else {
          setError("Failed to load post. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Handle upvote/downvote
  const handleVote = async (type) => {
    if (!user) {
      alert("Please login to vote!");
      return;
    }

    if (voting) return;

    try {
      setVoting(true);
      const res = await Axios.put(`/posts/vote/${id}`, { type });
      setPost(res.data);
    } catch (err) {
      console.error("Failed to vote:", err);
      alert("Failed to vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  // Handle comment submit
  const handleComment = async () => {
    if (!user) {
      alert("Please login to comment!");
      return;
    }

    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    if (commenting) return;

    try {
      setCommenting(true);
      const res = await Axios.post(`/posts/comment/${id}`, { 
        comment: comment.trim(), 
        userId: user.uid || user._id || user.id
      });
      setPost(res.data);
      setComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setCommenting(false);
    }
  };

  // Handle Enter key for comment submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <div>Loading post...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">Error</div>
          <div className="text-red-500 mb-4">{error}</div>
          <div className="space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center text-gray-600 mb-4">Post not found</div>
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/post/${id}`;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Post Details */}
      <div className="border rounded-lg p-6 mb-6 shadow-sm bg-white">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={post.authorImage || "/default-avatar.png"}
            alt={post.authorName}
            className="w-12 h-12 rounded-full object-cover border"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div>
            <h4 className="font-bold text-gray-900">{post.authorName}</h4>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3 text-gray-900">{post.postTitle}</h2>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.postDescription}</p>
        
        {post.tag && (
          <div className="mb-4">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              #{post.tag}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <span className="text-green-500">👍</span> {post.upVote || 0} upvotes
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-500">👎</span> {post.downVote || 0} downvotes
          </span>
          <span className="flex items-center gap-1">
            💬 {post.comments ? post.comments.length : 0} comments
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t">
          <button
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              voting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
            onClick={() => handleVote("upvote")}
            disabled={voting}
          >
            👍 Upvote {post.upVote || 0}
          </button>
          <button
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              voting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors`}
            onClick={() => handleVote("downvote")}
            disabled={voting}
          >
            👎 Downvote {post.downVote || 0}
          </button>

          <FacebookShareButton 
            url={shareUrl} 
            quote={post.postTitle}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <FacebookIcon size={32} round />
            <span className="text-sm text-gray-600">Share</span>
          </FacebookShareButton>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <h3 className="font-bold text-xl mb-4 text-gray-900">
          Comments ({post.comments ? post.comments.length : 0})
        </h3>

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {post.comments.map((comment, idx) => (
              <div key={idx} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-gray-900">
                    {comment.authorName || "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}

        {user ? (
          <div className="mt-4">
            <textarea
              className="border rounded-lg w-full p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="3"
              disabled={commenting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                Press Enter to post, Shift+Enter for new line
              </span>
              <button
                onClick={handleComment}
                disabled={commenting || !comment.trim()}
                className={`px-6 py-2 rounded-lg text-white ${
                  commenting || !comment.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {commenting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 border-t">
            <p className="text-gray-500 mb-2">Please login to leave a comment</p>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;