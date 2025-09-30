import React, { useEffect, useState } from "react";
import Axios from "../../api/Axios"; // Your custom Axios

const Tags = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await Axios.get("/tags"); // Remove /api prefix
        if (Array.isArray(data)) {
          setTags(data);
        } else {
          console.error("Unexpected tags data format:", data);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        setError("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="my-8 px-4 max-w-4xl mx-auto">
        <p className="text-gray-500">Loading tags...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8 px-4 max-w-4xl mx-auto">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-8 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Explore Tags</h2>
      <div className="flex flex-wrap gap-3">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition text-sm font-medium"
            >
              #{tag}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No tags available.</p>
        )}

        {/* Reset filter */}
        {tags.length > 0 && (
          <button
            onClick={() => onTagClick("")}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition text-sm font-medium"
          >
            All Posts
          </button>
        )}
      </div>
    </div>
  );
};

export default Tags;