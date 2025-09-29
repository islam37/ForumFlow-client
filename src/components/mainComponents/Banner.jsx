import React, { useState } from "react";
import { motion } from "framer-motion";
import AxiosSecure from "../../api/AxiosSecure";

const Banner = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    try {
      const { data } = await AxiosSecure.get(`/search`, {
        params: { tag: search },
      });
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 px-6">
      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to ForumFlow
        </h1>
        <p className="mb-6 text-lg">
          Search posts by tags and explore what interests you!
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full overflow-hidden shadow-lg max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Search by tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-4 py-2 text-gray-700 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 font-semibold rounded-r-full transition"
          >
            Search
          </button>
        </form>
      </motion.div>

      {/* Results Section */}
      <div className="max-w-3xl mx-auto mt-10">
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {results.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
              >
                <h2 className="font-bold text-lg">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          search && (
            <p className="text-center text-white mt-6">
              No results found for <span className="font-semibold">{search}</span>
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Banner;
