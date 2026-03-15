import { Input } from "@/components/ui/input";
import { Filter, Search, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  CHALLENGES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  type StaticChallenge,
} from "../data/challenges";

const DIFFICULTY_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  beginner: {
    bg: "rgba(0,212,100,0.15)",
    border: "rgba(0,212,100,0.4)",
    text: "#00d464",
  },
  intermediate: {
    bg: "rgba(0,180,255,0.15)",
    border: "rgba(0,180,255,0.4)",
    text: "#00b4ff",
  },
  advanced: {
    bg: "rgba(180,0,255,0.15)",
    border: "rgba(180,0,255,0.4)",
    text: "#b400ff",
  },
  elite: {
    bg: "rgba(255,50,0,0.15)",
    border: "rgba(255,50,0,0.4)",
    text: "#ff3200",
  },
};

function ChallengeCard({ ch, index }: { ch: StaticChallenge; index: number }) {
  const [joined, setJoined] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const diffColor =
    DIFFICULTY_COLORS[ch.difficulty] ?? DIFFICULTY_COLORS.beginner;
  const progressPct = Math.min(100, (progress / ch.targetCount) * 100);
  const isCompleted = progress >= ch.targetCount;

  const handleUpdate = () => {
    const n = Number.parseInt(inputVal);
    if (!Number.isNaN(n) && n > 0) {
      setProgress((p) => Math.min(ch.targetCount, p + n));
      setInputVal("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      whileHover={!isCompleted ? { translateY: -4 } : {}}
      data-ocid={`challenges.card.item.${index + 1}`}
      className="glass-card rounded-2xl p-6 transition-all duration-300 flex flex-col"
      style={isCompleted ? { border: "1px solid rgba(255,215,0,0.4)" } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{ch.badgeIcon}</span>
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,0,110,0.2)",
              border: "1px solid rgba(255,0,110,0.4)",
              color: "#ff006e",
            }}
          >
            +{ch.rewardXp} XP
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
            style={{
              background: diffColor.bg,
              border: `1px solid ${diffColor.border}`,
              color: diffColor.text,
            }}
          >
            {ch.difficulty}
          </span>
        </div>
      </div>

      {isCompleted && (
        <div className="mb-2 flex items-center gap-2 text-[#ffd700]">
          <Trophy className="w-4 h-4" />
          <span className="text-xs font-bold">COMPLETED!</span>
        </div>
      )}

      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full self-start mb-2"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#aaa",
        }}
      >
        {ch.category}
      </span>

      <h3 className="font-exo font-bold text-white text-base mb-1">
        {ch.name}
      </h3>
      <p className="text-white text-xs mb-2 flex-1">{ch.description}</p>
      <p className="text-white text-xs mb-4">
        {ch.durationDays} days &middot; Target:{" "}
        {ch.targetCount.toLocaleString()} {ch.unit}
      </p>

      {joined ? (
        <div>
          <div className="flex justify-between text-xs text-white mb-1">
            <span>
              {progress.toLocaleString()} / {ch.targetCount.toLocaleString()}{" "}
              {ch.unit}
            </span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div
            className="h-2 rounded-full mb-3"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: isCompleted
                  ? "linear-gradient(90deg,#ffd700,#ff006e)"
                  : "linear-gradient(90deg,#00d4ff,#8b5cf6)",
                boxShadow: isCompleted
                  ? "0 0 8px rgba(255,215,0,0.6)"
                  : "0 0 8px rgba(0,212,255,0.5)",
              }}
            />
          </div>
          {!isCompleted && (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Add ${ch.unit}`}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                data-ocid="challenges.progress_input"
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-600 text-xs h-8"
              />
              <button
                type="button"
                onClick={handleUpdate}
                data-ocid="challenges.update_button"
                className="px-3 py-1.5 rounded-lg text-xs font-bold btn-neon-cyan"
              >
                +
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setJoined(true)}
          data-ocid="challenges.join_button"
          className="w-full py-2 rounded-xl btn-neon-pink font-exo font-bold text-sm"
        >
          Join Challenge
        </motion.button>
      )}
    </motion.div>
  );
}

export default function ChallengesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const filtered = useMemo(() => {
    return CHALLENGES.filter((ch) => {
      const matchSearch =
        search === "" ||
        ch.name.toLowerCase().includes(search.toLowerCase()) ||
        ch.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || ch.category === category;
      const matchDiff = difficulty === "All" || ch.difficulty === difficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [search, category, difficulty]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          <span style={{ color: "#ff006e" }}>Challenges</span>
        </h1>
        <p className="text-white">
          {CHALLENGES.length} challenges. Compete, complete, conquer. Earn XP
          and badges.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <Input
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="challenges.search_input"
            className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-gray-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-300" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-ocid="challenges.category_select"
            className="bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 text-sm"
          >
            {CHALLENGE_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-gray-900">
                {c}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            data-ocid="challenges.difficulty_select"
            className="bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 text-sm capitalize"
          >
            {CHALLENGE_DIFFICULTIES.map((d) => (
              <option key={d} value={d} className="bg-gray-900 capitalize">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {(["beginner", "intermediate", "advanced", "elite"] as const).map(
          (diff) => {
            const count = CHALLENGES.filter(
              (c) => c.difficulty === diff,
            ).length;
            const col = DIFFICULTY_COLORS[diff];
            return (
              <button
                type="button"
                key={diff}
                className="text-xs font-bold px-3 py-1 rounded-full capitalize cursor-pointer"
                style={{
                  background: col.bg,
                  border: `1px solid ${col.border}`,
                  color: col.text,
                }}
                onClick={() =>
                  setDifficulty(difficulty === diff ? "All" : diff)
                }
                data-ocid={`challenges.difficulty_filter.${diff}`}
              >
                {diff}: {count}
              </button>
            );
          },
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24" data-ocid="challenges.empty_state">
          <p className="text-white text-lg">No challenges found</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setDifficulty("All");
            }}
            className="mt-4 text-sm text-[#00d4ff] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-white text-sm mb-4">
            Showing {filtered.length} challenges
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((ch, i) => (
              <ChallengeCard key={ch.id} ch={ch} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
