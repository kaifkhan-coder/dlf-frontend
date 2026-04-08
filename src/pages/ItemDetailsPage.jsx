import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../services/api";
import QRCode from "qrcode";
export default function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState("");
  useEffect(() => {
  if (item?._id) {
    QRCode.toDataURL(`https://dlf-ya3g.vercel.app/claim/${item._id}`)
      .then(setQr)
      .catch(console.error);
  }
}, [item]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet(`/api/items/${id}`);
        setItem(data.item);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-10 text-slate-600">Loading…</div>;
  if (!item) return <div className="p-10 text-slate-600">Item not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/items" className="text-blue-600 font-semibold hover:underline">← Back</Link>

      <div className="mt-4 bg-white border rounded-2xl overflow-hidden">
        <div className="h-72 bg-slate-100">
          <img
            src={item.image || `https://picsum.photos/seed/${item._id}/900/500`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{item.title}</h1>
              <p className="text-slate-600 mt-1">{item.category} • {item.location}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {item.status}
            </span>
          </div>

          <p className="text-slate-700 mt-4">{item.description}</p>
          {/* 🔥 QR CODE SECTION */}
<div className="mt-6 p-4 border rounded-xl bg-slate-50 text-center">
  <h3 className="font-bold text-slate-800 mb-2">Scan to Claim Item</h3>

  {qr ? (
    <img src={qr} alt="QR Code" className="mx-auto w-40 h-40" />
  ) : (
    <p className="text-slate-500 text-sm">Generating QR...</p>
  )}

  <p className="text-xs text-slate-500 mt-2">
    Use this QR to securely claim the item
  </p>
</div>
          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
            <Info label="Type" value={item.type} />
            <Info label="Color" value={item.color || "—"} />
            <Info label="Date" value={item.date || "—"} />
            <Info label="Reporter" value={item.reporterName || "—"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border rounded-xl p-3 bg-white">
      <p className="text-xs text-slate-500 font-bold">{label}</p>
      <p className="text-slate-900 font-semibold mt-1">{value}</p>
    </div>
  );
}
