import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ComplaintForm from "../components/complaints/ComplaintForm";
import { fetchMyComplaints, submitComplaint } from "../api/complaintApi";
import { fetchAdminComplaints, updateAdminComplaint } from "../api/adminApi";

function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [savingId, setSavingId] = useState("");

  const loadComplaints = () => {
    const request =
      user?.role === "admin" ? fetchAdminComplaints() : fetchMyComplaints();

    request.then((response) => setComplaints(response.data)).catch(() => setComplaints([]));
  };

  useEffect(() => {
    if (user) loadComplaints();
  }, [user]);

  const handleAdminStatusUpdate = async (complaintId, status) => {
    setSavingId(complaintId);
    try {
      await updateAdminComplaint(complaintId, { status });
      loadComplaints();
    } finally {
      setSavingId("");
    }
  };

  if (user?.role === "admin") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Review Complaints</h3>
        <p className="mt-2 text-sm text-slate-600">
          Admin can review user complaints and update their status here.
        </p>
        <div className="mt-6 space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{complaint.subject}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {complaint.user?.name} • {complaint.user?.role} • {complaint.user?.email}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{complaint.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={complaint.status}
                    onChange={(event) => handleAdminStatusUpdate(complaint._id, event.target.value)}
                    disabled={savingId === complaint._id}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ComplaintForm
        onSubmit={async (payload) => {
          await submitComplaint(payload);
          loadComplaints();
        }}
      />

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Complaint History</h3>
        <div className="mt-4 space-y-3">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-slate-900">{complaint.subject}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                  {complaint.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{complaint.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Complaints;
