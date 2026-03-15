import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  Dumbbell,
  Flame,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  type CalisthenicsExercise,
  calisthenicsExercises,
  stretchExercises,
  warmUpExercises,
} from "../data/calisthenicsExercises";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  push: "Push",
  pull: "Pull",
  core: "Core",
  lower: "Lower Body",
  static: "Static Holds",
  fullbody: "Full Body",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  push: <Dumbbell className="w-4 h-4" />,
  pull: <Zap className="w-4 h-4" />,
  core: <Flame className="w-4 h-4" />,
  lower: <Star className="w-4 h-4" />,
  static: <Trophy className="w-4 h-4" />,
  fullbody: <CheckCircle className="w-4 h-4" />,
};

const TIER_CLASSES: Record<string, string> = {
  C: "tier-c",
  B: "tier-b",
  A: "tier-a",
  S: "tier-s",
};

const TIER_COLORS: Record<string, string> = {
  C: "#06ffd4",
  B: "#00d4ff",
  A: "#8b5cf6",
  S: "#ffd700",
};

export default function CalisthenicsPage() {
  const libraryRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [selectedExercise, setSelectedExercise] =
    useState<CalisthenicsExercise | null>(null);
  const [loggedIds, setLoggedIds] = useState<Set<string>>(new Set());

  const scrollToLibrary = () => {
    libraryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered = calisthenicsExercises.filter((ex) => {
    if (category !== "all" && ex.category !== category) return false;
    if (tier !== "all" && ex.tier !== tier) return false;
    if (difficulty !== "all" && ex.difficulty !== difficulty) return false;
    return true;
  });

  const handleLog = (ex: CalisthenicsExercise) => {
    if (loggedIds.has(ex.id)) return;
    setLoggedIds((prev) => new Set([...prev, ex.id]));
    toast.success(`+${ex.xp} XP earned!`, {
      description: `Great work on ${ex.name}! Keep pushing your limits.`,
      icon: "⚡",
    });
    setSelectedExercise(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 hero-grid-bg">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-blue absolute w-96 h-96 -top-20 -left-20 rounded-full" />
          <div className="orb-purple absolute w-80 h-80 top-10 right-10 rounded-full" />
          <div className="orb-cyan absolute w-64 h-64 bottom-0 left-1/2 rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              style={{ border: "1px solid rgba(0,212,255,0.3)" }}
            >
              <Zap className="w-4 h-4" style={{ color: "#00d4ff" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#00d4ff" }}
              >
                90+ Exercises · 4 Tiers · Full Gamification
              </span>
            </div>

            <h1 className="font-orbitron font-black text-4xl md:text-6xl leading-tight mb-6">
              <span className="neon-text-blue" style={{ color: "#00d4ff" }}>
                Calisthenics –
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #06ffd4, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Master Your Bodyweight Strength
              </span>
            </h1>

            <p
              className="text-lg max-w-2xl mx-auto mb-10"
              style={{ color: "#ffffff" }}
            >
              Train using your own bodyweight to build strength, control,
              balance, and endurance. Progress from C-tier beginner to S-tier
              elite with structured, gamified training.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={scrollToLibrary}
                data-ocid="calisthenics.hero.primary_button"
                className="px-8 py-3 rounded-xl font-bold text-lg btn-neon-blue transition-all"
                style={{ color: "#00d4ff" }}
              >
                Explore Exercises
              </button>
              <button
                type="button"
                onClick={scrollToLibrary}
                data-ocid="calisthenics.hero.secondary_button"
                className="px-8 py-3 rounded-xl font-bold text-lg btn-neon-cyan transition-all"
                style={{ color: "#06ffd4" }}
              >
                Start Training
              </button>
              <Link
                to="/challenges"
                data-ocid="calisthenics.challenges.link"
                className="px-8 py-3 rounded-xl font-bold text-lg btn-neon-purple text-center transition-all"
                style={{ color: "#ffffff" }}
              >
                View Challenges
              </Link>
            </div>
          </motion.div>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mt-12"
          >
            {[
              {
                label: "Total Exercises",
                value: `${calisthenicsExercises.length}+`,
              },
              { label: "Categories", value: "6" },
              { label: "Max XP/Exercise", value: "80 XP" },
              { label: "Difficulty Tiers", value: "C → S" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card px-5 py-3 rounded-xl"
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="text-xl font-black font-orbitron"
                  style={{ color: "#00d4ff" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#ffffff" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SAFETY NOTICE ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6"
          style={{
            border: "1px solid rgba(255, 200, 0, 0.4)",
            boxShadow: "0 0 20px rgba(255,200,0,0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6" style={{ color: "#ffc800" }} />
            <h2
              className="font-orbitron font-bold text-lg"
              style={{ color: "#ffc800" }}
            >
              Safety Precautions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "⚠️ Always warm up before training",
              "🎯 Maintain proper form throughout every rep",
              "🛑 Stop immediately if you feel pain or dizziness",
              "📈 Progress gradually from beginner exercises",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{
                  background: "rgba(255,200,0,0.05)",
                  border: "1px solid rgba(255,200,0,0.15)",
                }}
              >
                <span className="text-sm text-white">{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── WARM-UP ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-orbitron font-bold text-2xl mb-2"
            style={{ color: "#00d4ff" }}
          >
            🔥 Recommended Warm-Up
          </h2>
          <p className="mb-6" style={{ color: "#ffffff" }}>
            Complete this sequence before every calisthenics session.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {warmUpExercises.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-xl p-4 text-center"
                style={{ border: "1px solid rgba(0,212,255,0.2)" }}
              >
                <div className="text-2xl mb-2">🟢</div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: "#ffffff" }}
                >
                  {w.name}
                </div>
                <div className="text-xs mt-1" style={{ color: "#00d4ff" }}>
                  {w.duration}
                </div>
                <div
                  className="text-xs mt-1 leading-snug"
                  style={{ color: "#ffffff" }}
                >
                  {w.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── EXERCISE LIBRARY ─────────────────────────────────────────── */}
      <section ref={libraryRef} className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-orbitron font-bold text-2xl mb-2"
            style={{ color: "#06ffd4" }}
          >
            📚 Exercise Library
          </h2>
          <p className="mb-8" style={{ color: "#ffffff" }}>
            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  data-ocid="calisthenics.category.tab"
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === key
                      ? "btn-neon-cyan glow-cyan"
                      : "glass-card hover:bg-white/5"
                  }`}
                  style={{
                    color: category === key ? "#06ffd4" : "#ffffff",
                  }}
                >
                  {key !== "all" && CATEGORY_ICONS[key]}
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 ml-auto">
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger
                  data-ocid="calisthenics.tier.select"
                  className="w-[120px] glass-card border-white/10 text-sm"
                  style={{ color: "#ffffff" }}
                >
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="C">C Tier</SelectItem>
                  <SelectItem value="B">B Tier</SelectItem>
                  <SelectItem value="A">A Tier</SelectItem>
                  <SelectItem value="S">S Tier</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger
                  data-ocid="calisthenics.difficulty.select"
                  className="w-[145px] glass-card border-white/10 text-sm"
                  style={{ color: "#ffffff" }}
                >
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Elite">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exercise grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "#ffffff" }}>
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No exercises match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((ex, i) => (
                  <motion.div
                    key={ex.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    data-ocid={`calisthenics.exercise.item.${i + 1}`}
                    onClick={() => setSelectedExercise(ex)}
                    className="glass-card rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform group"
                    style={{
                      border: `1px solid rgba(${ex.tier === "S" ? "255,215,0" : ex.tier === "A" ? "139,92,246" : ex.tier === "B" ? "0,212,255" : "6,255,212"}, 0.2)`,
                    }}
                    whileHover={{ borderColor: `${TIER_COLORS[ex.tier]}66` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_CLASSES[ex.tier]}`}
                      >
                        {ex.tier} TIER
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#ffd700" }}
                      >
                        +{ex.xp} XP
                      </span>
                    </div>
                    <h3
                      className="font-bold mb-2 leading-snug group-hover:text-[#00d4ff] transition-colors"
                      style={{ color: "#ffffff" }}
                    >
                      {ex.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className="text-xs border-white/10"
                        style={{ color: "#ffffff" }}
                      >
                        {ex.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white/10"
                        style={{ color: "#ffffff" }}
                      >
                        {CATEGORY_LABELS[ex.category]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ex.musclesWorked.slice(0, 3).map((m) => (
                        <span
                          key={m}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(0,212,255,0.08)",
                            color: "#00d4ff",
                          }}
                        >
                          {m}
                        </span>
                      ))}
                      {ex.musclesWorked.length > 3 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#888",
                          }}
                        >
                          +{ex.musclesWorked.length - 3}
                        </span>
                      )}
                    </div>
                    {loggedIds.has(ex.id) && (
                      <div
                        data-ocid="calisthenics.log.success_state"
                        className="mt-3 text-xs text-green-400 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> Logged today
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </section>

      {/* ── STRETCHING ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-orbitron font-bold text-2xl mb-2"
            style={{ color: "#8b5cf6" }}
          >
            🧘 Post-Workout Stretching
          </h2>
          <p className="mb-6" style={{ color: "#ffffff" }}>
            Cool down and prevent soreness with these static stretches.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stretchExercises.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-xl p-4 text-center"
                style={{ border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <div className="text-2xl mb-2">🔵</div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: "#ffffff" }}
                >
                  {s.name}
                </div>
                <div className="text-xs mt-1" style={{ color: "#8b5cf6" }}>
                  {s.duration}
                </div>
                <div
                  className="text-xs mt-1 leading-snug"
                  style={{ color: "#ffffff" }}
                >
                  {s.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── EXERCISE MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedExercise && (
          <Dialog
            open={!!selectedExercise}
            onOpenChange={() => setSelectedExercise(null)}
          >
            <DialogContent
              data-ocid="calisthenics.exercise.modal"
              className="max-w-2xl max-h-[85vh] overflow-y-auto"
              style={{
                background: "#0d0d18",
                border: `1px solid ${TIER_COLORS[selectedExercise.tier]}44`,
              }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${TIER_CLASSES[selectedExercise.tier]}`}
                  >
                    {selectedExercise.tier} TIER
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#ffd700" }}
                  >
                    +{selectedExercise.xp} XP
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs border-white/10 ml-auto"
                    style={{ color: "#ffffff" }}
                  >
                    {selectedExercise.difficulty}
                  </Badge>
                </div>
                <DialogTitle
                  className="text-xl font-black font-orbitron"
                  style={{ color: "#ffffff" }}
                >
                  {selectedExercise.name}
                </DialogTitle>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedExercise.musclesWorked.map((m) => (
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
              </DialogHeader>

              <div className="space-y-5 mt-4">
                {/* Sets/Reps + Equipment */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="glass-card rounded-xl p-3"
                    style={{
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#ffffff" }}>
                      Sets × Reps
                    </div>
                    <div className="font-bold" style={{ color: "#00d4ff" }}>
                      {selectedExercise.setsReps}
                    </div>
                  </div>
                  <div
                    className="glass-card rounded-xl p-3"
                    style={{
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#ffffff" }}>
                      Equipment
                    </div>
                    <div className="font-bold" style={{ color: "#00d4ff" }}>
                      {selectedExercise.equipment.join(", ")}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4
                    className="font-bold text-sm mb-3 uppercase tracking-widest"
                    style={{ color: "#ffffff" }}
                  >
                    Step-by-Step
                  </h4>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((step, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: ordered instructions have no stable id
                      <li key={idx} className="flex gap-3 items-start">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                          style={{
                            background: `${TIER_COLORS[selectedExercise.tier]}22`,
                            color: TIER_COLORS[selectedExercise.tier],
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm" style={{ color: "#ffffff" }}>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Common Mistakes */}
                <div>
                  <h4
                    className="font-bold text-sm mb-3 uppercase tracking-widest"
                    style={{ color: "#ffffff" }}
                  >
                    Common Mistakes
                  </h4>
                  <ul className="space-y-1">
                    {selectedExercise.commonMistakes.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-sm">
                        <span style={{ color: "#ff006e" }}>✗</span>
                        <span style={{ color: "#ffffff" }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Beginner Alternatives */}
                {selectedExercise.beginnerAlternatives.length > 0 && (
                  <div>
                    <h4
                      className="font-bold text-sm mb-3 uppercase tracking-widest"
                      style={{ color: "#ffffff" }}
                    >
                      Beginner Alternatives
                    </h4>
                    <ul className="space-y-1">
                      {selectedExercise.beginnerAlternatives.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-sm">
                          <span style={{ color: "#06ffd4" }}>→</span>
                          <span style={{ color: "#ffffff" }}>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Log button */}
                <Button
                  data-ocid="calisthenics.log.primary_button"
                  onClick={() => handleLog(selectedExercise)}
                  disabled={loggedIds.has(selectedExercise.id)}
                  className="w-full font-bold text-base py-5"
                  style={{
                    background: loggedIds.has(selectedExercise.id)
                      ? "rgba(255,255,255,0.05)"
                      : `linear-gradient(135deg, ${TIER_COLORS[selectedExercise.tier]}33, ${TIER_COLORS[selectedExercise.tier]}11)`,
                    border: `1px solid ${TIER_COLORS[selectedExercise.tier]}55`,
                    color: loggedIds.has(selectedExercise.id)
                      ? "#555"
                      : TIER_COLORS[selectedExercise.tier],
                  }}
                >
                  {loggedIds.has(selectedExercise.id)
                    ? "✓ Exercise Logged"
                    : `Log Exercise · +${selectedExercise.xp} XP`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
