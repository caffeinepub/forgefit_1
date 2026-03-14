import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import TierBadge from "../components/TierBadge";
import { EXERCISES, type StaticExercise } from "../data/exercises";

const CATEGORIES = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Full Body",
];
const CATEGORY_MAP: Record<string, string> = {
  Chest: "chest",
  Back: "back",
  Shoulders: "shoulders",
  Arms: "arms",
  Legs: "legs",
  Core: "core",
  "Full Body": "fullBody",
};

export default function ExercisesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");

  const filtered = EXERCISES.filter((ex) => {
    const catMatch =
      activeCategory === "All" || ex.category === CATEGORY_MAP[activeCategory];
    const searchMatch = ex.name.toLowerCase().includes(search.toLowerCase());
    const tierMatch = filterTier === "All" || ex.tier === filterTier;
    const diffMatch =
      filterDiff === "All" || ex.difficulty === filterDiff.toLowerCase();
    return catMatch && searchMatch && tierMatch && diffMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          Exercise <span style={{ color: "#8b5cf6" }}>Library</span>
        </h1>
        <p className="text-gray-400">
          {EXERCISES.length} exercises across all categories
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-ocid="exercises.tab"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "text-white"
                  : "text-gray-400 glass-card hover:text-white"
              }`}
              style={
                activeCategory === cat
                  ? {
                      background: "rgba(139,92,246,0.2)",
                      border: "1px solid rgba(139,92,246,0.5)",
                      color: "#8b5cf6",
                      boxShadow: "0 0 10px rgba(139,92,246,0.3)",
                    }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              data-ocid="exercises.search_input"
              className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-gray-300 bg-white/5 border border-white/20 outline-none"
          >
            {["All", "S", "A", "B", "C"].map((t) => (
              <option key={t} value={t} className="bg-[#0a0a1a]">
                {t === "All" ? "All Tiers" : `${t} Tier`}
              </option>
            ))}
          </select>
          <select
            value={filterDiff}
            onChange={(e) => setFilterDiff(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-gray-300 bg-white/5 border border-white/20 outline-none"
          >
            {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
              <option key={d} value={d} className="bg-[#0a0a1a]">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercise Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24" data-ocid="exercises.empty_state">
          <p className="text-gray-400 text-lg">No exercises found</p>
          <p className="text-gray-600 text-sm mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map((ex, i) => (
            <ExerciseCard key={ex.id} exercise={ex} index={i + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function ExerciseCard({
  exercise: ex,
  index,
  compact,
}: { exercise: StaticExercise; index?: number; compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -4, scale: 1.02 }}
      data-ocid={`exercises.card.item.${index ?? 1}`}
      className={`glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${compact ? "min-w-56 flex-shrink-0" : ""}`}
    >
      <a href={`/exercises/${ex.id}`}>
        <div
          className="h-1"
          style={{
            background:
              ex.tier === "S"
                ? "#ffd700"
                : ex.tier === "A"
                  ? "#8b5cf6"
                  : ex.tier === "B"
                    ? "#00d4ff"
                    : "#06ffd4",
          }}
        />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-exo font-bold text-white group-hover:text-[#00d4ff] transition-colors leading-tight">
              {ex.name}
            </h3>
            <TierBadge tier={ex.tier} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500 capitalize">
              {ex.difficulty} · {ex.category}
            </p>
            <div className="flex flex-wrap gap-1">
              {ex.musclesWorked.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "#00d4ff",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500">⚙️ {ex.equipment}</p>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
