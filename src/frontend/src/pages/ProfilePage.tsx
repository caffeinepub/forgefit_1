import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, Edit2, Lock, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import LevelBadge from "../components/LevelBadge";
import NeonLoader from "../components/NeonLoader";
import { THEMES, useTheme } from "../contexts/ThemeContext";
import {
  useGetAchievements,
  useGetAllExercises,
  useGetNotificationPrefs,
  useGetProfile,
  useGetWorkoutLogs,
  useSaveNotificationPrefs,
  useUpdateProfile,
  useUpdateTheme,
} from "../hooks/useQueries";
import {
  ACHIEVEMENTS,
  FITNESS_GOALS,
  formatTimestamp,
  getLevelTitle,
} from "../lib/forgefit";

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfile();
  const { data: logs = [] } = useGetWorkoutLogs();
  const { data: achievements = [] } = useGetAchievements();
  const { data: allExercises = [] } = useGetAllExercises();
  const { data: notifPrefs } = useGetNotificationPrefs();
  const updateProfile = useUpdateProfile();
  const updateThemeMutation = useUpdateTheme();
  const saveNotifPrefs = useSaveNotificationPrefs();
  const { activeTheme, setTheme, isThemeUnlocked } = useTheme();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NeonLoader size="lg" />
      </div>
    );
  }

  if (!profile) return null;

  const xp = Number(profile.xp);
  const level = Number(profile.level);
  const streak = Number(profile.streak);

  // achievements is Array<bigint> of unlocked achievement IDs
  const unlockedIds = new Set(achievements.map((id) => Number(id)));

  const exerciseMap = new Map(
    allExercises.map((e) => [e.id.toString(), e.name]),
  );

  const workoutChartData = logs.slice(-20).map((log, i) => ({
    day: i + 1,
    xp: Number(log.xpAwarded),
  }));

  const handleEdit = () => {
    setUsername(profile.username || "");
    setGoal(profile.fitnessGoal || "");
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        username,
        goal,
        level: profile.level,
        xp: profile.xp,
        streak: profile.streak,
        picBlob: null,
      });
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleActivateTheme = async (themeId: string) => {
    try {
      setTheme(themeId);
      await updateThemeMutation.mutateAsync(themeId);
      toast.success("Theme activated!");
    } catch {
      toast.error("Failed to save theme");
    }
  };

  const handleNotifToggle = async (
    key: keyof import("../backend.d").NotificationPreferences,
    value: boolean,
  ) => {
    if (!notifPrefs) return;
    try {
      await saveNotifPrefs.mutateAsync({ ...notifPrefs, [key]: value });
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto"
      data-ocid="profile.section"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-start gap-6"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold"
            style={{
              background: "rgba(139,92,246,0.2)",
              border: "2px solid rgba(139,92,246,0.4)",
            }}
          >
            {profile.username?.[0]?.toUpperCase() || "💪"}
          </div>
          <button
            type="button"
            data-ocid="profile.upload_button"
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(139,92,246,0.8)",
              border: "1px solid #8b5cf6",
            }}
          >
            <Upload className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-ocid="profile.input"
                className="bg-white/5 border-white/20 text-white font-orbitron font-bold text-xl max-w-xs"
              />
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger
                  data-ocid="profile.select"
                  className="bg-white/5 border-white/20 text-white max-w-xs"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a1a] border-white/20">
                  {FITNESS_GOALS.map((g) => (
                    <SelectItem key={g} value={g} className="text-gray-300">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  data-ocid="profile.save_button"
                  className="btn-neon-cyan px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  data-ocid="profile.cancel_button"
                  className="text-gray-400 hover:text-white px-3 py-2 rounded-lg border border-white/20 text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-orbitron font-black text-3xl text-white mb-2">
                {profile.username || "Warrior"}
              </h1>
              <p className="text-gray-400 mb-3">{profile.fitnessGoal}</p>
              <div className="flex flex-wrap items-center gap-3">
                <LevelBadge level={level} />
                <span className="text-gray-400 text-sm">
                  {xp.toLocaleString()} XP
                </span>
                <span className="text-orange-400 text-sm">
                  🔥 {streak} day streak
                </span>
              </div>
            </>
          )}
        </div>

        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            data-ocid="profile.edit_button"
            className="btn-neon-purple px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </motion.div>

      {/* Achievements */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="font-exo font-bold text-white text-lg mb-6">
          ★ Achievements
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedIds.has(Number(ach.id));
            return (
              <motion.div
                key={ach.id}
                whileHover={{ scale: 1.05 }}
                data-ocid={`profile.achievements.item.${ach.id}`}
                className={`rounded-2xl p-4 text-center transition-all duration-300 ${
                  unlocked ? "glass-card glow-purple" : "opacity-30"
                }`}
              >
                <div className="text-2xl mb-1">{ach.icon}</div>
                <div className="text-xs text-gray-400 font-exo">{ach.name}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Workout Chart */}
      {workoutChartData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="font-exo font-bold text-white text-lg mb-4">
            Workout History
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={workoutChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="day"
                stroke="#444"
                tick={{ fill: "#666", fontSize: 11 }}
              />
              <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,10,20,0.95)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="var(--theme-accent, #00d4ff)"
                strokeWidth={2}
                dot={{ fill: "var(--theme-accent, #00d4ff)", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Workouts */}
      {logs.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="font-exo font-bold text-white text-lg mb-4">
            Recent Workouts
          </h2>
          <div className="space-y-3">
            {logs
              .slice(-5)
              .reverse()
              .map((log, i) => (
                <div
                  key={log.completedAt.toString()}
                  data-ocid={`profile.workouts.item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <div className="text-sm text-white font-exo">
                      {exerciseMap.get(log.exerciseId.toString()) || "Workout"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(log.completedAt)}
                    </div>
                  </div>
                  <div
                    className="font-orbitron font-bold text-sm"
                    style={{ color: "#fbbf24" }}
                  >
                    +{Number(log.xpAwarded)} XP
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Themes Section */}
      <div
        className="glass-card rounded-2xl p-6 mb-8"
        data-ocid="profile.themes.section"
      >
        <h2 className="font-orbitron font-bold text-white text-lg mb-2">
          🎨 Themes
        </h2>
        <p className="text-gray-500 text-sm font-exo mb-6">
          Unlock new visual styles as you level up.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const unlocked = isThemeUnlocked(theme.id, level);
            const isActive = activeTheme === theme.id;
            return (
              <motion.div
                key={theme.id}
                whileHover={{ scale: unlocked ? 1.02 : 1 }}
                data-ocid="profile.themes.card"
                className="rounded-2xl p-5 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: isActive
                    ? `2px solid ${theme.accent}`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive ? `0 0 20px ${theme.accent}40` : "none",
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Color swatches */}
                  <div className="flex gap-1.5">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        background: theme.accent,
                        boxShadow: `0 0 8px ${theme.accent}`,
                      }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ background: theme.secondary }}
                    />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white">
                      {theme.name}
                    </div>
                    {!unlocked && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Level {theme.unlockLevel}
                      </div>
                    )}
                  </div>
                </div>
                {unlocked ? (
                  isActive ? (
                    <div
                      className="w-full py-2 rounded-lg text-center text-xs font-exo font-bold"
                      style={{
                        background: `${theme.accent}20`,
                        color: theme.accent,
                        border: `1px solid ${theme.accent}40`,
                      }}
                    >
                      ✓ Active
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => handleActivateTheme(theme.id)}
                      data-ocid="profile.themes.button"
                      className="w-full py-2 rounded-lg text-xs font-exo font-bold"
                      style={{
                        background: `${theme.accent}20`,
                        color: theme.accent,
                        border: `1px solid ${theme.accent}40`,
                      }}
                    >
                      Activate
                    </motion.button>
                  )
                ) : (
                  <div className="w-full py-2 rounded-lg text-center text-xs font-exo text-gray-600 border border-white/5">
                    🔒 Unlock at Level {theme.unlockLevel}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div
        className="glass-card rounded-2xl p-6"
        data-ocid="profile.notifications.section"
      >
        <h2 className="font-orbitron font-bold text-white text-lg mb-2">
          🔔 Notifications
        </h2>
        <p className="text-gray-500 text-sm font-exo mb-6">
          Control which alerts you receive.
        </p>
        <div className="space-y-5">
          {[
            {
              key: "streaks" as const,
              label: "Streak Reminders",
              description: "Get reminded to keep your streak alive",
              icon: "🔥",
            },
            {
              key: "challenges" as const,
              label: "Challenge Invites",
              description: "Be notified about new challenge activity",
              icon: "🏆",
            },
            {
              key: "friends" as const,
              label: "Friend Achievements",
              description: "Celebrate when friends hit milestones",
              icon: "👥",
            },
            {
              key: "levelups" as const,
              label: "Level-Up Alerts",
              description: "Never miss a level-up moment",
              icon: "⚡",
            },
          ].map(({ key, label, description, icon }) => (
            <div
              key={key}
              className="flex items-center justify-between"
              data-ocid="profile.notifications.row"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <Label className="text-white font-exo font-medium cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </div>
              <Switch
                checked={notifPrefs?.[key] ?? true}
                onCheckedChange={(checked) =>
                  handleNotifToggle(
                    key as "streaks" | "challenges" | "friends" | "levelups",
                    checked,
                  )
                }
                data-ocid="profile.notifications.switch"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
