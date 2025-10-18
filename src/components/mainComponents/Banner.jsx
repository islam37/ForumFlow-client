import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AxiosSecure from "../../api/AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../mainComponents/PostCard";

const fetchSearchResults = async (search) => {
  if (!search.trim()) return { posts: [] };
  const { data } = await AxiosSecure.get("/search", { params: { tag: search } });
  return { posts: data || [] };
};

const Banner = () => {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: results = { posts: [] },
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchPosts", search],
    queryFn: () => fetchSearchResults(search),
    enabled: false,
    retry: 1,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setHasSearched(true);
    await refetch();
  };

  const handleTagClick = (tag) => {
    setSearch(tag);
    setFocused(false);
  };

  const popularTags = ["javascript", "react", "design", "programming", "webdev", "css", "nodejs", "python"];

  const showResults = hasSearched && !isLoading && !isFetching;
  const hasPosts = results?.posts?.length > 0;

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 py-12 px-4 text-center">
        {/* Header Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mb-4">
            Discover Posts
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Search posts by tags and topics
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSearch} className="relative">
            <div
              className={`bg-white/10 backdrop-blur-xl border ${
                focused ? "border-blue-400/50" : "border-white/20"
              } rounded-xl p-1.5 flex items-center transition-all duration-200`}
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  className="w-full bg-transparent text-white px-3 py-2.5 outline-none text-sm placeholder-white/50"
                />
              </div>
              <button
                type="submit"
                disabled={isFetching || !search.trim()}
                className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 rounded-lg font-medium text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                {isFetching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Tag Suggestions */}
            <AnimatePresence>
              {focused && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 z-20"
                >
                  <div className="text-white/60 text-xs mb-2 font-medium">Popular tags:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        type="button"
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/80 text-xs transition-colors duration-150 border border-white/10 hover:border-white/30"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Search Results Section */}
        <div className="max-w-6xl mx-auto mt-8 px-4">
          {/* Loading State */}
          {(isLoading || isFetching) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center space-y-3 py-6"
            >
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/70 text-sm">Searching posts...</p>
            </motion.div>
          )}

          {/* Error State */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-3 py-6 text-red-300"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">Failed to load results</p>
              <p className="text-red-200/80 text-xs">{error?.message || "Please try again"}</p>
            </motion.div>
          )}

          {/* Results Grid */}
          {showResults && hasPosts && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white text-center">
                {results.posts.length} result{results.posts.length > 1 ? 's' : ''} for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  #{search}
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {results.posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </motion.div>
          )}

          {/* No Results State */}
          {showResults && !hasPosts && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-3 py-8 text-white/70"
            >
              <svg className="w-14 h-14 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No posts found</p>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
                #{search}
              </p>
              <p className="text-white/50 text-xs">Try different keywords</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;