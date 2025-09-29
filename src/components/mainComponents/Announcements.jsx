import React, { useEffect, useState } from "react";
import AxiosSecure from "../../api/AxiosSecure"; 

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await AxiosSecure.get("/announcements");
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (!announcements.length) return null; 

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-6 max-w-4xl mx-auto rounded-lg">
      <h2 className="font-bold text-lg mb-2">Announcements</h2>
      <ul className="list-disc list-inside space-y-1">
        {announcements.map((a) => (
          <li key={a._id}>
            <strong>{a.title}: </strong>
            <span>{a.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcement;
