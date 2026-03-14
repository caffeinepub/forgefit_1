import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddWellnessLog, useGetWellnessLogs } from "../hooks/useQueries";

const MEDITATION_CARDS = [
  {
    title: "5-Minute Breathing",
    duration: 5,
    description:
      "Calm your mind with focused breathwork. Perfect for quick stress relief.",
    emoji: "🌬️",
  },
  {
    title: "10-Minute Body Scan",
    duration: 10,
    description:
      "Scan and release tension from head to toe with guided awareness.",
    emoji: "🧘",
  },
  {
    title: "Pre-Workout Focus",
    duration: 7,
    description:
      "Prime your mental state and boost performance before training.",
    emoji: "🎯",
  },
  {
    title: "Post-Workout Recovery",
    duration: 8,
    description:
      "Wind down and promote muscle recovery with restorative meditation.",
    emoji: "🌿",
  },
  {
    title: "Sleep Preparation",
    duration: 12,
    description: "Ease into deep sleep with a relaxing guided body meditation.",
    emoji: "🌙",
  },
  {
    title: "Stress Relief",
    duration: 6,
    description:
      "Release cortisol and anxiety with breathing and visualization.",
    emoji: "💆",
  },
];

const STRETCH_CARDS = [
  {
    title: "Full Body Morning",
    muscles: ["Spine", "Hips", "Shoulders"],
    duration: 10,
    difficulty: "Easy",
    emoji: "☀️",
  },
  {
    title: "Post-Workout Cool Down",
    muscles: ["Quads", "Hamstrings", "Calves"],
    duration: 8,
    difficulty: "Easy",
    emoji: "🧊",
  },
  {
    title: "Hip Flexor Release",
    muscles: ["Hip Flexors", "Glutes", "Lower Back"],
    duration: 12,
    difficulty: "Medium",
    emoji: "🦵",
  },
  {
    title: "Upper Body Mobility",
    muscles: ["Chest", "Shoulders", "Lats"],
    duration: 10,
    difficulty: "Medium",
    emoji: "💪",
  },
  {
    title: "Hamstring & Lower Back",
    muscles: ["Hamstrings", "Lower Back", "Glutes"],
    duration: 10,
    difficulty: "Medium",
    emoji: "🔄",
  },
  {
    title: "Neck & Shoulder Relief",
    muscles: ["Neck", "Traps", "Shoulders"],
    duration: 6,
    difficulty: "Easy",
    emoji: "🙆",
  },
];

const WELLNESS_TIPS = [
  {
    day: "Sunday",
    tip: "Rest is when your muscles grow. Prioritize sleep and active recovery — take a walk, stretch gently, and hydrate well.",
    color: "#8b5cf6",
  },
  {
    day: "Monday",
    tip: "Start the week strong. Set 3 clear fitness intentions today and write them down. Clarity fuels consistency.",
    color: "#00d4ff",
  },
  {
    day: "Tuesday",
    tip: "Cold showers after training reduce muscle soreness and boost alertness. Try 30 seconds cold at the end.",
    color: "#06ffd4",
  },
  {
    day: "Wednesday",
    tip: "Midweek check-in: track your water intake. Most people are chronically dehydrated — aim for 8+ glasses.",
    color: "#fbbf24",
  },
  {
    day: "Thursday",
    tip: "Compound exercises (deadlifts, squats, bench) burn more calories and build more muscle per minute than isolation work.",
    color: "#ff6b35",
  },
  {
    day: "Friday",
    tip: "Pre-workout nutrition matters. Eat a carb-rich meal 1-2 hours before training for sustained energy and better performance.",
    color: "#ff2d55",
  },
  {
    day: "Saturday",
    tip: "Active recovery is better than total rest. A 30-minute walk, yoga session, or swim accelerates recovery and keeps momentum.",
    color: "#06ffd4",
  },
];

function CountdownModal({
  title,
  duration,
  onClose,
}: { title: string; duration: number; onClose: () => void }) {
  const [seconds, setSeconds] = useState(duration * 60);
  const [running, setRunning] = useState(false);

  const toggle = () => {
    if (!running) {
      setRunning(true);
      const interval = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(interval);
            setRunning(false);
            toast.success(`${title} complete! Great work! 🧘`);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  };

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const progress = 1 - seconds / (duration * 60);
  const circumference = 2 * Math.PI * 54;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-3xl p-8 w-80 text-center"
        data-ocid="wellness.meditation.modal"
        style={{ border: "1px solid rgba(0,212,255,0.3)" }}
      >
        <h3 className="font-orbitron font-bold text-white text-lg mb-6">
          {title}
        </h3>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg
            viewBox="0 0 120 120"
            className="w-32 h-32 -rotate-90"
            role="img"
            aria-label="Meditation timer"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--theme-accent, #00d4ff)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 8px var(--theme-accent, #00d4ff))",
                transition: "stroke-dashoffset 1s linear",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-orbitron text-2xl font-bold text-white">
              {mins}:{secs}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={running || seconds === 0}
          data-ocid="wellness.meditation.button"
          className="w-full py-3 rounded-xl font-exo font-bold mb-3"
          style={{ background: "var(--theme-accent, #00d4ff)", color: "#000" }}
        >
          {seconds === 0 ? "Complete! ✓" : running ? "Running..." : "Start"}
        </button>
        <button
          type="button"
          onClick={onClose}
          data-ocid="wellness.meditation.close_button"
          className="text-gray-400 text-sm hover:text-white"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

function HydrationRing({
  glasses,
  goal = 8,
}: { glasses: number; goal?: number }) {
  const pct = Math.min(glasses / goal, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg
        viewBox="0 0 120 120"
        className="w-36 h-36 -rotate-90"
        role="img"
        aria-label="Hydration progress"
      >
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="8"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 8px #00d4ff)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-orbitron font-bold text-white">
          {glasses}
        </span>
        <span className="text-xs text-gray-400">/ {goal}</span>
      </div>
    </div>
  );
}

export default function WellnessPage() {
  const { identity } = useInternetIdentity();
  const { data: logs = [] } = useGetWellnessLogs();
  const addLog = useAddWellnessLog();

  // Sleep form
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepQuality, setSleepQuality] = useState(4);

  // Hydration
  const [glasses, setGlasses] = useState(0);

  // Meditation modal
  const [activeTimer, setActiveTimer] = useState<{
    title: string;
    duration: number;
  } | null>(null);

  const todayIdx = new Date().getDay();
  const todayTip = WELLNESS_TIPS[todayIdx];
  const otherTips = WELLNESS_TIPS.filter((_, i) => i !== todayIdx);

  // Compute sleep hours from bedtime/wakeTime
  const calcHours = () => {
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);
    let diff = wh * 60 + wm - (bh * 60 + bm);
    if (diff < 0) diff += 1440;
    return Math.round((diff / 60) * 10) / 10;
  };

  const handleSaveSleep = async () => {
    if (!identity) {
      toast.error("Login to save sleep data");
      return;
    }
    try {
      await addLog.mutateAsync({
        userId: identity.getPrincipal(),
        date: BigInt(Date.now() * 1_000_000),
        sleepData: {
          hours: calcHours(),
          bedtime,
          wakeTime,
          quality: BigInt(sleepQuality),
        },
        hydration: BigInt(glasses),
      });
      toast.success("Wellness log saved!");
    } catch {
      toast.error("Failed to save log");
    }
  };

  const handleSaveHydration = async () => {
    if (!identity) {
      toast.error("Login to save hydration");
      return;
    }
    try {
      await addLog.mutateAsync({
        userId: identity.getPrincipal(),
        date: BigInt(Date.now() * 1_000_000),
        sleepData: { hours: 0, bedtime: "", wakeTime: "", quality: BigInt(0) },
        hydration: BigInt(glasses),
      });
      toast.success("Hydration saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  const sleepChartData = logs.slice(-14).map((l, i) => ({
    day: i + 1,
    hours: l.sleepData.hours,
    quality: Number(l.sleepData.quality),
  }));

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto"
      data-ocid="wellness.section"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-orbitron font-black text-4xl text-white mb-2">
          <span style={{ color: "var(--theme-accent, #00d4ff)" }}>
            WELLNESS
          </span>{" "}
          HUB
        </h1>
        <p className="text-gray-400 font-exo">Mind. Body. Recovery.</p>
      </motion.div>

      {/* Today's Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{
          border: `1px solid ${todayTip.color}40`,
          boxShadow: `0 0 30px ${todayTip.color}20`,
        }}
      >
        <div className="absolute top-0 right-0 text-8xl opacity-10 p-4 font-orbitron font-black">
          TIP
        </div>
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${todayTip.color}20`,
              border: `1px solid ${todayTip.color}40`,
            }}
          >
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-orbitron text-xs font-bold"
                style={{ color: todayTip.color }}
              >
                TODAY — {todayTip.day.toUpperCase()}
              </span>
            </div>
            <p className="font-exo text-white text-lg leading-relaxed">
              {todayTip.tip}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sleep + Hydration Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sleep Tracker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
          data-ocid="wellness.sleep.card"
        >
          <h2 className="font-orbitron font-bold text-white text-lg mb-5 flex items-center gap-2">
            <span>🌙</span> Sleep Tracker
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-gray-400 text-xs mb-1 block">
                Bedtime
              </Label>
              <Input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                data-ocid="wellness.sleep.input"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs mb-1 block">
                Wake Time
              </Label>
              <Input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                data-ocid="wellness.sleep.input"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label className="text-gray-400 text-xs mb-2 block">
              Sleep Quality
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSleepQuality(q)}
                  data-ocid="wellness.sleep.toggle"
                  className="text-2xl transition-all"
                  style={{
                    opacity: q <= sleepQuality ? 1 : 0.3,
                    filter:
                      q <= sleepQuality
                        ? "drop-shadow(0 0 4px #fbbf24)"
                        : "none",
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <div
            className="text-center mb-4 py-3 rounded-xl"
            style={{
              background: "rgba(6,255,212,0.1)",
              border: "1px solid rgba(6,255,212,0.2)",
            }}
          >
            <span
              className="font-orbitron font-bold text-2xl"
              style={{ color: "#06ffd4" }}
            >
              {calcHours()}h
            </span>
            <span className="text-gray-400 text-sm ml-2">estimated sleep</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSleep}
            disabled={addLog.isPending}
            data-ocid="wellness.sleep.submit_button"
            className="w-full py-3 rounded-xl font-exo font-bold"
            style={{
              background: "var(--theme-accent, #00d4ff)",
              color: "#000",
            }}
          >
            {addLog.isPending ? "Saving..." : "Save Sleep Log"}
          </motion.button>
          {sleepChartData.length > 0 && (
            <div className="mt-5">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={sleepChartData}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06ffd4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06ffd4" stopOpacity={0} />
                    </linearGradient>
                    <filter id="sleepGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.03)"
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#333"
                    tick={{ fill: "#555", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#333"
                    tick={{ fill: "#555", fontSize: 10 }}
                    domain={[0, 12]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,10,20,0.95)",
                      border: "1px solid rgba(6,255,212,0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#06ffd4"
                    strokeWidth={2}
                    fill="url(#sleepGrad)"
                    filter="url(#sleepGlow)"
                    isAnimationActive
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Hydration Tracker */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6"
          data-ocid="wellness.hydration.card"
        >
          <h2 className="font-orbitron font-bold text-white text-lg mb-5 flex items-center gap-2">
            <span>💧</span> Hydration Tracker
          </h2>
          <HydrationRing glasses={glasses} />
          <p className="text-center text-gray-400 text-sm mt-3 mb-5">
            {glasses >= 8
              ? "🎉 Goal reached! Amazing!"
              : `${8 - glasses} more glasses to your goal`}
          </p>
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              type="button"
              onClick={() => setGlasses((g) => Math.max(0, g - 1))}
              data-ocid="wellness.hydration.button"
              className="w-10 h-10 rounded-full font-bold text-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all"
            >
              -
            </button>
            <Input
              type="number"
              min={0}
              max={20}
              value={glasses}
              onChange={(e) => setGlasses(Math.max(0, Number(e.target.value)))}
              data-ocid="wellness.hydration.input"
              className="w-20 text-center bg-white/5 border-white/10 text-white font-bold text-xl"
            />
            <button
              type="button"
              onClick={() => setGlasses((g) => g + 1)}
              data-ocid="wellness.hydration.button"
              className="w-10 h-10 rounded-full font-bold text-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all"
              style={{ background: "rgba(0,212,255,0.1)" }}
            >
              +
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveHydration}
            disabled={addLog.isPending}
            data-ocid="wellness.hydration.submit_button"
            className="w-full py-3 rounded-xl font-exo font-bold"
            style={{ background: "#00d4ff", color: "#000" }}
          >
            Save Today's Hydration
          </motion.button>
        </motion.div>
      </div>

      {/* Meditation Guides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="font-orbitron font-bold text-white text-xl mb-5">
          🧘 Meditation Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDITATION_CARDS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.02, y: -4 }}
              data-ocid="wellness.meditation.card"
              className="glass-card rounded-2xl p-5 flex flex-col gap-3"
              style={{ border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{m.emoji}</span>
                <div>
                  <h3 className="font-orbitron font-bold text-white text-sm">
                    {m.title}
                  </h3>
                  <span className="text-xs" style={{ color: "#8b5cf6" }}>
                    {m.duration} min
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm flex-1">{m.description}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setActiveTimer({ title: m.title, duration: m.duration })
                }
                data-ocid="wellness.meditation.button"
                className="w-full py-2 rounded-lg text-sm font-exo font-bold"
                style={{
                  background: "rgba(139,92,246,0.2)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  color: "#a78bfa",
                }}
              >
                Start Session
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stretching Guides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <h2 className="font-orbitron font-bold text-white text-xl mb-5">
          🤸 Stretching Routines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRETCH_CARDS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.02, y: -4 }}
              data-ocid="wellness.stretch.card"
              className="glass-card rounded-2xl p-5"
              style={{ border: "1px solid rgba(6,255,212,0.15)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <h3 className="font-orbitron font-bold text-white text-sm">
                    {s.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">
                      {s.duration} min
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          s.difficulty === "Easy"
                            ? "rgba(6,255,212,0.15)"
                            : "rgba(251,191,36,0.15)",
                        color: s.difficulty === "Easy" ? "#06ffd4" : "#fbbf24",
                      }}
                    >
                      {s.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {s.muscles.map((m) => (
                  <span
                    key={m}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-orbitron font-bold text-white text-xl mb-5">
          📅 Weekly Wellness Tips
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherTips.map((t, i) => (
            <motion.div
              key={t.day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              data-ocid={`wellness.tips.item.${i + 1}`}
              className="glass-card rounded-xl p-4"
              style={{ border: `1px solid ${t.color}25` }}
            >
              <div
                className="font-orbitron text-xs font-bold mb-2"
                style={{ color: t.color }}
              >
                {t.day.slice(0, 3).toUpperCase()}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-4">
                {t.tip}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {activeTimer && (
          <CountdownModal
            title={activeTimer.title}
            duration={activeTimer.duration}
            onClose={() => setActiveTimer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
