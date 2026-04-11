import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Search as SearchIcon, Filter, Loader2, Sparkles, Ghost, Package } from "lucide-react";
import { apiGet } from "../services/api";

// --- Anime Inspired Styles & Animations ---

const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0, rotate: -1 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// --- Components ---

export default function ItemsListPage({ initialData }) {
  const [items, setItems] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [q, setQ] = useState("");
  const [type, setType] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    if (initialData) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiGet("/api/items");
        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (e) {
        console.error("Failed to load items:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initialData]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesQ =
        (it.title || "").toLowerCase().includes(q.toLowerCase()) ||
        (it.description || "").toLowerCase().includes(q.toLowerCase()) ||
        (it.location || "").toLowerCase().includes(q.toLowerCase());

      const matchesType = type === "ALL" ? true : it.type === type;
      const matchesCat = category === "ALL" ? true : it.category === category;
      return matchesQ && matchesType && matchesCat;
    });
  }, [items, q, type, category]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-[#fdf2f8] relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(#ec4899 0.5px, transparent 0.5px)`,
        backgroundSize: '24px 24px',
        backgroundOpacity: 0.1
      }}
    >
      {/* Anime Motifs Background Deco */}
      <div className="absolute top-10 -left-20 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-6 transform -rotate-12">
               <Sparkles className="text-yellow-400 w-10 h-10 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic">
              Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Items</span>
            </h1>
            <div className="h-2 w-32 bg-yellow-400 mt-2 rounded-full" />
            <p className="text-slate-600 mt-4 text-xl font-medium">
              Searching for <span className="px-2 py-0.5 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{filtered.length}</span> treasures in the multiverse.
            </p>
          </motion.div>

          <motion.div
            className="w-full lg:w-auto flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={22} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search the archives..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
                             focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all font-bold"
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-4 rounded-2xl border-4 border-black bg-yellow-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                               focus:outline-none font-black cursor-pointer uppercase tracking-tight"
                  >
                    <option value="ALL">All Types</option>
                    <option value="LOST">Lost</option>
                    <option value="FOUND">Found</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={18} />
                </div>

                <div className="relative hidden sm:block">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-4 rounded-2xl border-4 border-black bg-purple-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                               focus:outline-none font-black text-white cursor-pointer uppercase tracking-tight"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="text-black">
                        {c === "ALL" ? "All Categories" : c}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
              <p className="font-black uppercase tracking-widest text-slate-400">Summoning Data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center bg-white border-4 border-black rounded-[40px] p-16 text-slate-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]"
            >
              <motion.div {...floatAnimation} className="bg-pink-100 p-8 rounded-full mb-6 border-4 border-pink-200">
                <Ghost size={64} className="text-pink-500" />
              </motion.div>
              <p className="text-3xl font-black text-slate-800 uppercase italic">Nothing Found!</p>
              <p className="text-lg mt-2 font-medium">The item has vanished into another dimension.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((it) => (
                  <ItemCard key={it._id} item={it} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ItemCard({ item }) {
  const isLost = item.type === "LOST";

  return (
    <motion.div
      layout
      variants={cardVariants}
      whileHover={{ 
        y: -10, 
        rotate: 1, 
        transition: { type: "spring", stiffness: 300 } 
      }}
      className="group bg-white rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(236,72,153,0.4)] transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-60 overflow-hidden bg-slate-100 border-b-4 border-black">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          src={item.image ? item.image : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80"}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4">
            <div className={`px-4 py-1.5 rounded-full border-2 border-black font-black text-xs uppercase tracking-tighter shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              isLost ? "bg-rose-400 text-white" : "bg-cyan-400 text-black"
            }`}>
              {item.type}
            </div>
        </div>

        <div className="absolute top-4 right-4">
          {item.status !== "VERIFIED" && (
            <span className="px-3 py-1.5 rounded-lg border-2 border-black bg-white text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {item.status}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3 flex items-center gap-2">
          <div className="p-1.5 bg-yellow-200 border-2 border-black rounded-lg">
             <Package size={14} className="text-black" />
          </div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
            {item.category || "General"}
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 leading-tight line-clamp-1 mb-2 group-hover:text-pink-600 transition-colors italic">
          {item.title}
        </h3>

        <p className="text-slate-600 text-sm font-medium line-clamp-2 mb-6 flex-grow">
          {item.description || "A mysterious object found drifting in the digital void..."}
        </p>

        <div className="py-4 border-t-2 border-dashed border-slate-200 space-y-3">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <MapPin size={16} className="text-pink-500 shrink-0" />
            <span className="line-clamp-1">{item.location || "Secret Hideout"}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <Calendar size={16} className="text-purple-500 shrink-0" />
            <span>{item.date || "Era Unknown"}</span>
          </div>
        </div>

        <Link
          to={`/item/${item._id}`}
          className="mt-4 block w-full text-center px-6 py-4 rounded-xl bg-black border-2 border-black
                     text-white text-sm font-black uppercase tracking-widest hover:bg-pink-500 
                     hover:border-pink-600 active:translate-y-1 transition-all duration-200"
        >
          Inspect Item
        </Link>
      </div>
    </motion.div>
  );
}
