import { Heart, UserMinus, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import NeonLoader from "../components/NeonLoader";
import {
  useFollowUser,
  useGetActivityFeed,
  useGetAllUserProfiles,
  useUnfollowUser,
} from "../hooks/useQueries";
import { formatRelativeTime } from "../lib/forgefit";

export default function CommunityPage() {
  const { data: feed = [], isLoading: loadingFeed } = useGetActivityFeed();
  const { data: users = [], isLoading: loadingUsers } = useGetAllUserProfiles();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          <span style={{ color: "#06ffd4" }}>Community</span>
        </h1>
        <p className="text-white">Connect with warriors worldwide</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <h2 className="font-exo font-bold text-white text-lg mb-4">
            Live Activity Feed
          </h2>
          {loadingFeed ? (
            <div className="flex justify-center py-12">
              <NeonLoader />
            </div>
          ) : feed.length === 0 ? (
            <div
              className="glass-card rounded-2xl p-12 text-center"
              data-ocid="community.feed_item.empty_state"
            >
              <p className="text-white">
                No activity yet. Be the first to complete a workout!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feed.slice(0, 20).map((entry, i) => (
                <motion.div
                  key={entry.timestamp.toString()}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid="community.feed_item.item.1"
                  className="glass-card rounded-xl p-4 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
                    style={{
                      background: "rgba(6,255,212,0.1)",
                      border: "1px solid rgba(6,255,212,0.3)",
                      color: "#06ffd4",
                    }}
                  >
                    {entry.userId.toString().slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{entry.message}</p>
                    {Number(entry.xpGained) > 0 && (
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#00d4ff" }}
                      >
                        +{Number(entry.xpGained)} XP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                    <button
                      type="button"
                      className="text-white hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* User Discovery */}
        <div>
          <h2 className="font-exo font-bold text-white text-lg mb-4">
            Discover Warriors
          </h2>
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <NeonLoader />
            </div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 10).map((user, i) => (
                <motion.div
                  key={user.username}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#8b5cf6",
                    }}
                  >
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user.username}
                    </p>
                    <p className="text-white text-xs">
                      Lv.{Number(user.level)} ·{" "}
                      {Number(user.xp).toLocaleString()} XP
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="community.follow_button"
                    className="p-2 rounded-lg btn-neon-purple text-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
