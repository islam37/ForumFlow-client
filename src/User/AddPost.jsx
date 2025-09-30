// src/dashboard/AddPost.jsx
import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { AuthContext } from "../components/authComponents/AuthContext";
import Axios from "../api/Axios";

const tags = [
  { value: "general", label: "General" },
  { value: "tech", label: "Tech" },
  { value: "fun", label: "Fun" },
  { value: "news", label: "News" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#7c3aed" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(124,58,237,0.3)" : "none",
    "&:hover": { borderColor: "#7c3aed" },
    borderRadius: "0.5rem",
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

const AddPost = () => {
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      authorImage: "",
      authorName: user?.name || "",
      authorEmail: user?.email || "",
      postTitle: "",
      postDescription: "",
      tag: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      await Axios.post("/posts", {
        ...data,
        tag: data.tag?.value || "general",
        upVote: 0,
        downVote: 0,
        status: "published", // or "draft"
      });

      Swal.fire({
        icon: "success",
        title: "Post Added!",
        text: "Your post was submitted successfully ✅",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
    } catch (err) {
      console.error("Error adding post:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add post ❌",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">✍️ Add a New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Author Image */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Author Image URL
          </label>
          <input
            {...register("authorImage", { required: "Image URL is required" })}
            placeholder="Enter image URL"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          />
          {errors.authorImage && (
            <p className="text-red-500 text-sm">{errors.authorImage.message}</p>
          )}
        </div>

        {/* Author Name */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Author Name</label>
          <input
            {...register("authorName")}
            readOnly
            className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        {/* Author Email */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Author Email</label>
          <input
            {...register("authorEmail")}
            readOnly
            className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        {/* Post Title */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Post Title</label>
          <input
            {...register("postTitle", { required: "Title is required" })}
            placeholder="Enter post title"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 text-black"
          />
          {errors.postTitle && (
            <p className="text-red-500 text-sm">{errors.postTitle.message}</p>
          )}
        </div>

        {/* Post Description */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Post Description
          </label>
          <textarea
            {...register("postDescription", { required: "Description is required" })}
            rows="4"
            placeholder="Write your post..."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 text-black"
          />
          {errors.postDescription && (
            <p className="text-red-500 text-sm">{errors.postDescription.message}</p>
          )}
        </div>

        {/* Tag */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Tag</label>
          <Controller
            name="tag"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={tags}
                styles={customSelectStyles}
                placeholder="Select a tag"
              />
            )}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          ✅ Submit Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
