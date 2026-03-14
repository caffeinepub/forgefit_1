import { Link, useParams } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Dumbbell, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import TierBadge from "../components/TierBadge";
import { EXERCISES } from "../data/exercises";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLogWorkout } from "../hooks/useQueries";
import { TIER_XP } from "../lib/forgefit";

export default function ExerciseDetailPage() {
  const { exerciseId } = useParams({ from: "/exercises/$exerciseId" });
  const exercise = EXERCISES.find((e) => e.id === Number(exerciseId));
  const { identity } = useInternetIdentity();
  const logWorkout = useLogWorkout();

  const handleLog = async () => {
    if (!identity) {
      toast.error("Please login to log workouts");
      return;
    }
    try {
      await logWorkout.mutateAsync({
        exerciseId: BigInt(exerciseId || "0"),
        notes: "",
      });
      const xp = exercise
        ? TIER_XP[exercise.tier?.toUpperCase() || "C"] || 10
        : 10;
      toast.success(`⚡ Workout logged! +${xp} XP earned!`, {
        style: {
          background: "rgba(0,212,255,0.1)",
          border: "1px solid rgba(0,212,255,0.4)",
        },
      });
    } catch {
      toast.error("Failed to log workout");
    }
  };

  if (!exercise) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">Exercise not found</p>
          <Link to="/exercises" className="btn-neon-blue px-6 py-3 rounded-xl">
            Back to Exercises
          </Link>
        </div>
      </div>
    );
  }

  const xpReward = TIER_XP[exercise.tier?.toUpperCase() || "C"] || 10;

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto"
      data-ocid="exercise.card"
    >
      <Link
        to="/exercises"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Exercises
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TierBadge tier={exercise.tier} />
              <span className="text-xs text-gray-500 capitalize">
                {exercise.difficulty}
              </span>
            </div>
            <h1 className="font-orbitron font-black text-3xl text-white mb-2">
              {exercise.name}
            </h1>
            <p className="text-gray-400 capitalize">
              {exercise.category} · {exercise.equipment}
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-orbitron font-black mb-1"
              style={{ color: "#00d4ff" }}
            >
              +{xpReward} XP
            </div>
            <p className="text-gray-500 text-sm">per completion</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLog}
          disabled={logWorkout.isPending}
          data-ocid="exercise.log_button"
          className="btn-neon-blue px-8 py-4 rounded-xl font-exo font-bold text-lg flex items-center gap-2"
        >
          {logWorkout.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Dumbbell className="w-5 h-5" />
          )}
          {logWorkout.isPending ? "Logging..." : "Log This Workout"}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-exo font-bold text-white mb-4">
              <span style={{ color: "#06ffd4" }}>Muscles Worked</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.musclesWorked.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: "rgba(6,255,212,0.1)",
                    border: "1px solid rgba(6,255,212,0.3)",
                    color: "#06ffd4",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-exo font-bold text-white mb-2">Equipment</h3>
            <p className="text-gray-300">{exercise.equipment}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-exo font-bold text-white mb-2">Sets & Reps</h3>
            <p className="text-[#00d4ff] font-exo font-bold text-xl">
              {exercise.setsReps}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-exo font-bold text-white mb-4">
              <span style={{ color: "#8b5cf6" }}>Instructions</span>
            </h3>
            <ol className="space-y-3">
              {exercise.instructions.map((step, stepIdx) => (
                <li key={step} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(139,92,246,0.2)",
                      border: "1px solid rgba(139,92,246,0.4)",
                      color: "#8b5cf6",
                    }}
                  >
                    {stepIdx + 1}
                  </span>
                  <span className="text-gray-300 text-sm leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {exercise.commonMistakes.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-exo font-bold text-white mb-4">
                <span style={{ color: "#ff006e" }}>Common Mistakes</span>
              </h3>
              <ul className="space-y-2">
                {exercise.commonMistakes.map((m) => (
                  <li key={m} className="flex gap-2 text-sm text-gray-300">
                    <AlertCircle
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#ff006e" }}
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
