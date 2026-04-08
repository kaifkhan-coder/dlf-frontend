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
  Activity
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
    // Invert Y for natural tilt feel
    const rotateX = y * -10; 
    const rotateY = x * 10;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
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
      className={`transition-all duration-200 ease-out transform-gpu ${className}`}
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
    setTimeout(() => setShow(true), 100);
  }, []);

  // --- Stats ---
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

  // --- Approve / Reject / Returned ---
  const updateStatus = async (id, status) => {
    try {
      await apiPatch(`//admin/items/${id}/status`, { status });
      await refresh();
    } catch (e) {
      alert(e.message || "Failed");
    }
  };

  // --- AI Report Logic ---
  const generateAIReport = () => {
    if (!items.length) {
      setAiReport("No items yet. Add more reports to generate insights.");
      return;
    }
    const byCategory = {};
    for (const it of items) {
      const k = (it.category || "Unknown").toLowerCase();
      byCategory[k] = (byCategory[k] || 0) + 1;
    }
    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    const advice = [
      `Top category being reported: ${topCat?.[0] || "unknown"} (${topCat?.[1] || 0})`,
      `Pending approvals: ${stats.pending}`,
      `Try: enforce "unique proof" (serial/sticker/hidden detail) for claims.`,
      `Add: auto-expire old posts after 30 days for clean listings.`,
    ];
    setAiReport(advice.map((x) => `• ${x}`).join("\n"));
  };

  // --- Match Suggestions Logic ---
  const normalize = (s = "") =>
    s.toString().trim().toLowerCase().replace(/\s+/g, " ");

  const hasWordOverlap = (a = "", b = "") => {
    const A = new Set(normalize(a).split(" ").filter(Boolean));
    const B = new Set(normalize(b).split(" ").filter(Boolean));
    let common = 0;
    for (const w of A) if (B.has(w)) common++;
    return common;
  };

  const similarText = (a = "", b = "") => {
    const common = hasWordOverlap(a, b);
    return common >= 1;
  };

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <div
        className={`max-w-7xl mx-auto px-4 py-8 md:py-12 transition-all duration-700 ease-out transform ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-200">
                <ShieldCheck size={28} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Admin<span className="text-blue-600">Dashboard</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Overview & Intelligence Hub
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton
              onClick={generateAIReport}
              icon={Sparkles}
              label="AI Report"
              variant="dark"
            />
            <ActionButton
              onClick={suggestMatches}
              icon={Wand2}
              label="Auto Match"
              variant="primary"
            />
            <ActionButton
              onClick={refresh}
              icon={RotateCcw}
              label="Refresh"
              variant="outline"
            />
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Row - Spans full width on mobile, broken into cards */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Items" value={stats.total} icon={Package} color="blue" delay={0} />
            <StatCard title="Lost" value={stats.lost} icon={Search} color="rose" delay={100} />
            <StatCard title="Found" value={stats.found} icon={Box} color="emerald" delay={200} />
            <StatCard title="Pending" value={stats.pending} icon={Clock3} color="amber" delay={300} />
            <StatCard title="Verified" value={stats.verified} icon={CheckCircle2} color="indigo" delay={400} />
            <StatCard title="Returned" value={stats.returned} icon={Layers} color="slate" delay={500} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pending Approvals Section */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-slate-200/50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="text-amber-500" size={24} />
                    Pending Approvals
                  </h2>
                  <p className="text-slate-500 text-sm">Review and verify reported items</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {pendingItems.length} Waiting
                </span>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
                  ))}
                </div>
              ) : pendingItems.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">All caught up! No pending items.</p>
                </div>
              ) : (
                <div className="space-y-4">
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

            {/* Match Suggestions Section */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-slate-200/50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Wand2 className="text-purple-500" size={24} />
                    AI Match Suggestions
                  </h2>
                  <p className="text-slate-500 text-sm">Potential matches based on description analysis</p>
                </div>
              </div>

              {matches.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400">No matches found yet. Try running the matcher.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map((m, idx) => (
                    <MatchCard key={idx} match={m} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: AI Report */}
          <div className="lg:col-span-1">
            <TiltCard className="h-full">
              <div className="h-full bg-slate-900 text-white rounded-3xl p-6 shadow-2xl shadow-slate-900/20 flex flex-col relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                      <Sparkles className="text-yellow-300" size={20} />
                    </div>
                    <h2 className="text-xl font-bold">AI Insights</h2>
                  </div>

                  <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm min-h-[200px]">
                    {aiReport ? (
                      <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
                        {aiReport}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-sm">
                        <Sparkles className="mb-2 opacity-50" />
                        <p>Generate a report to see system insights.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-slate-500">
                      * Analysis runs locally in browser.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}

// --- Subcomponents ---

function ActionButton({ onClick, icon: Icon, label, variant }) {
  const base = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-sm";
  const variants = {
    dark: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20",
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/20",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color, delay }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    rose: "text-rose-600 bg-rose-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    indigo: "text-indigo-600 bg-indigo-50",
    slate: "text-slate-600 bg-slate-100",
  };

  return (
    <TiltCard className="h-full">
      <div 
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-full flex flex-col justify-between hover:shadow-md transition-shadow"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon size={16} />
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900">{value}</div>
      </div>
    </TiltCard>
  );
}

function PendingItemCard({ item, onUpdate }) {
  return (
    <TiltCard>
      <div className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
        <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={item.image || "no-image.png" || `https://picsum.photos/seed/${item._id}/400/300`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-lg">
            {item.type}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
              <Link
                to={`/item/${item._id}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
              >
                View Details
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-medium text-slate-700">{item.category}</span>
              <span>•</span>
              <span>{item.location}</span>
            </p>
            <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onUpdate(item._id, "VERIFIED")}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition shadow-sm shadow-blue-200"
            >
              Approve
            </button>
            <button
              onClick={() => onUpdate(item._id, "REJECTED")}
              className="flex-1 px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50 active:scale-95 transition"
            >
              Reject
            </button>
            <button
              onClick={() => onUpdate(item._id, "RETURNED")}
              className="flex-1 px-4 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 active:scale-95 transition"
            >
              Returned
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function MatchCard({ match }) {
  return (
    <TiltCard className="h-full">
      <div className="h-full bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Match Score
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {match.score}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative pl-4 border-l-2 border-rose-200">
            <div className="text-xs font-bold text-rose-500 mb-1">LOST ITEM</div>
            <div className="font-semibold text-slate-900 line-clamp-1">{match.lost.title}</div>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
          </div>

          <div className="relative pl-4 border-l-2 border-emerald-200">
            <div className="text-xs font-bold text-emerald-500 mb-1">FOUND ITEM</div>
            <div className="font-semibold text-slate-900 line-clamp-1">{match.found.title}</div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
          <Link to={`/item/${match.lost._id}`} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
            View Lost
          </Link>
          <Link to={`/item/${match.found._id}`} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
            View Found
          </Link>
        </div>
      </div>
    </TiltCard>
  );
}
