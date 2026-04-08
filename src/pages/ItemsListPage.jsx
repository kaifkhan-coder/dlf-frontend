import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Search as SearchIcon, Filter, Loader2 } from "lucide-react";
import { apiGet } from "../services/api";

// --- Animations ---

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
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
console.log(items);
  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesQ =
        (it.title || "").toLowerCase().includes(q.toLowerCase()) ||
        (it.description || "").toLowerCase().includes(q.toLowerCase()) ||
        (it.location || "").toLowerCase().includes(q.toLowerCase());

      const matchesType = type === "ALL" ? true : it.type === type;
      const matchesCat = category === "ALL" ? true : it.category === category;

const okStatus = true;
      return matchesQ && matchesType && matchesCat && okStatus;
    });
  }, [items, q, type, category]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-[calc(100vh-56px)] bg-slate-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Portal Items
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Discover <span className="font-semibold text-slate-800">{filtered.length}</span> items reported by the community.
            </p>
          </motion.div>

          <motion.div
            className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative w-full sm:w-[320px] group">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={20}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-[160px]">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="ALL">All Types</option>
                  <option value="LOST">Lost</option>
                  <option value="FOUND">Found</option>
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              <div className="relative w-full sm:w-[180px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "All Categories" : c}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Loading items...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-slate-500"
            >
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <SearchIcon size={32} className="text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-700">No items found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
src={item.image ? item.image : "/no-image.png"}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
              isLost ? "bg-orange-500/90 text-white" : "bg-blue-500/90 text-white"
            }`}
          >
            {item.type}
          </span>

          {item.status !== "VERIFIED" && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                item.status === "RETURNED"
                  ? "bg-emerald-500/90 text-white"
                  : "bg-slate-800/80 text-white"
              }`}
            >
              {item.status}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {item.category || "General"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>

        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {item.description || "No description provided."}
        </p>

        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="line-clamp-1">{item.location || "Unknown location"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span>{item.date || "Date unknown"}</span>
          </div>
        </div>

        <Link
          to={`/item/${item._id}`}
          className="mt-5 block w-full text-center px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200
                     text-slate-900 text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 
                     active:scale-[0.98] transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
} 