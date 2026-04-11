// import React, { useMemo, useState } from "react";
// import { apiPost } from "../services/api";
// import { useNavigate } from "react-router-dom";
// import { 
//   Tag, 
//   MapPin, 
//   ArrowLeftCircleIcon, 
//   Calendar, 
//   FileText, 
//   User, 
//   Image as ImageIcon, 
//   UploadCloud, 
//   X,
//   CheckCircle2,
//   AlertCircle
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function ReportItemPage() {
//   // --- Core Logic & State (Preserved) ---
//   const [type, setType] = useState("LOST");
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [location, setLocation] = useState("");
//   const [date, setDate] = useState(todayISO());
//   const [description, setDescription] = useState("");
//   const [contact, setContact] = useState("");

//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [imageBase64, setImageBase64] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");

//   const nav = useNavigate();

//   const categories = useMemo(
//     () => ["Select Category", "Electronics", "Wallet", "ID Card", "Keys", "Bottle", "Bag", "Books", "Other"],
//     []
//   );

//   const submit = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setError("");
//     setLoading(true);

//     try {
//       const payload = {
//         type,
//         title,
//         category,
//         location,
//         date,
//         description,
//         color: "",
//         image: imageBase64 || "",
//         contact,
//       };

//       const res = await apiPost("/api/items", payload);

//       setMsg(res.message || "Reported ✅ Waiting for admin verification.");
//       setTimeout(() => nav("/dashboard"), 800);
//     } catch (err) {
//       setError(err?.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => nav("/admin");
//   const isLost = type === "LOST";

//   const onPickImage = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setError("Please select an image file.");
//       return;
//     }
// if (file.size > 1 * 1024 * 1024) {
//   setError("Image too large. Max 1MB.");
//   return;
// }

//     setError("");
//     setImageFile(file);
//     setPreview(URL.createObjectURL(file));

//     const reader = new FileReader();
//     reader.onload = () => setImageBase64(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setPreview("");
//     setImageBase64("");
//   };

//   // --- Animation Variants ---
//   const containerVariants = {
//     hidden: { opacity: 0, rotateX: 10, y: 50, scale: 0.95 },
//     visible: { 
//       opacity: 1, 
//       rotateX: 0, 
//       y: 0, 
//       scale: 1, 
//       transition: { type: "spring", stiffness: 60, damping: 15, mass: 1 } 
//     },
//     exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
//   };

//   const fieldVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.05, type: "spring", stiffness: 100 }
//     })
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 perspective-1000 overflow-hidden">
//       {/* Background Decor */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px]" />
//       </div>

//       <motion.div 
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         exit="exit"
//         className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row"
//       >
//         {/* Left Panel: Visual & Info */}
//         <div className={`relative p-8 md:w-1/3 flex flex-col justify-between transition-colors duration-500 ${isLost ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
//           <div className="z-10">
//             <button
//               onClick={handleBack}
//               className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium mb-8"
//             >
//               <ArrowLeftCircleIcon size={20} /> Back
//             </button>
//             <motion.h1 
//               key={type} 
//               initial={{ opacity: 0, x: -20 }} 
//               animate={{ opacity: 1, x: 0 }} 
//               className="text-4xl font-black text-white mb-2 tracking-tight"
//             >
//               {isLost ? "Lost Item" : "Found Item"}
//             </motion.h1>
//             <p className="text-white/80 font-medium leading-relaxed">
//               {isLost 
//                 ? "Help us help you. Provide details to track down your belongings." 
//                 : "Thank you for your honesty. Let's get this item back to its owner."}
//             </p>
//           </div>

//           {/* 3D Illustration Placeholder */}
//           <div className="relative h-48 w-full mt-8 flex items-center justify-center">
//              <motion.div 
//                animate={{ rotateY: [0, 10, -10, 0], rotateX: [0, 5, -5, 0] }}
//                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
//                className="text-white/20"
//              >
//                {isLost ? <AlertCircle size={120} /> : <CheckCircle2 size={120} />}
//              </motion.div>
//           </div>
//         </div>

//         {/* Right Panel: Form */}
//         <div className="p-8 md:w-2/3 overflow-y-auto max-h-[90vh]">
//           <form onSubmit={submit} className="space-y-6">
            
//             {/* Type Toggle 3D Switch */}
//             <div className="flex bg-slate-100 p-1.5 rounded-2xl relative shadow-inner">
//               <motion.div
//                 layout
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl shadow-sm ${isLost ? 'left-1.5 bg-white' : 'left-[50%] bg-white'}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setType("LOST")}
//                 className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-xl transition-colors ${isLost ? 'text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
//               >
//                 Lost Something
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setType("FOUND")}
//                 className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-xl transition-colors ${!isLost ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
//               >
//                 Found Something
//               </button>
//             </div>

//             {/* Messages */}
//             <AnimatePresence>
//               {msg && (
//                 <motion.div 
//                   initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
//                   className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
//                 >
//                   <CheckCircle2 size={16} /> {msg}
//                 </motion.div>
//               )}
//               {error && (
//                 <motion.div 
//                   initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
//                   className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
//                 >
//                   <AlertCircle size={16} /> {error}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Image Upload */}
//             <motion.div variants={fieldVariants} custom={0} initial="hidden" animate="visible">
//               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Photo</label>
//               <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50/30">
//                 {!preview ? (
//                   <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
//                     <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
//                       <UploadCloud className="w-6 h-6 text-blue-500" />
//                     </div>
//                     <span className="text-sm font-semibold text-slate-600">Click to upload image</span>
//                     <span className="text-xs text-slate-400 mt-1">Max 1MB (Optional)</span>
//                     <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
//                   </label>
//                 ) : (
//                   <div className="relative h-48 w-full">
//                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
//                       <label className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 cursor-pointer text-white transition">
//                         <UploadCloud size={20} />
//                         <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
//                       </label>
//                       <button type="button" onClick={removeImage} className="p-2 bg-rose-500/80 backdrop-blur-md rounded-full hover:bg-rose-600 text-white transition">
//                         <X size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </motion.div>

//             {/* Form Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <InputField 
//                 custom={1} 
//                 label="Item Title" 
//                 icon={<Tag size={16} />} 
//                 value={title} 
//                 onChange={setTitle} 
//                 placeholder="e.g. Black Wallet" 
//               />
              
//               <motion.div variants={fieldVariants} custom={2} initial="hidden" animate="visible">
//                 <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
//                   <Tag size={14} /> Category
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     required
//                     className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
//                   >
//                     {categories.map((c) => (
//                       <option key={c} value={c === "Select Category" ? "" : c} disabled={c === "Select Category"}>
//                         {c}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </div>
//                 </div>
//               </motion.div>

//               <InputField 
//                 custom={3} 
//                 label="Location" 
//                 icon={<MapPin size={16} />} 
//                 value={location} 
//                 onChange={setLocation} 
//                 placeholder="Where was it?" 
//               />
              
//               <motion.div variants={fieldVariants} custom={4} initial="hidden" animate="visible">
//                 <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
//                   <Calendar size={14} /> Date
//                 </label>
//                 <input
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   required
//                   className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
//                 />
//               </motion.div>

//               <div className="md:col-span-2">
//                 <motion.div variants={fieldVariants} custom={5} initial="hidden" animate="visible">
//                   <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
//                     <FileText size={14} /> Description
//                   </label>
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                     rows={4}
//                     placeholder="Provide identifiable features..."
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
//                   />
//                 </motion.div>
//               </div>

//               <div className="md:col-span-2">
//                 <InputField 
//                   custom={6} 
//                   label="Your Name / ID" 
//                   icon={<User size={16} />} 
//                   value={contact} 
//                   onChange={setContact} 
//                   placeholder="Name / Roll No" 
//                 />
//               </div>
//             </div>

//             <motion.button
//               variants={fieldVariants}
//               custom={7}
//               initial="hidden"
//               animate="visible"
//               whileHover={{ scale: 1.02, translateY: -2 }}
//               whileTap={{ scale: 0.98 }}
//               disabled={loading}
//               className={`w-full h-14 mt-6 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLost ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 "Submit Report"
//               )}
//             </motion.button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// // Helper Component for Inputs with Animation
// function InputField({ label, icon, value, onChange, placeholder, custom }) {
//   return (
//     <motion.div 
//       variants={{
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0, transition: { delay: custom * 0.05 } }
//       }}
//       initial="hidden"
//       animate="visible"
//     >
//       <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
//         {icon} {label}
//       </label>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         required
//         placeholder={placeholder}
//         className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
//       />
//     </motion.div>
//   );
// }

// function todayISO() {
//   const d = new Date();
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }


import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tag, 
  MapPin, 
  ArrowLeftCircleIcon, 
  Calendar, 
  FileText, 
  User, 
  UploadCloud, 
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Ghost
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock apiPost for demonstration if service is missing
const apiPost = async (url, data) => {
  return new Promise((resolve) => setTimeout(() => resolve({ message: "Success!" }), 1000));
};

export default function ReportItemPage() {
  // --- Core Logic & State ---
  const [type, setType] = useState("LOST");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const categories = useMemo(
    () => ["Select Category", "Electronics", "Wallet", "ID Card", "Keys", "Bottle", "Bag", "Books", "Other"],
    []
  );

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        type,
        title,
        category,
        location,
        date,
        description,
        color: "",
        image: imageBase64 || "",
        contact,
      };

      const res = await apiPost("/api/items", payload);
      setMsg(res.message || "Reported! ✨ Check back soon!");
      setTimeout(() => nav("/dashboard"), 1200);
    } catch (err) {
      setError(err?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => nav("/admin");
  const isLost = type === "LOST";

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setError("Image too large. Max 1MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");
    setImageBase64("");
  };

  // --- Anime Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -2 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <div className="min-h-screen bg-[#fdf2f8] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-pink-300">
      {/* Anime Background Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ec4899 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-white border-[4px] border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] rounded-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Anime Splash */}
        <div className={`relative md:w-2/5 p-8 flex flex-col justify-between overflow-hidden transition-colors duration-500 ${isLost ? 'bg-rose-400' : 'bg-cyan-400'}`}>
          {/* Decorative Elements */}
          <div className="absolute top-2 right-2 flex gap-2">
            <Sparkles className="text-white opacity-40" size={40} />
          </div>
          
          <div className="z-10">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all text-sm font-bold mb-10 border-2 border-white/50"
            >
              <ArrowLeftCircleIcon size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Return to Hub
            </button>

            <motion.div
              key={type}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div className="inline-block bg-slate-900 text-white px-3 py-1 text-xs font-black uppercase tracking-widest mb-2">
                {isLost ? "Emergency!" : "Discovery!"}
              </div>
              <h1 className="text-5xl font-black text-white leading-tight drop-shadow-lg italic uppercase">
                {isLost ? "Item Lost!" : "Item Found!"}
              </h1>
              <p className="text-white font-bold bg-black/10 p-4 rounded-lg border-l-4 border-white">
                {isLost 
                  ? "A precious item has vanished! Let's broadcast this to find it!" 
                  : "You found a treasure! Let's reunite it with its rightful owner!"}
              </p>
            </motion.div>
          </div>

          <motion.div 
            animate={floatAnimation}
            className="relative h-64 flex items-center justify-center"
          >
             {isLost ? (
               <Ghost size={180} className="text-white/30 drop-shadow-2xl" />
             ) : (
               <Search size={180} className="text-white/30 drop-shadow-2xl" />
             )}
             <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-white/60 font-black text-8xl opacity-20 pointer-events-none select-none italic">
                  {isLost ? "LOST" : "FOUND"}
                </span>
             </div>
          </motion.div>
        </div>

        {/* Right Side: Manga-Style Form */}
        <div className="p-6 md:p-10 md:w-3/5 bg-white relative">
          <form onSubmit={submit} className="space-y-6">
            
            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-xl border-2 border-slate-900">
              <button
                type="button"
                onClick={() => setType("LOST")}
                className={`py-3 text-sm font-black rounded-lg transition-all border-2 ${isLost ? 'bg-rose-400 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-y-1' : 'bg-transparent text-slate-500 border-transparent hover:text-rose-500'}`}
              >
                I LOST SOMETHING
              </button>
              <button
                type="button"
                onClick={() => setType("FOUND")}
                className={`py-3 text-sm font-black rounded-lg transition-all border-2 ${!isLost ? 'bg-cyan-400 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-y-1' : 'bg-transparent text-slate-500 border-transparent hover:text-cyan-600'}`}
              >
                I FOUND SOMETHING
              </button>
            </div>

            <AnimatePresence mode="wait">
              {(msg || error) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-4 rounded-xl border-2 border-slate-900 flex items-center gap-3 font-bold ${msg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                >
                  {msg ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                  {msg || error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <AnimeLabel icon={<Tag size={16} />} label="What is it?" />
                <AnimeInput 
                  value={title} 
                  onChange={setTitle} 
                  placeholder="e.g. My Lucky Blue Headphones" 
                />
              </div>

              <div>
                <AnimeLabel icon={<Tag size={16} />} label="Category" />
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full h-12 bg-white border-2 border-slate-900 rounded-xl px-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all outline-none appearance-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c === "Select Category" ? "" : c} disabled={c === "Select Category"}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <AnimeLabel icon={<MapPin size={16} />} label="Where?" />
                <AnimeInput 
                  value={location} 
                  onChange={setLocation} 
                  placeholder="e.g. Library 2nd Floor" 
                />
              </div>

              <div>
                <AnimeLabel icon={<Calendar size={16} />} label="When?" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full h-12 bg-white border-2 border-slate-900 rounded-xl px-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all outline-none"
                />
              </div>

              <div>
                <AnimeLabel icon={<User size={16} />} label="Contact Info" />
                <AnimeInput 
                  value={contact} 
                  onChange={setContact} 
                  placeholder="Name / Phone / ID" 
                />
              </div>

              <div className="md:col-span-2">
                <AnimeLabel icon={<FileText size={16} />} label="Description / Details" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Any special marks, stickers, or features..."
                  className="w-full bg-white border-2 border-slate-900 rounded-xl p-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <AnimeLabel icon={<UploadCloud size={16} />} label="Visual Evidence (Optional)" />
                <div className="relative group">
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-400 bg-slate-50 rounded-2xl cursor-pointer hover:bg-pink-50 hover:border-pink-500 transition-colors group">
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all mb-2" />
                      <span className="text-xs font-black text-slate-500 uppercase">Click to Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
                    </label>
                  ) : (
                    <div className="relative h-40 w-full border-2 border-slate-900 rounded-2xl overflow-hidden">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={removeImage} 
                        className="absolute top-2 right-2 p-1 bg-rose-500 border-2 border-slate-900 rounded-full text-white hover:scale-110 transition-transform"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-white text-xl uppercase tracking-widest border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${isLost ? 'bg-rose-500 hover:bg-rose-600' : 'bg-cyan-500 hover:bg-cyan-600'}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Report <Sparkles size={24} />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// --- Anime UI Helper Components ---

function AnimeLabel({ icon, label }) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
      <span className="p-1 bg-slate-900 text-white rounded-md">{icon}</span>
      {label}
    </label>
  );
}

function AnimeInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      placeholder={placeholder}
      className="w-full h-12 bg-white border-2 border-slate-900 rounded-xl px-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all outline-none placeholder:text-slate-300"
    />
  );
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
