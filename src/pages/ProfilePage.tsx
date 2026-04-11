// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiPatch } from "../services/api";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   Camera,
//   ShieldCheck,
//   Sparkles,
// } from "lucide-react";

// export default function ProfilePage() {
//   const nav = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [show1, setShow1] = useState(false);
//   const [show2, setShow2] = useState(false);

//   const [photo, setPhoto] = useState(user?.profileImage || "");
//   const [preview, setPreview] = useState(user?.profileImage || "");

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [err, setErr] = useState("");

//   const bgAnim = useMemo(
//     () => ({
//       animate: {
//         backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
//       },
//       transition: { duration: 10, repeat: Infinity, ease: "linear" },
//     }),
//     []
//   );

//   const submit = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setErr("");

//     if (newPassword.length < 6) {
//       setErr("New password must be at least 6 characters.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await apiPatch("/api/users/password", {
//         currentPassword,
//         newPassword,
//       });
//       setMsg(res.message || "Password changed ✅");
//       setCurrentPassword("");
//       setNewPassword("");
//     } catch (e) {
//       setErr(e.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onPickPhoto = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setErr("Please select an image file");
//       return;
//     }
//     if (file.size > 3 * 1024 * 1024) {
//       setErr("Max image size is 3MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setPhoto(reader.result); // base64
//       setPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const savePhoto = async () => {
//     setMsg("");
//     setErr("");
//     try {
//       const res = await apiPatch("/api/users/profile-photo", { image: photo });
//       localStorage.setItem("user", JSON.stringify(res.user));
//       setMsg(res.message || "Profile photo updated ✅");
//     } catch (e) {
//       setErr(e.message || "Failed");
//     }
//   };

//   return (
//     <motion.div
//       className="min-h-[calc(100vh-56px)] px-4 py-10"
//       {...bgAnim}
//       style={{
//         backgroundImage:
//           "linear-gradient(120deg, #e0f2fe, #f0fdf4, #fef3c7, #ede9fe)",
//         backgroundSize: "300% 300%",
//       }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 18 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="max-w-2xl mx-auto"
//       >
//         {/* Outer Card */}
//         <motion.div
//           initial={{ scale: 0.98 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] overflow-hidden"
//         >
//           {/* Header */}
//           <div className="relative px-8 py-8 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
//             {/* subtle moving glow */}
//             <motion.div
//               className="absolute -top-24 -right-24 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl"
//               animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
//               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//             />
//             <motion.div
//               className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl"
//               animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
//               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
//             />

//             <motion.button
//               whileTap={{ scale: 0.96 }}
//               whileHover={{ x: -2 }}
//               onClick={() => nav(-1)}
//               className="relative z-10 inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold"
//             >
//               <ArrowLeft size={18} /> Back
//             </motion.button>

//             <motion.h1
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.15, duration: 0.5 }}
//               className="relative z-10 mt-4 text-3xl font-extrabold text-white"
//             >
//               Profile
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.22, duration: 0.5 }}
//               className="relative z-10 text-slate-300 mt-1"
//             >
//               Manage your account settings
//             </motion.p>
//           </div>

//           <div className="p-8 space-y-8">
//             {/* Messages */}
//             <AnimatePresence>
//               {msg && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -6, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -6, scale: 0.98 }}
//                   className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm flex items-center gap-2"
//                 >
//                   <ShieldCheck size={16} />
//                   <span>{msg}</span>
//                 </motion.div>
//               )}

//               {err && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -6, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -6, scale: 0.98 }}
//                   className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm flex items-center gap-2"
//                 >
//                   <Sparkles size={16} />
//                   <span>{err}</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Profile Photo Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.15, duration: 0.45 }}
//               whileHover={{ y: -2 }}
//               className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="font-extrabold text-slate-900">Profile Photo</p>
//                 <span className="text-xs font-bold text-slate-500">PNG/JPG • max 3MB</span>
//               </div>

//               <div className="mt-4 flex items-center gap-5">
//                 <motion.div
//                   className="relative"
//                   whileHover={{ scale: 1.03, rotate: -0.5 }}
//                   transition={{ type: "spring", stiffness: 250, damping: 18 }}
//                 >
//                   {/* glow ring */}
//                   <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/30 to-emerald-500/30 blur-md opacity-70" />
//                   <img
//                     src={preview || "https://ui-avatars.com/api/?name=User"}
//                     className="relative h-24 w-24 rounded-full object-cover border bg-white"
//                     alt="profile"
//                   />
//                 </motion.div>

//                 <div className="space-y-2">
//                   <motion.label
//                     whileTap={{ scale: 0.97 }}
//                     whileHover={{ y: -1 }}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50"
//                   >
//                     <Camera size={16} />
//                     Change Photo
//                     <input type="file" accept="image/*" hidden onChange={onPickPhoto} />
//                   </motion.label>

//                   <AnimatePresence>
//                     {!!photo && (
//                       <motion.button
//                         key="savebtn"
//                         initial={{ opacity: 0, y: 6 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 6 }}
//                         whileTap={{ scale: 0.98 }}
//                         whileHover={{ y: -1 }}
//                         onClick={savePhoto}
//                         className="block px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
//                       >
//                         Save Photo
//                       </motion.button>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Basic Info */}
//             <motion.div
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.22, duration: 0.45 }}
//               whileHover={{ y: -2 }}
//               className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
//                   <User size={18} className="text-slate-700" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-500">Logged in as</p>
//                   <p className="font-extrabold text-slate-900">{user?.name || "User"}</p>
//                   <p className="text-sm text-slate-600">{user?.email || ""}</p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Change password */}
//             <motion.form
//               onSubmit={submit}
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3, duration: 0.45 }}
//               className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4"
//             >
//               <div className="flex items-center gap-2 font-extrabold text-slate-900">
//                 <Lock size={18} className="text-slate-500" />
//                 Change Password
//               </div>

//               <AnimatedInput
//                 label="Current Password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 type={show1 ? "text" : "password"}
//                 toggle={() => setShow1((v) => !v)}
//                 show={show1}
//                 placeholder="Enter current password"
//               />

//               <AnimatedInput
//                 label="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 type={show2 ? "text" : "password"}
//                 toggle={() => setShow2((v) => !v)}
//                 show={show2}
//                 placeholder="Enter new password (min 6 chars)"
//               />

//               <motion.button
//                 disabled={loading}
//                 whileTap={{ scale: 0.99 }}
//                 whileHover={{ y: -1 }}
//                 className="w-full h-12 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition
//                            disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Updating..." : "Update Password"}
//               </motion.button>
//             </motion.form>
//           </div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }

// function AnimatedInput({ label, value, onChange, type, toggle, show, placeholder }) {
//   return (
//     <div>
//       <label className="text-sm font-bold text-slate-700">{label}</label>
//       <motion.div
//         className="mt-2 relative"
//         whileFocusWithin={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 220, damping: 18 }}
//       >
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           required
//           className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-12 bg-white
//                      focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder={placeholder}
//         />
//         <button
//           type="button"
//           onClick={toggle}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
//         >
//           {show ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </motion.div>
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { User, Lock, Eye, EyeOff, ArrowLeft, Camera, Save, Loader2, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { apiPatch } from "../services/api";

// --- Zod Schema ---
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// --- 3D Tilt Component ---
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default function ProfilePage() {
  const nav = useNavigate();
  
  // --- State ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [photo, setPhoto] = useState<string>(user?.profileImage || "");
  const [preview, setPreview] = useState<string>(user?.profileImage || "");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // --- Password Form ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // --- Handlers ---
  const onSubmitPassword = async (data: PasswordFormValues) => {
    setMsg("");
    setErr("");
    try {
      const res = await apiPatch("/api/users/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setMsg(res.message || "Password changed successfully ✅");
      reset();
    } catch (e: any) {
      setErr(e.message || "Failed to update password");
    }
  };

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErr("Please select a valid image file");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErr("Max image size is 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const savePhoto = async () => {
    setMsg("");
    setErr("");
    setLoadingPhoto(true);
    try {
      const res = await apiPatch("/api/users/profile-photo", { image: photo });
      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(res.user));
      // Reset photo state so 'Save' button hides until next change if desired,
      // but logic implies we keep 'photo' as current. 
      // We'll clear the 'unsaved' state implicitly by matching preview to user data if we wanted,
      // but here we just leave it as is to show success.
      setUser(res.user);
      setMsg(res.message || "Profile photo updated ✅");
    } catch (e: any) {
      setErr(e.message || "Failed to save photo");
    } finally {
      setLoadingPhoto(false);
    }
  };

  const hasUnsavedPhoto = preview !== (user?.profileImage || "");

  return (
    <div className="min-h-screen bg-slate-50 perspective-1000 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-50 -z-10" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => nav(-1)}
              className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-2"
            >
              <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Profile Settings <Sparkles className="text-yellow-400" size={28} />
            </h1>
            <p className="text-slate-400 mt-1">Manage your personal information and security</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <TiltCard className="h-full">
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl h-full flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative">
                    <img
                      src={preview || "https://ui-avatars.com/api/?name=User"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                      <Camera size={16} />
                      <input type="file" accept="image/*" hidden onChange={onPickPhoto} />
                    </label>
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.name || "User"}</h2>
                <p className="text-slate-500 text-sm">{user?.email}</p>

                {hasUnsavedPhoto && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 w-full"
                  >
                    <button
                      onClick={savePhoto}
                      disabled={loadingPhoto}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {loadingPhoto ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save New Photo
                    </button>
                  </motion.div>
                )}

                <div className="mt-8 w-full pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                    <span>Account Status</span>
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck size={14} /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Member Since</span>
                    <span>{new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Messages */}
            <AnimatePresence mode="wait">
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-3 shadow-sm"
                >
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="font-medium">{msg}</span>
                </motion.div>
              )}
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 flex items-center gap-3 shadow-sm"
                >
                  <div className="p-2 bg-rose-100 rounded-full">
                    <AlertCircle size={18} />
                  </div>
                  <span className="font-medium">{err}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Form */}
            <TiltCard>
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Security</h3>
                    <p className="text-slate-500 text-sm">Update your password</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Current Password</label>
                      <div className="relative group">
                        <input
                          type={showCurrent ? "text" : "password"}
                          {...register("currentPassword")}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-xs text-rose-500 font-medium ml-1">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">New Password</label>
                      <div className="relative group">
                        <input
                          type={showNew ? "text" : "password"}
                          {...register("newPassword")}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="Min 6 chars"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-xs text-rose-500 font-medium ml-1">{errors.newPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </TiltCard>

            {/* Additional Info Card (Static for now, preserving layout structure) */}
            <TiltCard>
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Personal Details</h4>
                    <p className="text-sm text-slate-500">Manage your name and contact info</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                  Edit Details
                </button>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </div>
  );
}
