import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LogOut, Plus, Compass, MapPin, Loader2, AlertCircle, CheckCircle2, XCircle, Clock, LayoutDashboard, ChevronRight, Sparkles, Zap, Ghost
} from 'lucide-react';
import { apiGet, apiPost } from '../services/api';

// --- Anime-Inspired CSS Pattern ---
const animeBgStyle = {
  backgroundColor: '#050505',
  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
  backgroundSize: '32px 32px',
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    rotateZ: 0.5,
    boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)',
    transition: { duration: 0.3 },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// --- UserDashboard Component ---
export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const load = async () => {
      try {
        const data = await apiGet('/api/items/my');
        setMyItems(Array.isArray(data) ? data : data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={animeBgStyle} className="min-h-screen p-4 md:p-8 font-sans text-slate-200 selection:bg-cyan-500/40 overflow-x-hidden relative">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 z-50" />
      <div className="absolute top-20 -right-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8 relative z-10"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border-2 border-slate-800 relative overflow-hidden group"
        >
          {/* Manga-style halftone overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500" 
               style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '4px 4px'}} />
          
          <div className="flex items-center gap-6">
            <motion.div 
              animate={floatAnimation}
              className="p-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              <LayoutDashboard size={32} strokeWidth={2.5} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">System Active</span>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Center</span>
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                User: <span className="text-fuchsia-400 font-bold">{user?.name?.toUpperCase() || 'PILOT_01'}</span>
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-transparent border-2 border-rose-500/50 text-rose-400 font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(244,63,94,0.3)]"
          >
            <LogOut size={18} />
            <span>Terminate</span>
          </motion.button>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border-2 border-slate-800 space-y-4 sticky top-8">
              <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-800 pb-2">
                <Zap size={18} className="text-yellow-400" />
                <h3 className="font-black text-white uppercase tracking-tighter text-xl italic">Quick Access</h3>
              </div>
              
              <Link to="/report">
                <motion.div
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-cyan-500 text-black font-black uppercase tracking-tighter hover:bg-cyan-400 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <Plus size={22} strokeWidth={3} />
                    <span>Report Item</span>
                  </div>
                  <ChevronRight size={20} />
                </motion.div>
              </Link>

              <Link to="/items">
                <motion.div
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800 text-white font-black uppercase tracking-tighter hover:bg-slate-700 transition-all border-2 border-slate-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <Compass size={22} strokeWidth={2} />
                    <span>Scan Map</span>
                  </div>
                  <ChevronRight size={20} />
                </motion.div>
              </Link>

              <div className="mt-8 pt-4 border-t-2 border-slate-800/50">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                  <span>Sync Status</span>
                  <span className="text-cyan-400">Stable</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-cyan-400" 
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="bg-slate-900/40 backdrop-blur-md border-2 border-slate-800 rounded-2xl p-8 min-h-[600px] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mission Log</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-8 h-1 bg-fuchsia-500 rounded-full" />
                    <p className="text-slate-400 font-bold text-sm uppercase">Tracking personal item history</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-slate-700">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-sm font-black text-white uppercase tracking-widest">
                    {myItems.length} Records
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <Loader2 className="text-cyan-400" size={60} strokeWidth={3} />
                    <div className="absolute inset-0 blur-lg bg-cyan-400/20 rounded-full" />
                  </motion.div>
                  <p className="font-black text-slate-500 uppercase tracking-widest mt-6 animate-pulse">Initializing Scan...</p>
                </div>
              ) : myItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-96 border-4 border-dashed border-slate-800 rounded-3xl bg-black/20"
                >
                  <Ghost size={64} className="text-slate-700 mb-6" />
                  <p className="text-2xl font-black text-slate-500 uppercase italic">No Data Found</p>
                  <Link to="/report" className="mt-4 px-6 py-2 bg-fuchsia-600 text-white font-black rounded-lg hover:bg-fuchsia-500 transition-colors uppercase tracking-tighter">
                    Initiate First Report
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  <AnimatePresence>
                    {myItems.map((it) => (
                      <ItemCard key={it._id} item={it} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function ItemCard({ item }) {
  return (
    <motion.div variants={itemVariants} layout>
      <Link to={`/item/${item._id}`}>
        <motion.div
          variants={cardHoverVariants}
          whileHover="hover"
          className="group relative bg-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden h-full flex flex-col hover:border-cyan-500/50 transition-colors duration-300"
        >
          <div className="h-44 overflow-hidden relative">
            <motion.img
              whileHover={{ scale: 1.15, rotate: -2 }}
              transition={{ duration: 0.4 }}
              src={item.image || `https://picsum.photos/seed/${item._id}/500/300`}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
              alt={item.title}
            />
            <div className="absolute top-3 right-3 z-10">
              <StatusBadge status={item.status} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
            
            {/* Manga decorative lines */}
            <div className="absolute bottom-2 left-2 flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-4 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{delay: `${i*0.1}s`}} />)}
            </div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-black text-white truncate text-xl mb-1 uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
              <MapPin size={12} className="text-fuchsia-500" />
              <span className="truncate">{item.location}</span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-white text-xs font-black uppercase group-hover:gap-3 transition-all">
                View <ChevronRight size={14} className="text-fuchsia-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-yellow-400 text-black border-black',
    VERIFIED: 'bg-cyan-400 text-black border-black',
    RETURNED: 'bg-lime-400 text-black border-black',
    REJECTED: 'bg-rose-500 text-white border-black',
    DEFAULT: 'bg-slate-700 text-white border-black',
  };

  const key = styles[status] ? status : 'DEFAULT';
  const styleClass = styles[key];

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${styleClass}`}
    >
      {status}
    </span>
  );
}

// --- Login Component ---
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid Protocol: Email required' }),
  password: z.string().min(1, { message: 'Security Key required' }),
});

export function Login() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await apiPost('/api/auth/login', values);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        nav('/admin');
      } else {
        nav('/dashboard');
      }
    } catch (err) {
      alert(err.message || 'Authentication Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={animeBgStyle} className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Grid / Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -1000],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '100% 40px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 relative z-10 border-2 border-slate-800 overflow-hidden"
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-fuchsia-500" />

        <div className="text-center mb-10">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-fuchsia-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] border-2 border-white/20"
          >
            <Zap className="text-white" size={40} strokeWidth={3} />
          </motion.div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">System <span className="text-cyan-400">Login</span></h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Initialize User Session</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Identification</label>
            <input
              {...register('email')}
              className="w-full bg-black/50 border-2 border-slate-800 px-4 py-4 rounded-lg focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700 text-white font-bold"
              placeholder="USER_EMAIL@PROTOCOL.COM"
            />
            {errors.email && (
              <p className="text-rose-500 text-[10px] font-black uppercase mt-1 italic">{errors.email.message}</p>
            )}
          </div>

<div className="space-y-1 relative">
  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
    Access Key
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      {...register('password')}
      className="w-full bg-black/50 border-2 border-slate-800 px-4 py-4 pr-12 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-all placeholder:text-slate-700 text-white font-bold"
      placeholder="••••••••••••"
    />

    {/* 👁 Show / Hide Button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
    >
      {showPassword ? "🙈" : "👁"}
    </button>
  </div>

  {errors.password && (
    <p className="text-rose-500 text-[10px] font-black uppercase mt-1 italic">
      {errors.password.message}
    </p>
  )}
</div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-lg font-black text-xl uppercase tracking-tighter
                       hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(34,211,238,1)]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" size={20} />
                Authenticating
              </span>
            ) : (
              'Enter System'
            )}
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            New Pilot?{' '}
            <Link to="/register" className="text-fuchsia-400 font-black hover:text-fuchsia-300 hover:underline underline-offset-4">
              Register Unit
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Decorative Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50" style={{backgroundSize: '100% 2px, 3px 100%'}} />
    </div>
  );
}