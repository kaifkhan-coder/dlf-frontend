// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   LogOut,
//   Plus,
//   Search,
//   MapPin,
//   Tag,
//   Loader2,
//   LayoutGrid,
//   AlertCircle,
//   User as UserIcon,
//   ChevronRight
// } from "lucide-react";
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
// import { apiGet } from "../services/api";
// import TiltCard from "./TiltCardUser";

// // --- Utility ---
// function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// // --- Components ---

// const StatusBadge = ({ status }) => {
//   const styles = {
//     PENDING: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
//     VERIFIED: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
//     RETURNED: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
//     REJECTED: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
//     DEFAULT: "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20",
//   };

//   const activeStyle = styles[status] || styles.DEFAULT;

//   return (
//     <span
//       className={cn(
//         "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ring-1 shadow-sm",
//         activeStyle
//       )}
//     >
//       {status}
//     </span>
//   );
// };

// const DashboardItem = ({ item }) => {
//   return (
//     <TiltCard className="h-full rounded-3xl">
//       <Link
//         to={`/item/${item._id}`}
//         className="group relative flex flex-col h-full bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-500"
//         style={{ transformStyle: "preserve-3d" }}
//       >
//         {/* Image Section */}
//         <div
//           className="relative h-48 overflow-hidden bg-slate-100"
//           style={{ transform: "translateZ(20px)" }}
//         >
//           <motion.img
//             whileHover={{ scale: 1.1 }}
//             transition={{ duration: 0.6 }}
//             src={item.image || `https://picsum.photos/seed/${item._id}/800/500`}
//             className="w-full h-full object-cover"
//             alt={item.title}
//           />
//           <div className="absolute top-3 right-3 z-10">
//             <StatusBadge status={item.status} />
//           </div>
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>

//         {/* Content Section */}
//         <div
//           className="p-5 flex flex-col flex-1 bg-white/50 backdrop-blur-sm"
//           style={{ transform: "translateZ(10px)" }}
//         >
//           <div className="mb-3">
//             <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors">
//               {item.title}
//             </h3>
//             <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
//               <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
//                 <Tag className="w-3 h-3" /> {item.category}
//               </span>
//             </div>
//           </div>

//           <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
//             <div className="flex items-center gap-1.5 truncate max-w-[70%]">
//               <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
//               <span className="truncate">{item.location}</span>
//             </div>
//             <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
//           </div>
//         </div>
//       </Link>
//     </TiltCard>
//   );
// };

// // --- Main Dashboard ---

// export default function UserDashboard() {
//   // Logic Preservation
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const [myItems, setMyItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // eslint-disable-next-line no-unused-vars
//   const [enter, setEnter] = useState(false);
//   const [user1, setUser1] = useState(() =>
//     JSON.parse(localStorage.getItem("user") || "null")
//   );
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await apiGet("/api/items/my");
//         setMyItems(Array.isArray(data) ? data : data.items || []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const res = await apiGet("/api/users/me");
//         setUser1(res.user);
//         localStorage.setItem("user", JSON.stringify(res.user));
//       } catch (e) {
//         console.log("loadUser error:", e.message);
//       }
//     };
//     loadUser();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login", { replace: true });
//   };

//   useEffect(() => {
//     setEnter(true);
//   }, []);

//   // Animation Variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.08,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: { type: "spring", stiffness: 50, damping: 15 },
//     },
//     exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
//   };

//   const headerVariants = {
//     hidden: { y: -30, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 40, damping: 12 },
//     },
//   };

//   return (
//     <motion.div
//       className="min-h-screen p-4 md:p-8 font-sans text-slate-900 bg-slate-50"
//       animate={{
//         backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
//       }}
//       transition={{
//         duration: 20,
//         repeat: Infinity,
//         ease: "linear",
//       }}
//       style={{
//         backgroundImage: "linear-gradient(120deg, #f0f9ff, #f0fdf4, #fffbeb)",
//         backgroundSize: "200% 200%",
//       }}
//     >
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="max-w-7xl mx-auto space-y-8"
//       >
//         {/* Header Section */}
//         <motion.header
//           variants={headerVariants}
//           className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-xl shadow-slate-200/40"
//         >
//           {/* Decorative background blob */}
//           <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
//           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

//           <div className="flex items-center gap-4 relative z-10">
//             <Link
//               to="/profile"
//               className="group relative"
//             >
//               <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
//               <img
//                 src={user1?.profileImage || "/avatar.png"}
//                 className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
//                 alt="profile"
//               />
//             </Link>
//             <div>
//               <p className="text-slate-500 text-sm font-medium mb-0.5">
//                 Welcome back
//               </p>
//               <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
//                 {user1?.name || "User"}
//               </h1>
//             </div>
//           </div>

//           <div className="flex flex-col md:items-end gap-1 relative z-10">
//             <p className="text-slate-500 font-medium">
//               Logged in as <span className="text-blue-600 font-bold">{user?.name || "User"}</span>
//             </p>
//             <div className="flex flex-wrap items-center gap-3 mt-2">
//               <Link
//                 to="/profile"
//                 className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
//               >
//                 <UserIcon className="w-4 h-4" />
//                 Profile
//               </Link>
//               <Link
//                 to="/report"
//                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all active:scale-95"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Report Item</span>
//               </Link>
//               <Link
//                 to="/items"
//                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
//               >
//                 <Search className="w-4 h-4" />
//                 <span>Browse</span>
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-100 hover:bg-rose-100 hover:border-rose-200 transition-all active:scale-95 ml-auto md:ml-0"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span className="hidden sm:inline">Logout</span>
//               </button>
//             </div>
//           </div>
//         </motion.header>

//         {/* Content Section */}
//         <motion.section
//           variants={containerVariants}
//           className="space-y-6"
//         >
//           <div className="flex items-center gap-3 px-2">
//             <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
//               <LayoutGrid className="w-5 h-5" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-900">My Reports</h2>
//               <p className="text-sm text-slate-500">Manage your lost and found posts</p>
//             </div>
//           </div>

//           <div className="min-h-[300px]">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center h-80 rounded-3xl bg-white/40 border border-white/50 backdrop-blur-sm">
//                 <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
//                 <p className="text-slate-500 font-medium animate-pulse">Loading your items...</p>
//               </div>
//             ) : myItems.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="flex flex-col items-center justify-center h-80 bg-white/60 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-300 text-center p-8"
//               >
//                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
//                   <AlertCircle className="w-10 h-10 text-slate-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900 mb-2">No items reported yet</h3>
//                 <p className="text-slate-500 max-w-xs mx-auto mb-8">
//                   Have you lost or found something? Create your first report to get started.
//                 </p>
//                 <Link
//                   to="/report"
//                   className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all"
//                 >
//                   Create Report &rarr;
//                 </Link>
//               </motion.div>
//             ) : (
//               <motion.div
//                 layout
//                 variants={containerVariants}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//               >
//                 <AnimatePresence mode="popLayout">
//                   {myItems.map((item) => (
//                     <motion.div
//                       key={item._id}
//                       variants={itemVariants}
//                       layout
//                     >
//                       <DashboardItem item={item} />
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </motion.div>
//             )}
//           </div>
//         </motion.section>
//       </motion.div>
//     </motion.div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Search,
  MapPin,
  Tag,
  Loader2,
  LayoutGrid,
  AlertCircle,
  User as UserIcon,
  ChevronRight,
  Sparkles,
  Star
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { apiGet } from "../services/api";
import TiltCard from "./TiltCardUser";

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-pink-100 text-pink-600 border-pink-300 ring-pink-500/20",
    VERIFIED: "bg-cyan-100 text-cyan-600 border-cyan-300 ring-cyan-500/20",
    RETURNED: "bg-lime-100 text-lime-600 border-lime-300 ring-lime-500/20",
    REJECTED: "bg-rose-100 text-rose-600 border-rose-300 ring-rose-500/20",
    DEFAULT: "bg-slate-100 text-slate-600 border-slate-300 ring-slate-500/20",
  };

  const activeStyle = styles[status] || styles.DEFAULT;

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border-2 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]",
        activeStyle
      )}
    >
      {status}
    </span>
  );
};

const DashboardItem = ({ item }) => {
  return (
    <TiltCard className="h-full rounded-[2rem]">
      <Link
        to={`/item/${item._id}`}
        className="group relative flex flex-col h-full bg-white rounded-[2rem] border-4 border-slate-900 overflow-hidden hover:shadow-[8px_8px_0px_rgba(99,102,241,0.3)] transition-all duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image Section */}
        <div
          className="relative h-52 overflow-hidden bg-slate-100 border-b-4 border-slate-900"
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.img
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.4 }}
            src={item.image || `https://picsum.photos/seed/${item._id}/800/500`}
            className="w-full h-full object-cover"
            alt={item.title}
          />
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={item.status} />
          </div>
          <div className="absolute bottom-2 left-2 z-10">
             <div className="bg-yellow-400 p-1 rounded-lg border-2 border-black">
                <Star className="w-4 h-4 text-black fill-current" />
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="p-5 flex flex-col flex-1 bg-white"
          style={{ transform: "translateZ(10px)" }}
        >
          <div className="mb-3">
            <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-indigo-600 transition-colors uppercase italic">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border-2 border-indigo-100 px-3 py-1 rounded-lg text-xs font-bold">
                <Tag className="w-3 h-3" /> {item.category}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
            <div className="flex items-center gap-1.5 truncate max-w-[70%]">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors shadow-md">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
};

// --- Main Dashboard ---

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user1, setUser1] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/api/items/my");
        setMyItems(Array.isArray(data) ? data : data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiGet("/api/users/me");
        setUser1(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch (e) {
        console.log("loadUser error:", e.message);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans text-slate-900 bg-[#fdf2f8] relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(#e5e7eb 1.5px, transparent 1.5px),
          linear-gradient(135deg, #fdf2f8 0%, #eef2ff 100%)
        `,
        backgroundSize: "30px 30px, 100% 100%",
      }}
    >
      {/* Anime Background Elements */}
      <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-indigo-400 rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 pointer-events-none">
        <Star className="w-48 h-48 text-pink-400 -rotate-12" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-10 relative z-10"
      >
        {/* Header Section */}
        <motion.header
          variants={{ hidden: { y: -50 }, visible: { y: 0 } }}
          className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border-4 border-slate-900 p-8 rounded-[2.5rem] shadow-[10px_10px_0px_#000]"
        >
          <div className="flex items-center gap-5">
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-full animate-spin-slow opacity-75 group-hover:opacity-100 transition-opacity" />
              <img
                src={user1?.profileImage || "/avatar.png"}
                className="h-20 w-20 rounded-full object-cover border-4 border-white relative z-10"
                alt="profile"
              />
            </Link>
            <div>
              <p className="text-indigo-500 text-xs font-black uppercase tracking-widest mb-1">
                Hero Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">
                {user1?.name || "User"}
              </h1>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/report"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 text-black text-sm font-black border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[3px]" />
                <span>REPORT ITEM</span>
              </Link>
              <Link
                to="/items"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white text-sm font-black border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
              >
                <Search className="w-5 h-5 stroke-[3px]" />
                <span>BROWSE</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-rose-500 text-sm font-black border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <LogOut className="w-5 h-5 stroke-[3px]" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content Section */}
        <motion.section variants={containerVariants} className="space-y-8">
          <div className="flex items-center gap-4 px-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-yellow-400 shadow-lg">
              <LayoutGrid className="w-6 h-6 stroke-[3px]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">My Missions</h2>
              <p className="text-sm text-slate-500 font-bold">Tracking your lost & found reports</p>
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
                <p className="text-slate-900 font-black italic uppercase animate-pulse">Initializing Data...</p>
              </div>
            ) : myItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-96 bg-white rounded-[3rem] border-4 border-dashed border-slate-300 text-center p-10"
              >
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6 border-4 border-pink-100">
                  <AlertCircle className="w-12 h-12 text-pink-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">Empty Inventory!</h3>
                <p className="text-slate-500 font-bold max-w-xs mx-auto mb-10">
                  No items found in your current mission log. Start by reporting something!
                </p>
                <Link
                  to="/report"
                  className="px-8 py-4 rounded-2xl bg-pink-500 text-white font-black shadow-[6px_6px_0px_#000] border-4 border-black hover:bg-pink-600 transition-all"
                >
                  START NEW REPORT
                </Link>
              </motion.div>
            ) : (
              <motion.div
                layout
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {myItems.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      layout
                    >
                      <DashboardItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.section>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
}
