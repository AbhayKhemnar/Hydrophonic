import { useState } from "react";

function ComplaintForm({ onSubmit }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ subject, message });
    setSubject("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">Submit Complaint</h3>
      <input
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2.5"
        placeholder="Subject"
        required
      />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="mt-4 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2.5"
        placeholder="Describe your issue"
        required
      />
      <button className="mt-4 rounded-lg bg-slate-950 px-4 py-2.5 font-semibold text-white">
        Send Complaint
      </button>
    </form>
  );
}

export default ComplaintForm;
