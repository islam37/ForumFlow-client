import React, { useEffect, useState } from "react";
import AxiosSecure from "../../api/AxiosSecure"; 

const Tags = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await AxiosSecure.get("/tags");
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="my-8 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Explore Tags</h2>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tags;
