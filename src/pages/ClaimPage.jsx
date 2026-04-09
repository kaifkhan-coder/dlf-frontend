import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../services/api";

export default function ClaimPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiPost(`/api/claims`, {
  itemId: id,
  userName: form.name,
  studentId: form.email,
  proofText: form.description
});
        setItem(res.item);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting...", form);

  try {
    const res = await apiPost(`/api/claims`, { ...form, itemId: id });
    console.log("Response:", res);
    setMsg("✅ Claim submitted successfully");
  } catch (err) {
    console.error("ERROR:", err);
    setMsg(err.message || "Error submitting claim");
  }
};

  if (!item) return <p className="p-10">Loading NEW PAGE 🚀</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full">
        
        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 NEW Claim Page
        </h1>

        {/* ✅ FIXED IMAGE */}
        <img
          src={item.image || "/no-image.png"}
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        <h2 className="text-xl font-bold mt-3">{item.title}</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Your Name"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Your Email"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <textarea
            placeholder="Describe item"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Submit Claim
          </button>
        </form>

      </div>
    </div>
  );
}