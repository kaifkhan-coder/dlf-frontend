import React, { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../services/api";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);

  const loadClaims = async () => {
    const data = await apiGet("/api/claims");
    setClaims(data);
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleApprove = async (id) => {
    await apiPatch(`/api/claims/${id}/approve`);
    loadClaims();
  };

  const handleReject = async (id) => {
    await apiPatch(`/api/claims/${id}/reject`);
    loadClaims();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Claims</h1>

      {claims.map((c) => (
        <div key={c._id} className="border p-4 mb-3 rounded-xl">
          <p><b>Item:</b> {c.itemId?.title}</p>
          <p><b>User:</b> {c.userName}</p>
          <p><b>Proof:</b> {c.proofText}</p>

          <p className="mt-2">
            Status: <b>{c.status}</b>
          </p>

          {c.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleApprove(c._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(c._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}