// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { apiGet, apiPatch } from "../services/api";
// import {
//   ShieldCheck,
//   Sparkles,
//   Wand2,
//   Package,
//   Search,
//   CheckCircle2,
//   Clock3,
//   RotateCcw,
//   ArrowRight,
//   Box,
//   Layers,
//   Activity
// } from "lucide-react";

// // --- 3D Tilt Component ---
// const TiltCard = ({ children, className = "" }) => {
//   const ref = useRef(null);
//   const [transform, setTransform] = useState(
//     "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
//   );

//   const handleMouseMove = (e) => {
//     if (!ref.current) return;
//     const { left, top, width, height } = ref.current.getBoundingClientRect();
//     const x = (e.clientX - left) / width - 0.5;
//     const y = (e.clientY - top) / height - 0.5;
//     // Invert Y for natural tilt feel
//     const rotateX = y * -10; 
//     const rotateY = x * 10;
//     setTransform(
//       `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
//     );
//   };

//   const handleMouseLeave = () => {
//     setTransform(
//       "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
//     );
//   };

//   return (
//     <div
//       ref={ref}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       className={`transition-all duration-200 ease-out transform-gpu ${className}`}
//       style={{ transform, transformStyle: "preserve-3d" }}
//     >
//       {children}
//     </div>
//   );
// };

// export default function AdminDashboard() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [aiReport, setAiReport] = useState("");
//   const [matches, setMatches] = useState([]);
//   const [show, setShow] = useState(false);
//   const [claims, setClaims] = useState([]);

// const loadClaims = async () => {
//   try {
//     const data = await apiGet("/api/admin/claims");
//     setClaims(data);
//   } catch (err) {
//     console.log(err);
//   }
// };
//   const refresh = async () => {
//     setLoading(true);
//     try {
//       const data = await apiGet("/api/admin/items");
//       setItems(data.items || []);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refresh();
//     loadClaims();
//     setTimeout(() => setShow(true), 100);
//   }, []);

//   // --- Stats ---
//   const stats = useMemo(() => {
//     const total = items.length;
//     const lost = items.filter((i) => i.type === "LOST").length;
//     const found = items.filter((i) => i.type === "FOUND").length;
//     const pending = items.filter((i) => i.status === "PENDING").length;
//     const verified = items.filter((i) => i.status === "VERIFIED").length;
//     const returned = items.filter((i) => i.status === "RETURNED").length;
//     return { total, lost, found, pending, verified, returned };
//   }, [items]);

//   const pendingItems = useMemo(
//     () => items.filter((i) => i.status === "PENDING"),
//     [items]
//   );

//   // --- Approve / Reject / Returned ---
//   const updateStatus = async (id, status) => {
//     try {
//       await apiPatch(`/api/admin/items/${id}/status`, { status });
//       await refresh();
//     } catch (e) {
//       alert(e.message || "Failed");
//     }
//   };

//   // --- AI Report Logic ---
//   const generateAIReport = () => {
//     if (!items.length) {
//       setAiReport("No items yet. Add more reports to generate insights.");
//       return;
//     }
//     const byCategory = {};
//     for (const it of items) {
//       const k = (it.category || "Unknown").toLowerCase();
//       byCategory[k] = (byCategory[k] || 0) + 1;
//     }
//     const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

//     const advice = [
//       `Top category being reported: ${topCat?.[0] || "unknown"} (${topCat?.[1] || 0})`,
//       `Pending approvals: ${stats.pending}`,
//       `Try: enforce "unique proof" (serial/sticker/hidden detail) for claims.`,
//       `Add: auto-expire old posts after 30 days for clean listings.`,
//     ];
//     setAiReport(advice.map((x) => `• ${x}`).join("\n"));
//   };

//   // --- Match Suggestions Logic ---
//   const normalize = (s = "") =>
//     s.toString().trim().toLowerCase().replace(/\s+/g, " ");

//   const hasWordOverlap = (a = "", b = "") => {
//     const A = new Set(normalize(a).split(" ").filter(Boolean));
//     const B = new Set(normalize(b).split(" ").filter(Boolean));
//     let common = 0;
//     for (const w of A) if (B.has(w)) common++;
//     return common;
//   };

//   const similarText = (a = "", b = "") => {
//     const common = hasWordOverlap(a, b);
//     return common >= 1;
//   };

//   const suggestMatches = () => {
//     const lost = items.filter((i) => i.type === "LOST");
//     const found = items.filter((i) => i.type === "FOUND");
//     const suggestions = [];

//     for (const L of lost) {
//       for (const F of found) {
//         let score = 0;
//         if (normalize(L.category) && normalize(L.category) === normalize(F.category)) score += 4;
//         if (similarText(L.title, F.title)) score += 3;
//         if (similarText(L.location, F.location)) score += 2;
//         if (normalize(L.color) && normalize(L.color) === normalize(F.color)) score += 2;
//         if (similarText(L.description, F.description)) score += 2;

//         if (score >= 5) {
//           suggestions.push({ lost: L, found: F, score });
//         }
//       }
//     }
//     suggestions.sort((a, b) => b.score - a.score);
//     setMatches(suggestions.slice(0, 12));
//   };

// const approveClaim = async (id) => {
//   console.log("Approving claim:", id);
//   await apiPatch(`/api/admin/claims/${id}/approve`);
//   loadClaims();
// };

// const rejectClaim = async (id) => {
//   try {
//     console.log("Rejecting claim:", id);

//     const res = await apiPatch(`/api/admin/claims/${id}/reject`);
//     console.log("RESPONSE:", res);

//     await loadClaims();

//   } catch (err) {
//     console.error("❌ REJECT ERROR:", err.message);
//     alert(err.message);
//   }
// };  
//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
//       <div
//         className={`max-w-7xl mx-auto px-4 py-8 md:py-12 transition-all duration-700 ease-out transform ${
//           show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//         }`}
//       >
//         {/* Header Section */}
//         <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
//           <div className="flex items-center gap-4">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
//               <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-200">
//                 <ShieldCheck size={28} />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-4xl font-black tracking-tight text-slate-900">
//                 Admin<span className="text-blue-600">Dashboard</span>
//               </h1>
//               <p className="text-slate-500 font-medium mt-1">
//                 Overview & Intelligence Hub
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <ActionButton
//               onClick={generateAIReport}
//               icon={Sparkles}
//               label="AI Report"
//               variant="dark"
//             />
//             <ActionButton
//               onClick={suggestMatches}
//               icon={Wand2}
//               label="Auto Match"
//               variant="primary"
//             />
//             <ActionButton
//               onClick={refresh}
//               icon={RotateCcw}
//               label="Refresh"
//               variant="outline"
//             />
//           </div>
//         </header>

//         {/* Bento Grid Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Stats Row - Spans full width on mobile, broken into cards */}
//           <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             <StatCard title="Total Items" value={stats.total} icon={Package} color="blue" delay={0} />
//             <StatCard title="Lost" value={stats.lost} icon={Search} color="rose" delay={100} />
//             <StatCard title="Found" value={stats.found} icon={Box} color="emerald" delay={200} />
//             <StatCard title="Pending" value={stats.pending} icon={Clock3} color="amber" delay={300} />
//             <StatCard title="Verified" value={stats.verified} icon={CheckCircle2} color="indigo" delay={400} />
//             <StatCard title="Returned" value={stats.returned} icon={Layers} color="slate" delay={500} />
//           </div>

//           {/* Main Content Area */}
//           <div className="lg:col-span-3 space-y-6">
//             {/* Pending Approvals Section */}
//             <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-slate-200/50 p-6 md:p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//                     <Activity className="text-amber-500" size={24} />
//                     Pending Approvals
//                   </h2>
//                   <p className="text-slate-500 text-sm">Review and verify reported items</p>
//                 </div>
//                 <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
//                   {pendingItems.length} Waiting
//                 </span>
//               </div>

//               {loading ? (
//                 <div className="animate-pulse space-y-4">
//                   {[1, 2].map((i) => (
//                     <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
//                   ))}
//                 </div>
//               ) : pendingItems.length === 0 ? (
//                 <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
//                   <p className="text-slate-400 font-medium">All caught up! No pending items.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingItems.map((it) => (
//                     <PendingItemCard
//                       key={it._id}
//                       item={it}
//                       onUpdate={updateStatus}
//                     />
//                   ))}
//                 </div>
//               )}
//             </section>

//             {/* Match Suggestions Section */}
//             <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-slate-200/50 p-6 md:p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//                     <Wand2 className="text-purple-500" size={24} />
//                     AI Match Suggestions
//                   </h2>
//                   <p className="text-slate-500 text-sm">Potential matches based on description analysis</p>
//                 </div>
//               </div>

//               {matches.length === 0 ? (
//                 <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
//                   <p className="text-slate-400">No matches found yet. Try running the matcher.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {matches.map((m, idx) => (
//                     <MatchCard key={idx} match={m} />
//                   ))}
//                 </div>
//               )}
//             </section>
//           </div>

//           {/* Sidebar: AI Report */}
//           <div className="lg:col-span-1">
//             <TiltCard className="h-full">
//               <div className="h-full bg-slate-900 text-white rounded-3xl p-6 shadow-2xl shadow-slate-900/20 flex flex-col relative overflow-hidden">
//                 {/* Decorative background elements */}
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
//                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
                
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
//                       <Sparkles className="text-yellow-300" size={20} />
//                     </div>
//                     <h2 className="text-xl font-bold">AI Insights</h2>
//                   </div>

//                   <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm min-h-[200px]">
//                     {aiReport ? (
//                       <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
//                         {aiReport}
//                       </pre>
//                     ) : (
//                       <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-sm">
//                         <Sparkles className="mb-2 opacity-50" />
//                         <p>Generate a report to see system insights.</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-6 pt-6 border-t border-white/10">
//                     <p className="text-xs text-slate-500">
//                       * Analysis runs locally in browser.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </TiltCard>
//           </div>
//         </div>
// {claims.map((c) => (
//   <div
//     key={c._id}
//     className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-5 hover:shadow-md transition"
//   >

//     {/* LEFT: ITEM IMAGE */}
//     <img
//       src={c.itemId?.image || "/no-image.png"}
//       alt="item"
//       className="w-32 h-32 object-cover rounded-lg"
//     />

//     {/* CENTER: DETAILS */}
//     <div className="flex-1">
//       <h3 className="text-lg font-bold text-slate-900">
//         {c.itemId?.title || "Unknown Item"} - <span className="text-sm font-medium text-slate-500">{c.status}</span>
//       </h3>

//       <p className="text-sm text-slate-500">
//         Claimed by: {c.userName || "Unknown User"}
//       </p>

//       <p className="text-sm text-slate-500">
//         Student ID: {c.studentId || "N/A"}
//       </p>

//       <p className="text-sm text-slate-600 mt-2">
//         {c.proofText || "No proof details provided."}
//       </p>
//     </div>

//     {/* RIGHT: ACTIONS */}
// <div className="flex flex-col gap-2">

//   {c.status === "pending" && (
//     <>
//       <button
//         onClick={() => approveClaim(c._id)}
//         className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
//       >
//         Approve
//       </button>

//       <button
//         onClick={() => rejectClaim(c._id)}
//         className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold"
//       >
//         Reject
//       </button>
//     </>
//   )}

//   {c.status === "approved" && (
//     <span className="text-green-600 font-bold">✅ Approved</span>
//   )}

//   {c.status === "rejected" && (
//     <span className="text-red-500 font-bold">❌ Rejected</span>
//   )}

// </div>

//   </div>
// ))}
//         <div className="h-20" />
//       </div>
//     </div>
//   );
// }

// // --- Subcomponents ---

// function ActionButton({ onClick, icon: Icon, label, variant }) {
//   const base = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-sm";
//   const variants = {
//     dark: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20",
//     primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/20",
//     outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
//   };

//   return (
//     <button onClick={onClick} className={`${base} ${variants[variant]}`}>
//       <Icon size={18} />
//       <span>{label}</span>
//     </button>
//   );
// }

// function StatCard({ title, value, icon: Icon, color, delay }) {
//   const colors = {
//     blue: "text-blue-600 bg-blue-50",
//     rose: "text-rose-600 bg-rose-50",
//     emerald: "text-emerald-600 bg-emerald-50",
//     amber: "text-amber-600 bg-amber-50",
//     indigo: "text-indigo-600 bg-indigo-50",
//     slate: "text-slate-600 bg-slate-100",
//   };

//   return (
//     <TiltCard className="h-full">
//       <div 
//         className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-full flex flex-col justify-between hover:shadow-md transition-shadow"
//         style={{ animationDelay: `${delay}ms` }}
//       >
//         <div className="flex items-start justify-between mb-2">
//           <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
//           <div className={`p-2 rounded-lg ${colors[color]}`}>
//             <Icon size={16} />
//           </div>
//         </div>
//         <div className="text-3xl font-black text-slate-900">{value}</div>
//       </div>
//     </TiltCard>
//   );
// }

// function PendingItemCard({ item, onUpdate }) {
//   return (
//     <TiltCard>
//       <div className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
//         <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
//           <img
//             src={item.image || "no-image.png" || `https://picsum.photos/seed/${item._id}/400/300`}
//             alt={item.title}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />
//           <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-lg">
//             {item.type}
//           </div>
//         </div>
        
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1">
//             <div className="flex justify-between items-start">
//               <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
//               <Link
//                 to={`/item/${item._id}`}
//                 className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
//               >
//                 View Details
//               </Link>
//             </div>
//             <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
//               <span className="font-medium text-slate-700">{item.category}</span>
//               <span>•</span>
//               <span>{item.location}</span>
//             </p>
//             <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
//               {item.description}
//             </p>
//           </div>

//           <div className="mt-5 flex flex-wrap gap-2">
//             <button
//               onClick={() => onUpdate(item._id, "VERIFIED")}
//               className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition shadow-sm shadow-blue-200"
//             >
//               Approve
//             </button>
//             <button
//               onClick={() => onUpdate(item._id, "REJECTED")}
//               className="flex-1 px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50 active:scale-95 transition"
//             >
//               Reject
//             </button>
//             <button
//               onClick={() => onUpdate(item._id, "RETURNED")}
//               className="flex-1 px-4 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 active:scale-95 transition"
//             >
//               Returned
//             </button>
//           </div>
//         </div>
//       </div>
//     </TiltCard>
//   );
// }

// function MatchCard({ match }) {
//   return (
//     <TiltCard className="h-full">
//       <div className="h-full bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 group">
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//             Match Score
//           </div>
//           <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
//             {match.score}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="relative pl-4 border-l-2 border-rose-200">
//             <div className="text-xs font-bold text-rose-500 mb-1">LOST ITEM</div>
//             <div className="font-semibold text-slate-900 line-clamp-1">{match.lost.title}</div>
//           </div>
          
//           <div className="flex justify-center">
//             <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
//           </div>

//           <div className="relative pl-4 border-l-2 border-emerald-200">
//             <div className="text-xs font-bold text-emerald-500 mb-1">FOUND ITEM</div>
//             <div className="font-semibold text-slate-900 line-clamp-1">{match.found.title}</div>
//           </div>
//         </div>

//         <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
//           <Link to={`/item/${match.lost._id}`} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
//             View Lost
//           </Link>
//           <Link to={`/item/${match.found._id}`} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
//             View Found
//           </Link>
//         </div>
//       </div>
//     </TiltCard>
//   );
// }


// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { apiGet, apiPatch } from "../services/api";
// import {
//   ShieldCheck,
//   Sparkles,
//   Wand2,
//   Package,
//   Search,
//   CheckCircle2,
//   Clock3,
//   RotateCcw,
//   ArrowRight,
//   Box,
//   Layers,
//   Activity,
//   Zap,
//   Star,
//   Flame,
//   BoxIcon
// } from "lucide-react";

// // --- 3D Tilt Component ---
// const TiltCard = ({ children, className = "" }) => {
//   const ref = useRef(null);
//   const [transform, setTransform] = useState(
//     "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
//   );

//   const handleMouseMove = (e) => {
//     if (!ref.current) return;
//     const { left, top, width, height } = ref.current.getBoundingClientRect();
//     const x = (e.clientX - left) / width - 0.5;
//     const y = (e.clientY - top) / height - 0.5;
//     const rotateX = y * -10; 
//     const rotateY = x * 10;
//     setTransform(
//       `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
//     );
//   };

//   const handleMouseLeave = () => {
//     setTransform(
//       "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
//     );
//   };

//   return (
//     <div
//       ref={ref}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       className={`transition-all duration-300 ease-out transform-gpu ${className}`}
//       style={{ transform, transformStyle: "preserve-3d" }}
//     >
//       {children}
//     </div>
//   );
// };

// export default function AdminDashboard() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [aiReport, setAiReport] = useState("");
//   const [matches, setMatches] = useState([]);
//   const [show, setShow] = useState(false);
//   const [claims, setClaims] = useState([]);

//   const loadClaims = async () => {
//     try {
//       const data = await apiGet("/api/admin/claims");
//       setClaims(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const refresh = async () => {
//     setLoading(true);
//     try {
//       const data = await apiGet("/api/admin/items");
//       setItems(data.items || []);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refresh();
//     loadClaims();
//     setTimeout(() => setShow(true), 100);
//   }, []);

//   const stats = useMemo(() => {
//     const total = items.length;
//     const lost = items.filter((i) => i.type === "LOST").length;
//     const found = items.filter((i) => i.type === "FOUND").length;
//     const pending = items.filter((i) => i.status === "PENDING").length;
//     const verified = items.filter((i) => i.status === "VERIFIED").length;
//     const returned = items.filter((i) => i.status === "RETURNED").length;
//     return { total, lost, found, pending, verified, returned };
//   }, [items]);

//   const pendingItems = useMemo(
//     () => items.filter((i) => i.status === "PENDING"),
//     [items]
//   );

//   const updateStatus = async (id, status) => {
//     try {
//       await apiPatch(`/api/admin/items/${id}/status`, { status });
//       await refresh();
//     } catch (e) {
//       alert(e.message || "Failed");
//     }
//   };

//   const generateAIReport = () => {
//     if (!items.length) {
//       setAiReport("No items yet. Add more reports to generate insights.");
//       return;
//     }
//     const byCategory = {};
//     for (const it of items) {
//       const k = (it.category || "Unknown").toLowerCase();
//       byCategory[k] = (byCategory[k] || 0) + 1;
//     }
//     const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

//     const advice = [
//       `Top category: ${topCat?.[0] || "unknown"} (${topCat?.[1] || 0})`,
//       `Pending approvals: ${stats.pending}`,
//       `Enforce "unique proof" for claims.`,
//       `Auto-expire old posts after 30 days.`,
//     ];
//     setAiReport(advice.map((x) => `✨ ${x}`).join("\n"));
//   };

//   const normalize = (s = "") =>
//     s.toString().trim().toLowerCase().replace(/\s+/g, " ");

//   const hasWordOverlap = (a = "", b = "") => {
//     const A = new Set(normalize(a).split(" ").filter(Boolean));
//     const B = new Set(normalize(b).split(" ").filter(Boolean));
//     let common = 0;
//     for (const w of A) if (B.has(w)) common++;
//     return common;
//   };

//   const similarText = (a = "", b = "") => {
//     const common = hasWordOverlap(a, b);
//     return common >= 1;
//   };

//   const suggestMatches = () => {
//     const lost = items.filter((i) => i.type === "LOST");
//     const found = items.filter((i) => i.type === "FOUND");
//     const suggestions = [];

//     for (const L of lost) {
//       for (const F of found) {
//         let score = 0;
//         if (normalize(L.category) && normalize(L.category) === normalize(F.category)) score += 4;
//         if (similarText(L.title, F.title)) score += 3;
//         if (similarText(L.location, F.location)) score += 2;
//         if (normalize(L.color) && normalize(L.color) === normalize(F.color)) score += 2;
//         if (similarText(L.description, F.description)) score += 2;

//         if (score >= 5) {
//           suggestions.push({ lost: L, found: F, score });
//         }
//       }
//     }
//     suggestions.sort((a, b) => b.score - a.score);
//     setMatches(suggestions.slice(0, 12));
//   };

//   const approveClaim = async (id) => {
//     await apiPatch(`/api/admin/claims/${id}/approve`);
//     loadClaims();
//   };

//   const rejectClaim = async (id) => {
//     try {
//       await apiPatch(`/api/admin/claims/${id}/reject`);
//       await loadClaims();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#fdfcf0] text-slate-900 font-sans selection:bg-pink-200 relative overflow-hidden">
//       {/* Anime Background Motifs */}
//       <div className="fixed inset-0 pointer-events-none opacity-20">
//         <div className="absolute top-10 left-10 w-20 h-20 border-4 border-indigo-400 rounded-full animate-pulse" />
//         <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-pink-400 rotate-45" />
//         <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-yellow-400 rounded-full" />
//         <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-indigo-500 clip-path-poly" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
//       </div>

//       {/* Grid Pattern */}
//       <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

//       <div
//         className={`relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12 transition-all duration-1000 ease-out transform ${
//           show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//         }`}
//       >
//         {/* Header Section */}
//         <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
//           <div className="flex items-center gap-6">
//             <div className="relative">
//               <div className="absolute -inset-2 bg-indigo-500 rounded-2xl rotate-6 animate-pulse opacity-20" />
//               <div className="relative h-20 w-20 rounded-2xl bg-indigo-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white flex items-center justify-center">
//                 <ShieldCheck size={40} />
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">System Admin</span>
//                 <div className="h-1 w-12 bg-indigo-500 rounded-full" />
//               </div>
//               <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 italic uppercase">
//                 Dash<span className="text-indigo-600">Board</span>
//               </h1>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4">
//             <ActionButton onClick={generateAIReport} icon={Sparkles} label="AI Insights" variant="anime-pink" />
//             <ActionButton onClick={suggestMatches} icon={Wand2} label="Auto Match" variant="anime-indigo" />
//             <ActionButton onClick={refresh} icon={RotateCcw} label="Refresh" variant="anime-white" />
//           </div>
//         </header>

//         {/* Stats Row */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
//           <StatCard title="Total" value={stats.total} icon={Package} color="indigo" delay={0} />
//           <StatCard title="Lost" value={stats.lost} icon={Search} color="rose" delay={100} />
//           <StatCard title="Found" value={stats.found} icon={BoxIcon} color="emerald" delay={200} />
//           <StatCard title="Pending" value={stats.pending} icon={Clock3} color="amber" delay={300} />
//           <StatCard title="Verified" value={stats.verified} icon={CheckCircle2} color="sky" delay={400} />
//           <StatCard title="Returned" value={stats.returned} icon={Layers} color="slate" delay={500} />
//         </div>

//         {/* Bento Grid Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           <div className="lg:col-span-3 space-y-10">
//             {/* Pending Approvals */}
//             <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 relative overflow-hidden">
//                <div className="absolute top-0 right-0 p-4 opacity-10">
//                   <Flame size={120} className="text-indigo-600" />
//                </div>
              
//               <div className="flex items-center justify-between mb-8 relative z-10">
//                 <div>
//                   <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase italic">
//                     <Activity className="text-pink-500" size={28} />
//                     Pending Items
//                   </h2>
//                   <p className="text-slate-500 font-bold text-sm mt-1">Verification Queue</p>
//                 </div>
//                 <div className="bg-yellow-400 border-2 border-black px-4 py-1 rounded-full text-black font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                   {pendingItems.length} ACTIVE
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="space-y-6">
//                   {[1, 2].map((i) => (
//                     <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse border-2 border-slate-200" />
//                   ))}
//                 </div>
//               ) : pendingItems.length === 0 ? (
//                 <div className="text-center py-16 bg-slate-50 rounded-2xl border-4 border-dashed border-slate-200">
//                   <Star className="mx-auto mb-4 text-slate-300" size={48} />
//                   <p className="text-slate-400 font-black text-xl uppercase italic">All Quiet on the Front!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {pendingItems.map((it) => (
//                     <PendingItemCard key={it._id} item={it} onUpdate={updateStatus} />
//                   ))}
//                 </div>
//               )}
//             </section>

//             {/* Claims Management Section */}
//             <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8">
//               <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase italic mb-8">
//                 <Zap className="text-yellow-500" size={28} />
//                 Recent Claims
//               </h2>
//               <div className="space-y-4">
//                 {claims.map((c) => (
//                   <div
//                     key={c._id}
//                     className="group border-2 border-black rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:translate-x-1 transition-transform bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
//                   >
//                     <div className="relative">
//                       <img
//                         src={c.itemId?.image || "/no-image.png"}
//                         alt="item"
//                         className="w-full md:w-32 h-32 object-cover rounded-xl border-2 border-black"
//                       />
//                       <div className="absolute -top-2 -left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-black">
//                         CLAIM
//                       </div>
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//                           {c.itemId?.title || "Unknown Item"}
//                         </h3>
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded border-2 border-black uppercase ${
//                           c.status === 'pending' ? 'bg-yellow-400' : c.status === 'approved' ? 'bg-green-400' : 'bg-rose-400'
//                         }`}>
//                           {c.status}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm font-bold text-slate-600">
//                         <p className="flex items-center gap-2">User: <span className="text-indigo-600">{c.userName || "Unknown"}</span></p>
//                         <p className="flex items-center gap-2">ID: <span className="text-indigo-600">{c.studentId || "N/A"}</span></p>
//                       </div>

//                       <p className="text-sm text-slate-500 mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 italic">
//                         "{c.proofText || "No proof details provided."}"
//                       </p>
//                     </div>

//                     <div className="flex flex-row md:flex-col justify-center gap-2">
//                       {c.status === "pending" && (
//                         <>
//                           <button
//                             onClick={() => approveClaim(c._id)}
//                             className="flex-1 px-6 py-2 rounded-xl bg-emerald-400 border-2 border-black text-black font-black text-sm hover:-translate-y-1 active:translate-y-0 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
//                           >
//                             APPROVE
//                           </button>
//                           <button
//                             onClick={() => rejectClaim(c._id)}
//                             className="flex-1 px-6 py-2 rounded-xl bg-rose-400 border-2 border-black text-black font-black text-sm hover:-translate-y-1 active:translate-y-0 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
//                           >
//                             REJECT
//                           </button>
//                         </>
//                       )}
//                       {c.status === "approved" && <span className="text-emerald-600 font-black text-center text-xl italic">APPROVED!</span>}
//                       {c.status === "rejected" && <span className="text-rose-500 font-black text-center text-xl italic">REJECTED</span>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </div>

//           {/* Sidebar Area */}
//           <div className="space-y-8">
//             <TiltCard>
//               <div className="bg-slate-900 text-white rounded-3xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] relative overflow-hidden">
//                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-3 mb-8">
//                     <div className="p-3 bg-indigo-600 rounded-xl border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
//                       <Sparkles className="text-yellow-300" size={24} />
//                     </div>
//                     <h2 className="text-2xl font-black uppercase italic tracking-tighter">AI Core</h2>
//                   </div>

//                   <div className="bg-black/40 rounded-2xl p-5 border-2 border-indigo-500/30 min-h-[250px] font-mono">
//                     {aiReport ? (
//                       <div className="space-y-4">
//                         {aiReport.split('\n').map((line, i) => (
//                           <p key={i} className="text-sm text-indigo-100 leading-relaxed animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
//                             {line}
//                           </p>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="h-full flex flex-col items-center justify-center text-center text-indigo-300/50">
//                         <Activity className="mb-4 animate-spin-slow" size={40} />
//                         <p className="text-sm font-bold uppercase tracking-widest">Waiting for input...</p>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
//                     <span className="text-[10px] font-black uppercase text-indigo-400">Status: Online</span>
//                     <div className="h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
//                   </div>
//                 </div>
//               </div>
//             </TiltCard>

//             <section className="bg-pink-100 border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
//               <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase italic mb-6">
//                 <Wand2 className="text-pink-600" size={22} />
//                 Matches
//               </h2>
//               <div className="space-y-4">
//                 {matches.length === 0 ? (
//                   <p className="text-slate-500 text-xs font-bold text-center py-8 border-2 border-dashed border-pink-300 rounded-xl">No matches detected.</p>
//                 ) : (
//                   matches.map((m, idx) => <MatchCard key={idx} match={m} />)
//                 )}
//               </div>
//             </section>
//           </div>
//         </div>
//         <div className="h-20" />
//       </div>
//     </div>
//   );
// }

// // --- Subcomponents ---

// function ActionButton({ onClick, icon: Icon, label, variant }) {
//   const base = "flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase italic tracking-tight transition-all duration-200 active:scale-95 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]";
//   const variants = {
//     "anime-pink": "bg-pink-500 text-white hover:bg-pink-600",
//     "anime-indigo": "bg-indigo-600 text-white hover:bg-indigo-700",
//     "anime-white": "bg-white text-black hover:bg-slate-50"
//   };

//   return (
//     <button onClick={onClick} className={`${base} ${variants[variant]}`}>
//       <Icon size={20} className="stroke-[3px]" />
//       <span>{label}</span>
//     </button>
//   );
// }

// function StatCard({ title, value, icon: Icon, color, delay }) {
//   const colors = {
//     indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
//     rose: "bg-rose-100 text-rose-600 border-rose-200",
//     emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
//     amber: "bg-amber-100 text-amber-600 border-amber-200",
//     sky: "bg-sky-100 text-sky-600 border-sky-200",
//     slate: "bg-slate-100 text-slate-600 border-slate-200",
//   };

//   return (
//     <TiltCard className="h-full">
//       <div 
//         className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 h-full flex flex-col justify-between hover:bg-slate-50 transition-colors"
//         style={{ animationDelay: `${delay}ms` }}
//       >
//         <div className="flex items-start justify-between mb-4">
//           <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</span>
//           <div className={`p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${colors[color]}`}>
//             <Icon size={18} className="stroke-[2.5px]" />
//           </div>
//         </div>
//         <div className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</div>
//       </div>
//     </TiltCard>
//   );
// }

// function PendingItemCard({ item, onUpdate }) {
//   return (
//     <TiltCard>
//       <div className="group bg-white border-2 border-black rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] transition-all duration-300">
//         <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden rounded-xl border-2 border-black">
//           <img
//             src={item.image || `https://picsum.photos/seed/${item._id}/400/300`}
//             alt={item.title}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           />
//           <div className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-[10px] font-black rounded uppercase tracking-widest border border-white/20">
//             {item.type}
//           </div>
//         </div>
        
//         <div className="flex-1 flex flex-col py-2">
//           <div className="flex-1">
//             <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
//               <h3 className="font-black text-2xl text-slate-900 uppercase italic tracking-tight">{item.title}</h3>
//               <Link
//                 to={`/item/${item._id}`}
//                 className="text-[10px] font-black text-indigo-600 uppercase border-2 border-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
//               >
//                 Full Intel
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-2 mb-4">
//               <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100 uppercase">{item.category}</span>
//               <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded border border-slate-100 uppercase">{item.location}</span>
//             </div>
//             <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
//               {item.description}
//             </p>
//           </div>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <button
//               onClick={() => onUpdate(item._id, "VERIFIED")}
//               className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
//             >
//               Verify
//             </button>
//             <button
//               onClick={() => onUpdate(item._id, "REJECTED")}
//               className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-white border-2 border-black text-rose-600 text-xs font-black uppercase tracking-widest hover:bg-rose-50 active:scale-95 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
//             >
//               Reject
//             </button>
//             <button
//               onClick={() => onUpdate(item._id, "RETURNED")}
//               className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-emerald-400 border-2 border-black text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-500 active:scale-95 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
//             >
//               Returned
//             </button>
//           </div>
//         </div>
//       </div>
//     </TiltCard>
//   );
// }

// function MatchCard({ match }) {
//   return (
//     <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-transform group">
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Sync Rate</span>
//         <div className="h-8 w-8 rounded-lg bg-pink-500 border-2 border-black text-white flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//           {match.score}
//         </div>
//       </div>

//       <div className="space-y-3 relative">
//         <div className="h-full w-0.5 bg-slate-100 absolute left-[7px] top-2 -z-0" />
        
//         <div className="relative z-10 flex items-start gap-3">
//           <div className="mt-1.5 h-3 w-3 rounded-full bg-rose-500 border border-black flex-shrink-0" />
//           <div>
//             <div className="text-[9px] font-black text-rose-500 uppercase">Lost</div>
//             <div className="font-bold text-slate-900 text-xs line-clamp-1">{match.lost.title}</div>
//           </div>
//         </div>
        
//         <div className="relative z-10 flex items-start gap-3">
//           <div className="mt-1.5 h-3 w-3 rounded-full bg-emerald-500 border border-black flex-shrink-0" />
//           <div>
//             <div className="text-[9px] font-black text-emerald-500 uppercase">Found</div>
//             <div className="font-bold text-slate-900 text-xs line-clamp-1">{match.found.title}</div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
//         <Link to={`/item/${match.lost._id}`} className="text-[10px] font-black text-indigo-600 hover:text-pink-600 transition-colors uppercase">View Lost</Link>
//         <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
//         <Link to={`/item/${match.found._id}`} className="text-[10px] font-black text-indigo-600 hover:text-pink-600 transition-colors uppercase">View Found</Link>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPatch } from "../services/api";
import {
  ShieldCheck,
  Sparkles,
  Wand2,
  Package,
  Search,
  CheckCircle2,
  Clock3,
  RotateCcw,
  ArrowRight,
  Box,
  Layers,
  Activity,
  Zap,
  Flame,
  Ghost
} from "lucide-react";

// --- 3D Tilt Component ---
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    const rotateX = y * -12; 
    const rotateY = x * 12;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out transform-gpu ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiReport, setAiReport] = useState("");
  const [matches, setMatches] = useState([]);
  const [show, setShow] = useState(false);
  const [claims, setClaims] = useState([]);

  const loadClaims = async () => {
    try {
      const data = await apiGet("/api/admin/claims");
      setClaims(data);
    } catch (err) {
      console.log(err);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/api/admin/items");
      setItems(data.items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    loadClaims();
    setTimeout(() => setShow(true), 100);
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const lost = items.filter((i) => i.type === "LOST").length;
    const found = items.filter((i) => i.type === "FOUND").length;
    const pending = items.filter((i) => i.status === "PENDING").length;
    const verified = items.filter((i) => i.status === "VERIFIED").length;
    const returned = items.filter((i) => i.status === "RETURNED").length;
    return { total, lost, found, pending, verified, returned };
  }, [items]);

  const pendingItems = useMemo(
    () => items.filter((i) => i.status === "PENDING"),
    [items]
  );

  const updateStatus = async (id, status) => {
    try {
      await apiPatch(`/api/admin/items/${id}/status`, { status });
      await refresh();
    } catch (e) {
      alert(e.message || "Failed");
    }
  };

  const generateAIReport = () => {
    if (!items.length) {
      setAiReport(">> SYSTEM_ERROR: No data detected. Please feed the database.");
      return;
    }
    const byCategory = {};
    for (const it of items) {
      const k = (it.category || "Unknown").toLowerCase();
      byCategory[k] = (byCategory[k] || 0) + 1;
    }
    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    const advice = [
      `TARGET_DETECTED: ${topCat?.[0] || "unknown"} (${topCat?.[1] || 0})`,
      `QUEUE_STATUS: ${stats.pending} items awaiting judgment.`,
      `PROTOCOL: Enforce "Unique Proof" verification.`,
      `CLEANUP: Auto-purge old logs after 30 cycles.`,
    ];
    setAiReport(advice.map((x) => `> ${x}`).join("\n"));
  };

  const normalize = (s = "") =>
    s.toString().trim().toLowerCase().replace(/\s+/g, " ");

  const hasWordOverlap = (a = "", b = "") => {
    const A = new Set(normalize(a).split(" ").filter(Boolean));
    const B = new Set(normalize(b).split(" ").filter(Boolean));
    let common = 0;
    for (const w of A) if (B.has(w)) common++;
    return common;
  };

  const similarText = (a = "", b = "") => hasWordOverlap(a, b) >= 1;

  const suggestMatches = () => {
    const lost = items.filter((i) => i.type === "LOST");
    const found = items.filter((i) => i.type === "FOUND");
    const suggestions = [];

    for (const L of lost) {
      for (const F of found) {
        let score = 0;
        if (normalize(L.category) && normalize(L.category) === normalize(F.category)) score += 4;
        if (similarText(L.title, F.title)) score += 3;
        if (similarText(L.location, F.location)) score += 2;
        if (normalize(L.color) && normalize(L.color) === normalize(F.color)) score += 2;
        if (similarText(L.description, F.description)) score += 2;

        if (score >= 5) {
          suggestions.push({ lost: L, found: F, score });
        }
      }
    }
    suggestions.sort((a, b) => b.score - a.score);
    setMatches(suggestions.slice(0, 12));
  };

  const approveClaim = async (id) => {
    await apiPatch(`/api/admin/claims/${id}/approve`);
    loadClaims();
  };

  const rejectClaim = async (id) => {
    try {
      await apiPatch(`/api/admin/claims/${id}/reject`);
      await loadClaims();
    } catch (err) {
      alert(err.message);
    }
  };  

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Anime Background Motif */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,#1e1b4b,transparent)]"></div>
      </div>

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12 transition-all duration-1000 ease-out transform ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity rounded-full animate-pulse" />
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/50">
                <ShieldCheck size={32} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                Admin<span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Terminal</span>
              </h1>
              <p className="text-cyan-500/70 font-mono text-sm tracking-widest uppercase mt-1">
                // Command_Center_v2.0
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton
              onClick={generateAIReport}
              icon={Sparkles}
              label="AI Scan"
              variant="cyan"
            />
            <ActionButton
              onClick={suggestMatches}
              icon={Wand2}
              label="Sync Match"
              variant="magenta"
            />
            <ActionButton
              onClick={refresh}
              icon={RotateCcw}
              label="Reload"
              variant="outline"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard title="Total Logs" value={stats.total} icon={Package} color="cyan" delay={0} />
          <StatCard title="Lost" value={stats.lost} icon={Search} color="rose" delay={100} />
          <StatCard title="Found" value={stats.found} icon={Box} color="emerald" delay={200} />
          <StatCard title="Pending" value={stats.pending} icon={Clock3} color="amber" delay={300} />
          <StatCard title="Verified" value={stats.verified} icon={CheckCircle2} color="indigo" delay={400} />
          <StatCard title="Returned" value={stats.returned} icon={Layers} color="slate" delay={500} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Items */}
            <section className="bg-[#11111d]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Flame size={120} />
              </div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase">
                    <Activity className="text-cyan-400" size={28} />
                    Awaiting Judgment
                  </h2>
                  <p className="text-slate-500 text-sm font-mono tracking-tight">Review incoming reports for verification</p>
                </div>
                <div className="px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black animate-pulse">
                  {pendingItems.length} ACTIVE
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : pendingItems.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <Ghost className="mx-auto text-slate-700 mb-4" size={48} />
                  <p className="text-slate-500 font-mono">SYSTEM_IDLE: No pending data found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingItems.map((it) => (
                    <PendingItemCard
                      key={it._id}
                      item={it}
                      onUpdate={updateStatus}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Claims Section */}
            <section className="bg-[#11111d]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase mb-8">
                <ShieldCheck className="text-emerald-400" size={28} />
                User Claims
              </h2>
              <div className="space-y-4">
                {claims.map((c) => (
                  <div
                    key={c._id}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0">
                      <img
                        src={c.itemId?.image || "/no-image.png"}
                        alt="item"
                        className="w-full h-full object-cover rounded-xl border border-white/10"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-cyan-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {c.status}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {c.itemId?.title || "Unknown Item"}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs font-mono text-slate-400 uppercase tracking-tighter">
                        <p><span className="text-cyan-500">USER:</span> {c.userName || "ANON"}</p>
                        <p><span className="text-cyan-500">ID:</span> {c.studentId || "N/A"}</p>
                      </div>
                      <p className="text-sm text-slate-400 mt-3 line-clamp-2 italic bg-black/30 p-2 rounded border-l-2 border-cyan-500">
                        "{c.proofText || "No proof details provided."}"
                      </p>
                    </div>

                    <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                      {c.status === "pending" && (
                        <>
                          <button
                            onClick={() => approveClaim(c._id)}
                            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-900/20"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectClaim(c._id)}
                            className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-rose-900/20"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {c.status === "approved" && (
                        <span className="text-emerald-400 font-black text-center text-sm animate-pulse">✓ VERIFIED</span>
                      )}
                      {c.status === "rejected" && (
                        <span className="text-rose-500 font-black text-center text-sm">✕ DENIED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* AI Insights */}
            <TiltCard>
              <div className="bg-[#0f172a] text-white rounded-3xl p-6 shadow-2xl border-2 border-cyan-500/30 flex flex-col relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/40 transition-all" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Zap className="text-cyan-400" size={20} />
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">AI_Intelligence</h2>
                  </div>

                  <div className="bg-black/50 rounded-2xl p-5 border border-white/5 font-mono text-xs leading-relaxed min-h-[250px]">
                    {aiReport ? (
                      <div className="text-cyan-400">
                        {aiReport.split('\n').map((line, i) => (
                          <div key={i} className="mb-2 last:mb-0 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                            {line}
                          </div>
                        ))}
                        <div className="mt-4 animate-pulse">_</div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                        <Sparkles className="mb-3 opacity-20" size={32} />
                        <p>AWAITING_SCAN_COMMAND...</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                    <span>Status: Optimized</span>
                    <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Match Suggestions */}
            <section className="bg-[#11111d]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2 italic uppercase mb-6">
                <Wand2 className="text-magenta-500" size={22} />
                Neural Match
              </h2>

              {matches.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-slate-600 text-xs font-mono uppercase">No matches synced</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((m, idx) => (
                    <MatchCard key={idx} match={m} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}

// --- Subcomponents ---

function ActionButton({ onClick, icon: Icon, label, variant }) {
  const base = "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase italic tracking-widest text-xs transition-all duration-300 active:scale-95 shadow-lg relative overflow-hidden group";
  const variants = {
    cyan: "bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-cyan-500/30",
    magenta: "bg-purple-600 text-white hover:bg-purple-500 hover:shadow-purple-500/30",
    outline: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
      <Icon size={16} className="relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color, delay }) {
  const colors = {
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    rose: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    slate: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  };

  return (
    <TiltCard className="h-full">
      <div 
        className="bg-[#161625] rounded-2xl border border-white/5 p-4 h-full flex flex-col justify-between group hover:border-white/20 transition-all"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</span>
          <div className={`p-2 rounded-lg ${colors[color]} border`}>
            <Icon size={14} />
          </div>
        </div>
        <div className="text-3xl font-black text-white group-hover:scale-110 origin-left transition-transform duration-300">{value}</div>
      </div>
    </TiltCard>
  );
}

function PendingItemCard({ item, onUpdate }) {
  return (
    <TiltCard>
      <div className="group bg-[#1a1a2e] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 transition-all duration-300">
        <div className="relative w-full md:w-52 h-44 md:h-auto flex-shrink-0 overflow-hidden rounded-xl bg-black">
          <img
            src={item.image || "no-image.png"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-cyan-600 text-white text-[10px] font-black italic rounded uppercase tracking-widest shadow-lg">
            {item.type}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col py-1">
          <div className="flex-1">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-black text-xl text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight">{item.title}</h3>
              <Link
                to={`/item/${item._id}`}
                className="text-[10px] font-black text-cyan-400 hover:text-white bg-cyan-400/10 hover:bg-cyan-600 px-3 py-1.5 rounded uppercase tracking-tighter border border-cyan-400/20 transition-all"
              >
                Inspect
              </Link>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-2 flex items-center gap-2 uppercase">
              <span className="text-cyan-500/80">{item.category}</span>
              <span className="opacity-30">/</span>
              <span>{item.location}</span>
            </p>
            <p className="text-sm text-slate-400 mt-4 line-clamp-2 leading-relaxed font-medium italic">
              "{item.description}"
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => onUpdate(item._id, "VERIFIED")}
              className="flex-1 min-w-[100px] px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-cyan-900/20"
            >
              Verify
            </button>
            <button
              onClick={() => onUpdate(item._id, "REJECTED")}
              className="flex-1 min-w-[100px] px-4 py-2.5 rounded-lg bg-white/5 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition"
            >
              Reject
            </button>
            <button
              onClick={() => onUpdate(item._id, "RETURNED")}
              className="flex-1 min-w-[100px] px-4 py-2.5 rounded-lg bg-white/5 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition"
            >
              Return
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function MatchCard({ match }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Sync_Probability
        </div>
        <div className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-black text-xs border border-cyan-500/20">
          {match.score * 10}%
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative pl-4 border-l-2 border-rose-500/50">
          <div className="text-[9px] font-black text-rose-500 mb-1 uppercase tracking-widest">Target_Lost</div>
          <div className="font-bold text-white text-sm line-clamp-1 italic">{match.lost.title}</div>
        </div>
        
        <div className="flex justify-center py-1">
          <div className="bg-cyan-500/10 p-1.5 rounded-full">
            <ArrowRight className="text-cyan-400 group-hover:translate-x-1 transition-transform" size={16} />
          </div>
        </div>

        <div className="relative pl-4 border-l-2 border-emerald-500/50">
          <div className="text-[9px] font-black text-emerald-500 mb-1 uppercase tracking-widest">Target_Found</div>
          <div className="font-bold text-white text-sm line-clamp-1 italic">{match.found.title}</div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
        <Link to={`/item/${match.lost._id}`} className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-tighter transition">
          View_Lost
        </Link>
        <Link to={`/item/${match.found._id}`} className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-tighter transition">
          View_Found
        </Link>
      </div>
    </div>
  );
}