// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiGet, apiPost } from "../services/api";

// export default function ClaimPage() {
//   const { id } = useParams();
//   const [item, setItem] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     description: "",
//   });

// useEffect(() => {
//   const load = async () => {
//     try {
//       const res = await apiGet(`/api/items/${id}`);
//       setItem(res);
//     } catch (err) {
//       console.error(err);
//       setMsg("Failed to load item details - " + (err.message || "Unknown error") );
//     }
//   };
//   load();
// }, [id]);

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
// const res = await apiPost(`/api/claims`, {
//   itemId: id,
//   userName: form.name,
//   studentId: form.email,     // or real student ID if you have
//   proofText: form.description,
// });
// console.log("Sending:", {
//   itemId: id,
//   userName: form.name,
//   studentId: form.email,
//   proofText: form.description
// });
//     console.log("Response:", res);
//     setMsg("✅ Claim submitted successfully");
//   } catch (err) {
//     console.error("ERROR:", err);
//     setMsg(err.message || "Error submitting claim");
//   } finally {
//     setLoading(false);
//   }
// };

//   if (!item) return <p className="p-10">Loading NEW PAGE 🚀</p>;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
//       <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full">
        
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           🚀 NEW Claim Page
//         </h1>

//         {/* ✅ FIXED IMAGE */}
// <img
//   src={item?.image ? item.image : "/no-image.png"}
//   alt={item?.title}
//   className="w-full h-48 object-cover rounded-lg mb-4"
// />
//         <h2 className="text-xl font-bold mt-3">{item.title}</h2>

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           <input
//             placeholder="Your Name"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, name: e.target.value })
//             }
//           />

//           <input
//             placeholder="Your Email"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//           />

//           <textarea
//             placeholder="Describe item"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//           />

// <button
//   type="submit"
//   disabled={loading}
//   className="w-full bg-blue-600 text-white py-2 rounded"
// >
//   {loading ? "Submitting..." : "Submit Claim"}
// </button>
//         </form>
//         {msg && (
//   <p className="mt-4 text-center text-red-500 font-bold">
//     {msg}
//   </p>
// )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Mail, FileText, Send, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

export default function ClaimPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiGet(`/api/items/${id}`);
        setItem(res);
      } catch (err) {
        console.error(err);
        setMsg("Oops! Failed to load item details. ✨");
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await apiPost(`/api/claims`, {
        itemId: id,
        userName: form.name,
        studentId: form.email,
        proofText: form.description,
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96']
      });
      
      setIsSuccess(true);
      setMsg("Claim submitted successfully! Our team will review it soon. 🌸");
    } catch (err) {
      console.error("ERROR:", err);
      setMsg(err.message || "Oh no! Something went wrong with your claim.");
    } finally {
      setLoading(false);
    }
  };

  if (!item && !msg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf5ff]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-pink-500" />
        </motion.div>
        <p className="mt-4 font-bold text-pink-600 animate-pulse">Summoning item details... ✨</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8 flex items-center justify-center font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-purple-600 hover:text-pink-600 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] border-4 border-white overflow-hidden">
          {/* Header Section */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={item?.image ? item.image : "/no-image.png"}
              alt={item?.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500 rounded-lg text-white shadow-lg">
                  <Sparkles size={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  Claim Your Treasure
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{item?.title}</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                  <p className="text-gray-600 mb-8">{msg}</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-200"
                  >
                    Return to Home
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                    <input
                      required
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3.5 bg-pink-50/50 border-2 border-transparent focus:border-pink-300 focus:bg-white rounded-2xl outline-none transition-all text-gray-700 placeholder-pink-300 font-medium"
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                    <input
                      required
                      type="email"
                      placeholder="Student Email"
                      className="w-full pl-12 pr-4 py-3.5 bg-pink-50/50 border-2 border-transparent focus:border-pink-300 focus:bg-white rounded-2xl outline-none transition-all text-gray-700 placeholder-pink-300 font-medium"
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <FileText className="absolute left-4 top-4 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                    <textarea
                      required
                      rows="4"
                      placeholder="How do you know it's yours? (Describe unique marks, contents, etc.)"
                      className="w-full pl-12 pr-4 py-4 bg-pink-50/50 border-2 border-transparent focus:border-pink-300 focus:bg-white rounded-2xl outline-none transition-all text-gray-700 placeholder-pink-300 font-medium resize-none"
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(236,72,153,0.4)] flex items-center justify-center gap-3 disabled:opacity-70 transition-all"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" /> Processing...</>
                    ) : (
                      <><Send size={20} /> Submit Claim</>
                    )}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>

            {msg && !isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl flex items-center gap-2 font-medium"
              >
                <AlertCircle size={18} />
                {msg}
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-purple-400 text-sm font-medium">
          ✨ Please ensure your details are correct to speed up the verification process ✨
        </p>
      </motion.div>
    </div>
  );
}
