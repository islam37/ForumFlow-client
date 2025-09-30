import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import AxiosSecure from "../../api/AxiosSecure";
import { auth } from "../../Firebase/Firebase.Config";

const MakeAnnouncement = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [authorImage, setAuthorImage] = React.useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAuthorImage(user.photoURL || "");
      reset({ authorName: user.displayName || user.email.split("@")[0] });
    }
  }, [reset]);

  const onSubmit = async (data) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await AxiosSecure.post("/announcements", { ...data, authorImage, createdAt: new Date() });
      setSuccessMsg("Announcement posted successfully!");
      reset({ authorName: data.authorName, title: "", description: "" });
      setAuthorImage(data.authorImage);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to post announcement. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Make Announcement</h2>

      {successMsg && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMsg}</p>}
      {errorMsg && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 rounded-xl shadow-lg">
        {/* Author Image & Name */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {authorImage ? (
              <img src={authorImage} alt="Author" className="w-16 h-16 rounded-full object-cover border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">?</div>
            )}
          </div>
          <div className="flex-1">
            <label className="block font-medium text-gray-700 mb-1">Author Name</label>
            <input
              type="text"
              {...register("authorName", { required: "Author name is required" })}
              className="w-full border border-gray-300 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.authorName && <span className="text-red-500 text-sm">{errors.authorName.message}</span>}
          </div>
        </div>

        {/* Author Image URL */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Author Image URL</label>
          <input
            type="text"
            value={authorImage}
            onChange={(e) => setAuthorImage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full border border-gray-300 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter announcement title"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows="5"
            className="w-full border border-gray-300 p-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Write your announcement..."
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-purple-600 text-white font-medium py-3 rounded-lg hover:bg-purple-700 transition ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Posting..." : "Post Announcement"}
        </button>
      </form>
    </div>
  );
};

export default MakeAnnouncement;
