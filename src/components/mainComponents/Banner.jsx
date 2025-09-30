import React, { useState } from "react";
import { motion } from "framer-motion";
import AxiosSecure from "../../api/AxiosSecure";

const Banner = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 py-24 px-6">
        {/* Main Banner Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/80 font-medium">
              Explore thousands of discussions
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight"
          >
            Welcome to
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ForumFlow
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Discover, discuss, and connect with communities that share your passions and interests
          </motion.p>

          {/* Premium Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
              {/* Search Input Container */}
              <div className={`relative bg-white/10 backdrop-blur-xl border ${
                isFocused ? 'border-blue-400/50 shadow-2xl shadow-blue-500/20' : 'border-white/20 shadow-lg'
              } rounded-2xl transition-all duration-300 overflow-hidden`}>
                <input
                  type="text"
                  placeholder="Search by tags (e.g., javascript, react, design)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-6 py-5 bg-transparent text-white placeholder-white/60 outline-none text-lg font-medium"
                />
                
                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Search
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>

              {/* Search Suggestions */}
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="text-white/60 text-sm mb-2">Popular tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {['javascript', 'react', 'design', 'programming', 'webdev', 'css'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearch(tag)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/80 text-sm transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex justify-center gap-8 mt-12 text-white/60"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm">Active Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5K+</div>
              <div className="text-sm">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm">Daily Posts</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16"
        >
          {loading ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white font-medium">Searching discussions...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Found {results.length} results
                </h2>
                <p className="text-white/60">For tag: <span className="text-blue-400 font-semibold">#{search}</span></p>
              </div>
              
              {results.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="font-bold text-xl text-white group-hover:text-blue-200 transition-colors mb-3">
                        {post.title}
                      </h2>
                      <p className="text-white/70 leading-relaxed mb-4">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            search && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-white/60">
                  No discussions found for tag{" "}
                  <span className="text-blue-400 font-semibold">#{search}</span>. Try a different tag!
                </p>
              </motion.div>
            )
          )}
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-4 h-4 bg-blue-400/30 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-6 h-6 bg-purple-400/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-3 h-3 bg-pink-400/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default Banner;