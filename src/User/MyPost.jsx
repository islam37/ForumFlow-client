import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../components/authComponents/AuthContext";
import Axios from "../api/Axios";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import Select from "react-select";
import Swal from "sweetalert2";

// Constants
const TAGS = [
  { value: "general", label: "General" },
  { value: "tech", label: "Tech" },
  { value: "fun", label: "Fun" },
  { value: "news", label: "News" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
];

const CUSTOM_SELECT_STYLES = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    borderColor: "#d1d5db",
    padding: "2px",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#7c3aed"
      : state.isFocused
      ? "#ede9fe"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    cursor: "pointer",
  }),
};

// Custom Hooks
const useUserPosts = (userEmail) => {
  return useQuery({
    queryKey: ["user-posts", userEmail],
    queryFn: async () => {
      const { data } = await Axios.get(`/posts?email=${userEmail}`);
      return Array.isArray(data) ? data : data.posts || [];
    },
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId) => {
      await Axios.delete(`/posts/${postId}`);
      return postId;
    },
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData(["user-posts"], (oldPosts = []) =>
        oldPosts.filter(post => post._id !== deletedPostId)
      );
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      Swal.fire("Error!", "Failed to delete post.", "error");
    },
  });
};

const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, formData }) => {
      const { data } = await Axios.put(`/posts/${postId}`, formData);
      return data;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["user-posts"], (oldPosts = []) =>
        oldPosts.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      Swal.fire("Updated!", "Your post has been updated.", "success");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      Swal.fire("Error!", "Failed to update post.", "error");
    },
  });
};

// Skeleton Loader Component
const PostSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="border border-gray-300 p-4 rounded-lg shadow-sm animate-pulse"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="text-center p-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-purple-100">
      <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts yet</h3>
    <p className="text-gray-600 text-lg max-w-md mx-auto">
      You haven't created any posts yet. Start sharing your thoughts with the community!
    </p>
  </div>
);

// Post Card Component
const PostCard = ({ post, onEdit, onDelete, onView }) => (
  <div className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
    <div className="flex items-start gap-4">
      {post.authorImage ? (
        <img
          src={post.authorImage}
          alt={post.authorName}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm flex-shrink-0">
          {post.authorName?.charAt(0) || "U"}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.postTitle}
        </h3>
        <p className="text-gray-700 mb-3 line-clamp-3 leading-relaxed">
          {post.postDescription}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <span className="text-green-500">👍</span> {post.upVote || 0}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-500">👎</span> {post.downVote || 0}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-blue-500">💬</span> {post.comments?.length || 0}
          </span>
        </div>

        {post.tag && (
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
            #{post.tag}
          </span>
        )}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onView(post)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          title="View Post"
        >
          <FiEye size={18} />
        </button>
        <button
          onClick={() => onEdit(post)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          title="Edit Post"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(post._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="Delete Post"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

// Edit Modal Component
const EditModal = ({ post, onClose, onUpdate, isUpdating }) => {
  const [formData, setFormData] = useState({
    postTitle: post.postTitle,
    postDescription: post.postDescription,
    tag: post.tag || "",
    authorImage: post.authorImage || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(post._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Edit Post</h3>
          <p className="text-gray-600 mt-1">Update your post information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              name="postTitle"
              value={formData.postTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="postDescription"
              value={formData.postDescription}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
              placeholder="Enter post description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag
            </label>
            <Select
              options={TAGS}
              value={TAGS.find((t) => t.value === formData.tag)}
              onChange={(selected) =>
                setFormData({ ...formData, tag: selected.value })
              }
              styles={CUSTOM_SELECT_STYLES}
              placeholder="Select a tag"
              isSearchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Image URL
            </label>
            <input
              type="url"
              name="authorImage"
              value={formData.authorImage}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const MyPost = () => {
  const { user } = React.useContext(AuthContext);
  const [editingPost, setEditingPost] = useState(null);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUserPosts(user?.email);

  const deleteMutation = useDeletePost();
  const updateMutation = useUpdatePost();

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(postId);
    }
  };

  const handleUpdate = (postId, formData) => {
    updateMutation.mutate(
      { postId, formData },
      {
        onSuccess: () => {
          setEditingPost(null);
        },
      }
    );
  };

  const handleViewPost = (post) => {
    // Navigate to post details page
    window.location.href = `/post/${post._id}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">
            Failed to load posts
          </div>
          <p className="text-red-500 mb-6">{error.message}</p>
          <button
            onClick={refetch}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Posts</h2>
            <p className="text-gray-600 mt-2">
              Manage and edit your published posts
            </p>
          </div>
          {posts.length > 0 && (
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          )}
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onEdit={setEditingPost}
                onDelete={handleDelete}
                onView={handleViewPost}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingPost && (
          <EditModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onUpdate={handleUpdate}
            isUpdating={updateMutation.isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default MyPost;