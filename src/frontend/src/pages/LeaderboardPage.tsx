import { Crown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import LevelBadge from "../components/LevelBadge";
import NeonLoader from "../components/NeonLoader";
import {
  useGetGlobalLeaderboard,
  useGetStreakLeaderboard,
} from "../hooks/useQueries";
import { getLevelTitle } from "../lib/forgefit";

const TABS = ["Global XP", "Weekly XP", "Streak", "Challenge"];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Global XP");
  const { data: globalLB = [], isLoading: loadingGlobal } =
    useGetGlobalLeaderboard();
  const { data: streakLB = [], isLoading: loadingStreak } =
    useGetStreakLeaderboard();

  const data = activeTab === "Streak" ? streakLB : globalLB;
  const valueKey = activeTab === "Streak" ? "streak" : "xp";
  const isLoading = activeTab === "Streak" ? loadingStreak : loadingGlobal;

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return (
        <Crown
          className="w-5 h-5"
          style={{ color: "#ffd700", filter: "drop-shadow(0 0 8px #ffd700)" }}
        />
      );
    if (rank === 2)
      return (
        <Crown
          className="w-5 h-5"
          style={{ color: "#c0c0c0", filter: "drop-shadow(0 0 8px #c0c0c0)" }}
        />
      );
    if (rank === 3)
      return (
        <Crown
          className="w-5 h-5"
          style={{ color: "#cd7f32", filter: "drop-shadow(0 0 8px #cd7f32)" }}
        />
      );
    return (
      <span className="text-gray-500 font-mono text-sm w-5 text-center">
        {rank}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          <span style={{ color: "#ffd700" }}>Leaderboard</span>
        </h1>
        <p className="text-gray-400">Top warriors competing for glory</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-ocid="leaderboard.tab"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? ""
                : "glass-card text-gray-400 hover:text-white"
            }`}
            style={
              activeTab === tab
                ? {
                    background: "rgba(255,215,0,0.15)",
                    border: "1px solid rgba(255,215,0,0.5)",
                    color: "#ffd700",
                    boxShadow: "0 0 12px rgba(255,215,0,0.3)",
                  }
                : {}
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          className="flex justify-center py-24"
          data-ocid="leaderboard.loading_state"
        >
          <NeonLoader size="lg" />
        </div>
      ) : (
        <div
          className="glass-card rounded-2xl overflow-hidden"
          data-ocid="leaderboard.table"
        >
          {data.length === 0 ? (
            <div
              className="p-12 text-center text-gray-400"
              data-ocid="leaderboard.empty_state"
            >
              No data yet. Be the first!
            </div>
          ) : (
            data.slice(0, 50).map((user, idx) => {
              const rank = idx + 1;
              const isMe = false;
              return (
                <motion.div
                  key={user.username || String(rank)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  data-ocid={
                    rank <= 3
                      ? `leaderboard.row.item.${rank}`
                      : "leaderboard.row.item.1"
                  }
                  className={`flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0 transition-all ${
                    rank <= 3 ? "bg-white/[0.03]" : ""
                  }`}
                  style={
                    isMe
                      ? {
                          border: "1px solid rgba(0,212,255,0.5)",
                          background: "rgba(0,212,255,0.05)",
                        }
                      : {}
                  }
                >
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                    style={{
                      background: "rgba(0,212,255,0.1)",
                      border: "1px solid rgba(0,212,255,0.3)",
                    }}
                  >
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {user.username || "Unknown Warrior"}
                    </p>
                    <p className="text-gray-500 text-xs capitalize">
                      {user.fitnessGoal}
                    </p>
                  </div>
                  <LevelBadge level={Number(user.level)} />
                  <div className="text-right">
                    <p
                      className="font-orbitron font-bold text-sm"
                      style={{ color: "#00d4ff" }}
                    >
                      {valueKey === "streak"
                        ? `${Number(user.streak)}d`
                        : `${Number(user.xp).toLocaleString()} XP`}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
