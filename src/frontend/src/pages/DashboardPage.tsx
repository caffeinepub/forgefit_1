import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
// canvas-confetti replaced with inline stub
const confetti = (_opts: Record<string, unknown>) => {};
import { Flame, Star, Target, TrendingUp, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
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
import { useTheme } from "../contexts/ThemeContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddBodyMetric,
  useGetBodyMetrics,
  useGetProfile,
  useGetWorkoutLogs,
} from "../hooks/useQueries";
import { formatTimestamp, getLevelTitle, getXpProgress } from "../lib/forgefit";

const MOTIVATIONAL_QUOTES = [
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
  },
  {
    text: "Success is what comes after you stop making excuses.",
    author: "Luis Galarza",
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown",
  },
  {
    text: "The hardest lift of all is lifting your butt off the couch.",
    author: "Unknown",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb",
  },
  {
    text: "Strength does not come from the physical capacity. It comes from an indomitable will.",
    author: "Gandhi",
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Unknown",
  },
  {
    text: "Champions aren't made in gyms. Champions are made from something they have deep inside them.",
    author: "Muhammad Ali",
  },
  {
    text: "If it doesn't challenge you, it doesn't change you.",
    author: "Fred DeVito",
  },
  {
    text: "The difference between the impossible and the possible lies in a person's determination.",
    author: "Tommy Lasorda",
  },
  {
    text: "One hour of training a day will give you 23 hours of confidence.",
    author: "Unknown",
  },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "Sweat is just fat crying.", author: "Unknown" },
  {
    text: "No matter how slow you go, you are still lapping everybody on the couch.",
    author: "Unknown",
  },
  { text: "Be stronger than your strongest excuse.", author: "Unknown" },
  {
    text: "The secret to getting ahead is getting started.",
    author: "Mark Twain",
  },
  { text: "Fall in love with taking care of yourself.", author: "Unknown" },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  { text: "You are one workout away from a good mood.", author: "Unknown" },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "Fit is not a destination, it is a way of life.", author: "Unknown" },
  {
    text: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
  },
  {
    text: "Motivation gets you started. Habit keeps you going.",
    author: "Jim Ryun",
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery",
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
  },
  {
    text: "The only way to define your limits is by going beyond them.",
    author: "Arthur C. Clarke",
  },
];

function BodySilhouette({
  weight,
  bodyFat,
}: { weight: number; bodyFat: number }) {
  // Determine silhouette profile: 0=lean, 1=average, 2=fuller
  const profile = bodyFat < 15 ? 0 : bodyFat > 25 ? 2 : 1;
  const fillOpacity = [0.15, 0.3, 0.5][profile];
  const accentColor =
    profile === 0 ? "#06ffd4" : profile === 1 ? "#00d4ff" : "#8b5cf6";
  const label =
    profile === 0 ? "Lean" : profile === 1 ? "Athletic" : "Building";

  // SVG path for a stylized human silhouette
  const scaleX = [0.82, 1, 1.18][profile];

  const bmi = weight > 0 ? (weight / (1.75 * 1.75)).toFixed(1) : "—";

  return (
    <div className="glass-card rounded-2xl p-6" data-ocid="dashboard.body.card">
      <h3 className="font-orbitron font-bold text-white text-lg mb-6 flex items-center gap-2">
        <span>💪</span> Body Composition
      </h3>
      <div className="flex items-center gap-8">
        {/* SVG Silhouette */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <motion.svg
            viewBox="0 0 100 200"
            width="80"
            height="160"
            role="img"
            aria-label="Body silhouette"
            animate={{ scaleX }}
            transition={{ type: "spring", stiffness: 120 }}
            style={{ originX: "50%" }}
          >
            <defs>
              <filter id="silhouetteGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Head */}
            <ellipse
              cx="50"
              cy="18"
              rx="13"
              ry="15"
              fill={accentColor}
              fillOpacity={fillOpacity}
              stroke={accentColor}
              strokeWidth="1.5"
              filter="url(#silhouetteGlow)"
            />
            {/* Neck */}
            <rect
              x="44"
              y="31"
              width="12"
              height="8"
              fill={accentColor}
              fillOpacity={fillOpacity}
            />
            {/* Torso */}
            <path
              d="M30 39 Q22 60 25 95 Q35 100 50 100 Q65 100 75 95 Q78 60 70 39 Q60 36 50 36 Q40 36 30 39Z"
              fill={accentColor}
              fillOpacity={fillOpacity}
              stroke={accentColor}
              strokeWidth="1.5"
              filter="url(#silhouetteGlow)"
            />
            {/* Left arm */}
            <path
              d="M30 42 Q18 55 16 80 Q20 85 24 80 Q26 60 33 50Z"
              fill={accentColor}
              fillOpacity={fillOpacity}
              stroke={accentColor}
              strokeWidth="1"
            />
            {/* Right arm */}
            <path
              d="M70 42 Q82 55 84 80 Q80 85 76 80 Q74 60 67 50Z"
              fill={accentColor}
              fillOpacity={fillOpacity}
              stroke={accentColor}
              strokeWidth="1"
            />
            {/* Left leg */}
            <path
              d="M36 99 Q30 135 29 165 Q34 170 39 165 Q42 140 45 110 Q50 107 50 107Z"
              fill={accentColor}
              fillOpacity={fillOpacity}
              stroke={accentColor}
              strokeWidth="1"
            />
            {/* Right leg */}
            <path
              d="M64 99 Q70 135 71 165 Q66 170 61 165 Q58 140 55 110 Q50 107 50 107Z"
              fill={accentColor}
              fillOpacity={fillOpacity}
              stroke={accentColor}
              strokeWidth="1"
            />
          </motion.svg>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {[
            {
              label: "Weight",
              value: weight > 0 ? `${weight} kg` : "—",
              color: accentColor,
            },
            {
              label: "Body Fat",
              value: bodyFat > 0 ? `${bodyFat}%` : "—",
              color: accentColor,
            },
            { label: "BMI", value: bmi, color: "#fbbf24" },
            { label: "Profile", value: label, color: accentColor },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3"
              style={{
                background: `${s.color}10`,
                border: `1px solid ${s.color}30`,
              }}
            >
              <div className="text-xs text-cyan-400 mb-1">{s.label}</div>
              <div
                className="font-orbitron font-bold text-sm"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedXPBar({
  current,
  max,
  level,
}: { current: number; max: number; level: number }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-cyan-400 font-exo">Level {level}</span>
        <span
          className="text-xs font-exo"
          style={{ color: "var(--theme-accent, #00d4ff)" }}
        >
          {current.toLocaleString()} / {max.toLocaleString()} XP
        </span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full xp-bar-glow"
          style={{
            background:
              "linear-gradient(90deg, var(--theme-accent, #00d4ff), var(--theme-secondary, #06ffd4))",
          }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { currentThemeDef } = useTheme();
  const { data: profile, isLoading } = useGetProfile();
  const { data: logs = [] } = useGetWorkoutLogs();
  const { data: metrics = [] } = useGetBodyMetrics();
  const addMetric = useAddBodyMetric();

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);

  // Body metrics form
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [biceps, setBiceps] = useState("");

  useEffect(() => {
    if (!identity) navigate({ to: "/login" });
  }, [identity, navigate]);

  useEffect(() => {
    if (profile) {
      const lvl = Number(profile.level);
      if (prevLevel !== null && lvl > prevLevel) {
        setShowLevelUp(true);
        // Fire confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: [
            "#00d4ff",
            "#8b5cf6",
            "#ff006e",
            "#06ffd4",
            currentThemeDef.accent,
          ],
        });
        setTimeout(() => setShowLevelUp(false), 4000);
      }
      setPrevLevel(lvl);
    }
  }, [profile, prevLevel, currentThemeDef.accent]);

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
  const xpData = getXpProgress(xp);

  // Daily quote (rotates by day)
  const quoteIdx =
    Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length;
  const dailyQuote = MOTIVATIONAL_QUOTES[quoteIdx];

  // Build chart data
  const xpChartData = logs.slice(-20).map((log, i) => ({
    day: i + 1,
    xp: Number(log.xpAwarded),
    date: formatTimestamp(log.completedAt),
  }));

  const weightData = metrics.map((m, i) => ({
    day: i + 1,
    weight: m.weight,
    bodyFat: m.bodyFat,
  }));

  const today = Date.now();
  const logDates = new Set(
    logs.map((l) => {
      const d = new Date(Number(l.completedAt) / 1_000_000);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today - (29 - i) * 86400000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return { date: d.getDate(), active: logDates.has(key) };
  });

  const latestMetric = metrics[metrics.length - 1];

  const handleAddMetric = async () => {
    if (!weight) {
      toast.error("Weight is required");
      return;
    }
    const w = Number.parseFloat(weight);
    const h = 175;
    const bmi = w / (h / 100) ** 2;
    try {
      await addMetric.mutateAsync({
        weight: w,
        bodyFat: Number.parseFloat(bodyFat) || 0,
        chest: Number.parseFloat(chest) || 0,
        waist: Number.parseFloat(waist) || 0,
        hips: Number.parseFloat(hips) || 0,
        biceps: Number.parseFloat(biceps) || 0,
        bmi,
        timestamp: BigInt(Date.now() * 1_000_000),
      });
      toast.success("Body metrics saved!");
      setWeight("");
      setBodyFat("");
      setChest("");
      setWaist("");
      setHips("");
      setBiceps("");
    } catch {
      toast.error("Failed to save metrics");
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto"
      data-ocid="dashboard.section"
    >
      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 text-center px-8 py-5 rounded-3xl"
            style={{
              background: "rgba(10,10,20,0.95)",
              border: `2px solid ${currentThemeDef.accent}`,
              boxShadow: `0 0 40px ${currentThemeDef.accent}60`,
            }}
          >
            <div className="text-4xl mb-2">⚡🎉⚡</div>
            <div
              className="font-orbitron font-black text-2xl"
              style={{ color: currentThemeDef.accent }}
            >
              LEVEL UP!
            </div>
            <div className="font-exo text-white mt-1">
              You reached Level {level}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="font-orbitron font-black text-3xl md:text-4xl text-white">
              Welcome back,{" "}
              <span style={{ color: "var(--theme-accent, #00d4ff)" }}>
                {profile.username}
              </span>
            </h1>
            <p className="text-white font-exo mt-1">
              {getLevelTitle(level)} •{" "}
              {streak > 0
                ? `🔥 ${streak}-day streak`
                : "Start your streak today!"}
            </p>
          </div>
          <LevelBadge level={level} />
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: <Zap className="w-5 h-5" />,
            label: "Level",
            value: level,
            color: "var(--theme-accent, #00d4ff)",
          },
          {
            icon: <Star className="w-5 h-5" />,
            label: "Total XP",
            value: xp.toLocaleString(),
            color: "#fbbf24",
          },
          {
            icon: <Flame className="w-5 h-5" />,
            label: "Streak",
            value: `${streak}d`,
            color: "#ff6b35",
          },
          {
            icon: <Target className="w-5 h-5" />,
            label: "Workouts",
            value: logs.length,
            color: "#06ffd4",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -2 }}
            data-ocid="dashboard.stats.card"
            className="glass-card rounded-2xl p-5"
            style={{ border: `1px solid ${s.color}25` }}
          >
            <div
              className="flex items-center gap-2 mb-2"
              style={{ color: s.color }}
            >
              {s.icon}
              <span className="text-xs text-cyan-400 font-exo">{s.label}</span>
            </div>
            <div
              className="font-orbitron font-black text-2xl"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap
            className="w-5 h-5"
            style={{ color: "var(--theme-accent, #00d4ff)" }}
          />
          <h3 className="font-orbitron font-bold text-white text-lg">
            XP Progress
          </h3>
        </div>
        <AnimatedXPBar
          current={xpData.current}
          max={xpData.needed}
          level={level}
        />
        <div className="mt-3 text-xs text-white font-exo">
          {xpData.needed - xpData.current} XP to Level {level + 1}
        </div>
      </motion.div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{
          border: "1px solid rgba(251,191,36,0.2)",
          boxShadow: "0 0 20px rgba(251,191,36,0.05)",
        }}
        data-ocid="dashboard.quote.card"
      >
        <div className="absolute top-3 left-4 font-orbitron text-8xl font-black opacity-5 text-white leading-none">
          &ldquo;
        </div>
        <div className="flex items-start gap-4">
          <Star
            className="w-6 h-6 mt-1 flex-shrink-0"
            style={{ color: "#fbbf24" }}
          />
          <div>
            <p className="font-exo text-white text-base italic leading-relaxed">
              &ldquo;{dailyQuote.text}&rdquo;
            </p>
            <p className="text-white text-sm mt-2 font-exo">
              — {dailyQuote.author}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Body Silhouette + Metrics Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BodySilhouette
            weight={latestMetric?.weight ?? Number.parseFloat(weight) ?? 0}
            bodyFat={latestMetric?.bodyFat ?? Number.parseFloat(bodyFat) ?? 0}
          />
        </motion.div>

        {/* Metrics Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-exo font-bold text-white text-lg mb-6">
            Log Body Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Weight (kg)", val: weight, set: setWeight },
              { label: "Body Fat (%)", val: bodyFat, set: setBodyFat },
              { label: "Chest (cm)", val: chest, set: setChest },
              { label: "Waist (cm)", val: waist, set: setWaist },
              { label: "Hips (cm)", val: hips, set: setHips },
              { label: "Biceps (cm)", val: biceps, set: setBiceps },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <Label className="text-white text-xs mb-1 block">{label}</Label>
                <Input
                  type="number"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  data-ocid="metrics.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddMetric}
            disabled={addMetric.isPending}
            data-ocid="metrics.submit_button"
            className="w-full mt-5 py-3 rounded-xl font-exo font-bold"
            style={{
              background: "var(--theme-accent, #00d4ff)",
              color: "#000",
            }}
          >
            {addMetric.isPending ? "Saving..." : "Save Metrics"}
          </motion.button>
        </motion.div>
      </div>

      {/* Charts Row */}
      {xpChartData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp
              className="w-5 h-5"
              style={{ color: "var(--theme-accent, #00d4ff)" }}
            />
            <h3 className="font-exo font-bold text-white text-lg">
              XP Progress Over Time
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={xpChartData}>
              <defs>
                <filter id="xpGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="day"
                stroke="#444"
                tick={{ fill: "#666", fontSize: 12 }}
              />
              <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,10,20,0.95)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#00d4ff" }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="var(--theme-accent, #00d4ff)"
                strokeWidth={2}
                dot={{ fill: "var(--theme-accent, #00d4ff)", r: 4 }}
                filter="url(#xpGlow)"
                isAnimationActive
                animationBegin={0}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weight Chart */}
      {weightData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-exo font-bold text-white text-lg mb-4">
              Weight Trend
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <filter id="weightGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="day"
                  stroke="#444"
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#weightGrad)"
                  filter="url(#weightGlow)"
                  isAnimationActive
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-exo font-bold text-white text-lg mb-4">
              Body Fat %
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06ffd4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06ffd4" stopOpacity={0} />
                  </linearGradient>
                  <filter id="bfGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="day"
                  stroke="#444"
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(6,255,212,0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="#06ffd4"
                  strokeWidth={2}
                  fill="url(#bfGrad)"
                  filter="url(#bfGlow)"
                  isAnimationActive
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Workout Calendar */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h3 className="font-exo font-bold text-white text-lg mb-4">
          30-Day Activity
        </h3>
        <div className="grid grid-cols-10 gap-1.5">
          {calendarDays.map((d, i) => (
            <motion.div
              key={`day-${d.date}-${i}`}
              whileHover={{ scale: 1.3 }}
              title={`Day ${d.date}`}
              className="aspect-square rounded-md"
              style={{
                background: d.active
                  ? "var(--theme-accent, #00d4ff)"
                  : "rgba(255,255,255,0.05)",
                boxShadow: d.active
                  ? "0 0 8px var(--theme-accent, #00d4ff)"
                  : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
      {logs.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-exo font-bold text-white text-lg mb-4">
            Recent Workouts
          </h3>
          <div className="space-y-3">
            {logs
              .slice(-5)
              .reverse()
              .map((log, i) => (
                <motion.div
                  key={log.completedAt.toString()}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`dashboard.workouts.item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <div className="text-sm text-white font-exo">
                      Workout #{i + 1}
                    </div>
                    <div className="text-xs text-white">
                      {formatTimestamp(log.completedAt)}
                    </div>
                  </div>
                  <div
                    className="font-orbitron font-bold text-sm"
                    style={{ color: "#fbbf24" }}
                  >
                    +{Number(log.xpAwarded)} XP
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
