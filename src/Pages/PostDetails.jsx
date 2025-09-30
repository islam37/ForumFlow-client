import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosSecure from "../api/AxiosSecure";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { FiThumbsUp, FiThumbsDown, FiMessageSquare } from "react-icons/fi";

const PostDetails = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch single post
  const fetchPost = async () => {
    try {
      const { data } = await AxiosSecure.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Vote handling
  const handleVote = async (type) => {
    if (!user) return alert("Login to vote!");
    try {
      await AxiosSecure.patch(`/posts/${id}/vote`, { type });
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  // Comment submission
  const handleComment = async () => {
    if (!user) return alert("Login to comment!");
    if (!comment.trim()) return;
    try {
      await AxiosSecure.post(`/posts/${id}/comment`, {
        userId: user._id,
        comment,
      });
      setComment("");
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!post) return <p className="text-center mt-6">Post not found</p>;

  const shareUrl = `${window.location.origin}/post/${post._id}`;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Post Details */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={post.author?.avatar || "/default-avatar.png"}
            alt={post.author?.name}
            className="w-12 h-12 rounded-full"
          />
          <span className="font-semibold">{post.author?.name}</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-700 mb-2">{post.content}</p>

        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => handleVote("upvote")}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded hover:bg-green-200 transition"
          >
            <FiThumbsUp /> {post.upVote}
          </button>
          <button
            onClick={() => handleVote("downvote")}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded hover:bg-red-200 transition"
          >
            <FiThumbsDown /> {post.downVote}
          </button>

          <FacebookShareButton url={shareUrl} quote={post.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={post.title}
            separator=" - "
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <TwitterShareButton url={shareUrl} title={post.title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </div>

      {/* Comment Section */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="font-semibold mb-4">Comments ({post.commentCount})</h2>

        {user ? (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow border rounded px-2 py-1"
            />
            <button
              onClick={handleComment}
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Comment
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">Login to comment</p>
        )}

        <div className="space-y-2">
          {post.comments?.map((c) => (
            <div key={c._id} className="border-b pb-2">
              <span className="font-semibold">{c.userId}</span>: {c.comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
