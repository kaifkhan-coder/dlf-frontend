import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../services/api";

export default function ClaimPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    color: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiGet(`/api/items/${id}`);
        setItem(res.item);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiPost(`/api/claims/${id}`, form);
      alert("✅ Claim submitted successfully");
    } catch (err) {
      alert("Error submitting claim");
    }
  };

  if (!item) return <p className="p-10">Loading NEW PAGE 🚀</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 NEW Claim Page
        </h1>

        <img
          src={item.image || `https://picsum.photos/seed/${item._id}/400/250`}
          className="w-full h-48 object-cover rounded-lg"
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

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Submit Claim
          </button>
        </form>
      </div>
    </div>
  );
}