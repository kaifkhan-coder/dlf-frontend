// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { apiGet } from "../services/api";
// import QRCode from "qrcode";
// export default function ItemDetailsPage() {
//   const { id } = useParams();
//   const [item, setItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [qr, setQr] = useState("");
//   useEffect(() => {
//   if (item?._id) {
//     QRCode.toDataURL(`https://dlf-frontend-n5gn.vercel.app/claim/${item._id}`)
//       .then(setQr)
//       .catch(console.error);
//   }
// }, [item]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await apiGet(`/api/items/${id}`);
//         setItem(data.item);
//       } catch (e) {
//         console.log(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]);

//   if (loading) return <div className="p-10 text-slate-600">Loading…</div>;
//   if (!item) return <div className="p-10 text-slate-600">Item not found</div>;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <Link to="/items" className="text-blue-600 font-semibold hover:underline">← Back</Link>

//       <div className="mt-4 bg-white border rounded-2xl overflow-hidden">
//         <div className="h-72 bg-slate-100">
//           <img
//             src={item.image || "/no-image.png" || `https://picsum.photos/seed/${item._id}/700/500`}
//             alt={item.title}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="p-6">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <h1 className="text-2xl font-extrabold text-slate-900">{item.title}</h1>
//               <p className="text-slate-600 mt-1">{item.category} • {item.location}</p>
//             </div>
//             <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
//               {item.status}
//             </span>
//           </div>

//           <p className="text-slate-700 mt-4">{item.description}</p>
//           {/* 🔥 QR CODE SECTION */}
// <div className="mt-6 p-4 border rounded-xl bg-slate-50 text-center">
//   <h3 className="font-bold text-slate-800 mb-2">Scan to Claim Item</h3>

//   {qr ? (
//     <img src={qr} alt="QR Code" className="mx-auto w-40 h-40" />
//   ) : (
//     <p className="text-slate-500 text-sm">Generating QR...</p>
//   )}

//   <p className="text-xs text-slate-500 mt-2">
//     Use this QR to securely claim the item
//   </p>
// </div>
//           <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
//             <Info label="Type" value={item.type} />
//             <Info label="Color" value={item.color || "—"} />
//             <Info label="Date" value={item.date || "—"} />
//             <Info label="Reporter" value={item.reporterName || "—"} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div className="border rounded-xl p-3 bg-white">
//       <p className="text-xs text-slate-500 font-bold">{label}</p>
//       <p className="text-slate-900 font-semibold mt-1">{value}</p>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../services/api";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, User, Tag, Palette, Box, Sparkles } from "lucide-react";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (item?._id) {
      QRCode.toDataURL(`https://dlf-frontend-n5gn.vercel.app/claim/${item._id}`)
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
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2ff] font-mono">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl font-bold text-slate-800">LOADING QUEST...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2ff] p-6">
        <div className="text-6xl mb-4">Σ(O_O)</div>
        <h2 className="text-2xl font-black text-slate-900">ITEM NOT FOUND!</h2>
        <Link to="/items" className="mt-4 text-pink-600 font-bold hover:underline">Return to Inventory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf4ff] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] px-4 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Link 
            to="/items" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 rounded-xl font-bold text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <ArrowLeft size={20} /> BACK TO LIST
          </Link>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 bg-white border-4 border-slate-900 rounded-[2.5rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]"
        >
          <div className="relative h-80 md:h-[450px] bg-slate-200 border-b-4 border-slate-900">
            <img
              src={item.image || `https://picsum.photos/seed/${item._id}/800/600`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6">
              <span className={`px-6 py-2 rounded-full text-sm font-black border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] uppercase ${item.status === 'lost' ? 'bg-orange-400' : 'bg-green-400'}`}>
                {item.status}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-yellow-500" size={24} />
                  <span className="text-pink-500 font-black tracking-widest text-sm uppercase">Item Fragment Found</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">{item.title}</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                   <Badge icon={<Tag size={14}/>} text={item.category} color="bg-blue-100" />
                   <Badge icon={<MapPin size={14}/>} text={item.location} color="bg-purple-100" />
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Box size={22} className="text-pink-500" /> DESCRIPTION
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300">
                  {item.description || "No description provided by the traveler."}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard icon={<Box className="text-blue-500"/>} label="Type" value={item.type} />
                  <InfoCard icon={<Palette className="text-pink-500"/>} label="Color" value={item.color || "Unknown"} />
                  <InfoCard icon={<Calendar className="text-green-500"/>} label="Discovered" value={item.date || "—"} />
                  <InfoCard icon={<User className="text-orange-500"/>} label="Reporter" value={item.reporterName || "Anonymous NPC"} />
                </div>
              </div>

              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-6 border-4 border-slate-900 rounded-[2rem] bg-yellow-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-center"
                >
                  <h3 className="font-black text-slate-900 mb-4 text-lg italic uppercase">Special QR Code</h3>
                  
                  <div className="bg-white p-4 border-2 border-slate-900 rounded-2xl inline-block">
                    {qr ? (
                      <img src={qr} alt="QR Code" className="w-40 h-40" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center text-slate-400">Loading...</div>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-500 mt-4 leading-tight">
                    SCAN TO INITIATE <br/> ITEM CLAIM SEQUENCE
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Badge({ icon, text, color }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 border-slate-900 font-bold text-xs ${color}`}>
      {icon} {text}
    </span>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="flex items-center gap-4 p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
    >
      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{label}</p>
        <p className="text-slate-900 font-bold leading-none">{value}</p>
      </div>
    </motion.div>
  );
}