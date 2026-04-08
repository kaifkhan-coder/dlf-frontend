import React, { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../services/api";

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    apiGet("/api/claims").then(setClaims);
  }, []);

  const updateStatus = async (id, status) => {
    await apiPatch(`/api/claims/${id}`, { status });
    alert("Updated");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">All Claims</h1>

      {claims.map((c) => (
        <div key={c._id} className="border p-4 mt-4 rounded">
          <p><b>Item:</b> {c.itemId?.title}</p>
          <p><b>User:</b> {c.name}</p>
          <p><b>Color:</b> {c.color}</p>
          <p><b>Description:</b> {c.description}</p>
          <p><b>Status:</b> {c.status}</p>

          <button onClick={() => updateStatus(c._id, "APPROVED")} className="bg-green-500 text-white px-3 py-1 m-1">
            Approve
          </button>

          <button onClick={() => updateStatus(c._id, "REJECTED")} className="bg-red-500 text-white px-3 py-1 m-1">
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}