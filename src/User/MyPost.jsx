
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/authComponents/AuthContext";
import Axios from "../api/Axios";
import { FiTrash2, FiEdit } from "react-icons/fi";
import Select from "react-select";
import Swal from "sweetalert2";

const tags = [
  { value: "general", label: "General" },
  { value: "tech", label: "Tech" },
  { value: "fun", label: "Fun" },
  { value: "news", label: "News" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
];

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    borderColor: "#d1d5db",
    padding: "2px",
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

const MyPost = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    postTitle: "",
    postDescription: "",
    tag: "",
    authorImage: "",
  });

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const res = await Axios.get(`/posts?email=${user.email}`);
        // Ensure posts is always an array
        const data = Array.isArray(res.data) ? res.data : res.data.posts || [];
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        Swal.fire("Error", "Failed to fetch your posts.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user?.email]);

  // Delete post
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await Axios.delete(`/posts/${id}`);
        setPosts(posts.filter((post) => post._id !== id));
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting post:", err);
        Swal.fire("Error!", "Failed to delete post.", "error");
      }
    }
  };

  // Open edit modal
  const handleEditClick = (post) => {
    setEditingPost(post);
    setFormData({
      postTitle: post.postTitle,
      postDescription: post.postDescription,
      tag: post.tag || "",
      authorImage: post.authorImage || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await Axios.put(`/posts/${editingPost._id}`, formData);
      setPosts(
        posts.map((p) => (p._id === editingPost._id ? { ...p, ...formData } : p))
      );
      setEditingPost(null);
      Swal.fire("Updated!", "Your post has been updated.", "success");
    } catch (err) {
      console.error("Error updating post:", err);
      Swal.fire("Error!", "Failed to update post.", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading your posts...</p>
      </div>
    );

  if (!posts.length)
    return (
      <div className="text-center p-10">
        <p className="text-gray-600 text-lg">
          😕 You haven't created any posts yet.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📄 My Posts</h2>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm flex items-start gap-4"
          >
            {post.authorImage && (
              <img
                src={post.authorImage}
                alt={post.authorName}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-black">{post.postTitle}</h3>
              <p className="text-gray-700 mt-1">{post.postDescription}</p>
              <span className="inline-block mt-2 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                #{post.tag || "general"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(post)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit Post"
              >
                <FiEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-500 hover:text-red-700"
                title="Delete Post"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">✏️ Edit Post</h3>

            <input
              type="text"
              name="postTitle"
              placeholder="Title"
              value={formData.postTitle}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-3 rounded text-black"
            />
            <textarea
              name="postDescription"
              placeholder="Description"
              value={formData.postDescription}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-3 rounded text-black"
              rows={4}
            />

            <Select
              options={tags}
              value={tags.find((t) => t.value === formData.tag)}
              onChange={(selected) =>
                setFormData({ ...formData, tag: selected.value })
              }
              styles={customSelectStyles}
              placeholder="Select a tag"
              className="mb-3"
            />

            <input
              type="text"
              name="authorImage"
              placeholder="Author Image URL"
              value={formData.authorImage}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-3 rounded text-black"
            />

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPost;
