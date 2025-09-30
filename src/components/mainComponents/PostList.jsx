// components/mainComponents/PostsList.jsx
import React, { useState, useEffect } from "react";
import axios from "../../api/Axios";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import Swal from "sweetalert2";

const PostsList = ({ selectedTag }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 5, sort };
      if (selectedTag) params.tag = selectedTag;

      const { data } = await axios.get("/posts", { params });

      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
        setPages(data.pages || 1);
      } else {
        setPosts([]);
        setPages(1);
        console.error("Unexpected posts data:", data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load posts!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when page, sort, or selectedTag changes
  useEffect(() => {
    fetchPosts();
  }, [page, sort, selectedTag]);

  // Reset page to 1 when tag changes
  useEffect(() => {
    setPage(1);
  }, [selectedTag]);

  return (
    <div className="max-w-4xl mx-auto my-6">
      {/* Sort Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSort(sort === "recent" ? "popularity" : "recent")}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          Sort by {sort === "recent" ? "Popularity" : "Newest"}
        </button>
      </div>

      {/* Posts */}
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No posts found {selectedTag && `for #${selectedTag}`}
        </p>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      )}
    </div>
  );
};

export default PostsList;