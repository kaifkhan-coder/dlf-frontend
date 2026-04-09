// import React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { MapPin, ShieldCheck, X, Copy } from "lucide-react";
// import { useParams } from "react-router-dom";

// export default function ClaimModal({ open, onClose, item }) {
//   const referenceId = item?._id || item?.id || "";
//   const {id} = useParams();


//   const copyRef = async () => {
//     try {
//       await navigator.clipboard.writeText(String(referenceId));
//     } catch {}
//   };

//   return (
//     <AnimatePresence>
//       {open && item && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />
          

//           {/* Modal */}
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0, y: 20, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.98 }}
//           >
//             <div
//               className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950 text-white shadow-2xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Top bar */}
//               <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-white/10">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
//                     <ShieldCheck className="h-5 w-5 text-blue-300" />
//                   </div>
//                   <div>
//                     <p className="font-extrabold text-lg leading-tight">Claim Instructions</p>
//                     <p className="text-white/70 text-sm">CampusTrace Security Desk</p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={onClose}
//                   className="h-10 w-10 rounded-2xl hover:bg-white/10 flex items-center justify-center transition"
//                   aria-label="Close"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               {/* Body */}
//               <div className="px-6 py-5 space-y-4">
//                 <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
//                   <p className="text-white/90">
//                     To claim <span className="font-bold">{item.title}</span>, please visit
//                     <span className="font-bold"> Campus Security</span> with your ID.
//                   </p>

//                   <div className="mt-3 flex items-center gap-2 text-white/80 text-sm">
//                     <MapPin className="h-4 w-4" />
//                     <span>
//                       Visit: <span className="font-semibold">{item.securityDesk || "Main Security Office"}</span>
//                     </span>
//                   </div>
//                 </div>

//                 {/* Reference ID */}
//                 <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-3">
//                   <div>
//                     <p className="text-xs uppercase tracking-wider text-white/60 font-bold">Reference ID</p>
//                     <p className="font-extrabold text-white">{String(referenceId)}</p>
//                   </div>

//                   <button
//                     onClick={copyRef}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold hover:opacity-90 transition"
//                   >
//                     <Copy className="h-4 w-4" />
//                     Copy
//                   </button>
//                 </div>

//                 <p className="text-xs text-white/60">
//                   Tip: Bring any proof like sticker/serial number for faster verification.
//                 </p>
//               </div>

//               {/* Footer */}
//               <div className="px-6 py-5 border-t border-white/10 flex gap-3 justify-end">
//                 <button
//                   onClick={onClose}
//                   className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold transition"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../services/api";
import { apiPost } from "../services/api";

export default function ClaimItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  const [form, setForm] = useState({
    userName: "",
    studentId: "",
    proofText: ""
  });

  const [msg, setMsg] = useState("");

useEffect(() => {
  const load = async () => {
    try {
      const res = await apiGet(`/api/items/${id}`);
      setItem(res.item);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load item ❌");
    }
  };
  load();
}, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.userName || !form.studentId || !form.proofText) {
    setMsg("Please fill all fields ❗");
    return;
  }

  try {
    const res = await apiPost("/api/claims", {
      itemId: id,
      ...form
    });

    setMsg(res.message || "Claim submitted ✅");
  } catch (err) {
    setMsg(err.message || "Submission failed ❌");
  }
};

  if (!item) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">

<img
  src={item.image || "https://via.placeholder.com/400x200"}
  className="w-full h-56 object-cover"
  alt="item"
/>

        <div className="p-5">
          <h1 className="text-xl font-bold">{item.title}</h1>

          <p className="text-sm text-slate-600">
            {item.location}
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">

            <input
              placeholder="Your Name"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setForm({...form, userName: e.target.value})}
            />

            <input
              placeholder="Student ID"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setForm({...form, studentId: e.target.value})}
            />

            <textarea
              placeholder="Proof details"
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setForm({...form, proofText: e.target.value})}
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
              Submit Claim
            </button>

          </form>

          {msg && (
            <p className="mt-3 text-center text-green-600 font-semibold">
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}