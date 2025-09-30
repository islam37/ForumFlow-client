import React, { useEffect, useState } from "react";
import AxiosSecure from "../../api/AxiosSecure"; 
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiUserX } from "react-icons/fi";

const ReportedActivities = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await AxiosSecure.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error(" Failed to fetch reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Admin Action (warn, ban, resolve)
  const handleAction = async (id, action) => {
    try {
      await AxiosSecure.patch(`/reports/${id}`, { action });
      fetchReports(); // refresh list after action
    } catch (err) {
      console.error(`❌ Failed to apply action '${action}':`, err);
      alert("Action failed!");
    }
  };

  // Delete report
  const handleDelete = async (id) => {
    try {
      await AxiosSecure.delete(`/reports/${id}`);
      fetchReports();
    } catch (err) {
      console.error("❌ Failed to delete report:", err);
      alert("Failed to delete report!");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading reports...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Reported Activities & Comments
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found ✅</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold">Reporter</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold">Reported User</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold">Reason</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold">Snippet</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{report.reporterEmail}</td>
                  <td className="px-6 py-4">{report.reportedUserEmail}</td>
                  <td className="px-6 py-4">{report.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.contentSnippet || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-lg ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : report.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {/* Warn */}
                    <button
                      onClick={() => handleAction(report._id, "warn")}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                      title="Warn User"
                    >
                      <FiAlertTriangle />
                    </button>

                    {/* Ban */}
                    <button
                      onClick={() => handleAction(report._id, "ban")}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      title="Ban User"
                    >
                      <FiUserX />
                    </button>

                    {/* Resolve */}
                    <button
                      onClick={() => handleAction(report._id, "resolve")}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      title="Resolve Report"
                    >
                      <FiCheckCircle />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      title="Delete Report"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportedActivities;
