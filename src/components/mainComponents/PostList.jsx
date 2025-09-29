// components/mainComponents/PostsList.jsx
import React, { useState, useEffect } from "react";
import AxiosSecure from "../../api/AxiosSecure";
import PostCard from "./PostCard";
import Pagination from "./Pagination";

const PostsList = ({ selectedTag }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 5, sort };
        if (selectedTag) params.tag = selectedTag;

        const { data } = await AxiosSecure.get("/posts", { params });
        setPosts(data.posts);
        setPages(data.pages);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, sort, selectedTag]);

  // Reset page to 1 if tag changes
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
        <p className="text-center">Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No posts found {selectedTag && `for #${selectedTag}`}
        </p>
      )}

      {/* Pagination */}
      {pages > 1 && <Pagination page={page} pages={pages} onPageChange={setPage} />}
    </div>
  );
};

export default PostsList;
