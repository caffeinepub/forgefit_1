import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// --- BMI Calculator ---
function BMICalc() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calc = () => {
    const h = Number.parseFloat(height) / 100;
    const w = Number.parseFloat(weight);
    if (h > 0 && w > 0) setBmi(w / (h * h));
  };

  const getBmiColor = (b: number) =>
    b < 18.5 ? "#00d4ff" : b < 25 ? "#06ffd4" : b < 30 ? "#f59e0b" : "#ff006e";
  const getBmiLabel = (b: number) =>
    b < 18.5
      ? "Underweight"
      : b < 25
        ? "Normal"
        : b < 30
          ? "Overweight"
          : "Obese";

  return (
    <div
      data-ocid="tools.bmi_calculator.card"
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        📊 BMI Calculator
      </h3>
      <div className="space-y-3">
        <div>
          <Label className="text-white text-xs">Height (cm)</Label>
          <Input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            type="number"
            placeholder="170"
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-white text-xs">Weight (kg)</Label>
          <Input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            placeholder="70"
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>
        <button
          type="button"
          onClick={calc}
          className="w-full py-2 rounded-lg btn-neon-blue font-bold text-sm"
        >
          Calculate BMI
        </button>
        {bmi !== null && (
          <div
            className="text-center p-4 rounded-xl"
            style={{
              background: `${getBmiColor(bmi)}15`,
              border: `1px solid ${getBmiColor(bmi)}40`,
            }}
          >
            <p
              className="text-3xl font-orbitron font-black"
              style={{ color: getBmiColor(bmi) }}
            >
              {bmi.toFixed(1)}
            </p>
            <p className="text-sm mt-1" style={{ color: getBmiColor(bmi) }}>
              {getBmiLabel(bmi)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TDEE Calculator ---
function TDEECalc() {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("1.2");
  const [tdee, setTdee] = useState<number | null>(null);
  const calc = () => {
    const bmr =
      10 * Number.parseFloat(w) +
      6.25 * Number.parseFloat(h) -
      5 * Number.parseFloat(age) +
      5;
    setTdee(bmr * Number.parseFloat(activity));
  };
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        🔥 TDEE Calculator
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-white text-xs">Weight (kg)</Label>
            <Input
              value={w}
              onChange={(e) => setW(e.target.value)}
              type="number"
              placeholder="70"
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white text-xs">Height (cm)</Label>
            <Input
              value={h}
              onChange={(e) => setH(e.target.value)}
              type="number"
              placeholder="170"
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white text-xs">Age</Label>
            <Input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              placeholder="25"
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
        </div>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a1a] border-white/20">
            {[
              ["1.2", "Sedentary"],
              ["1.375", "Lightly Active"],
              ["1.55", "Moderately Active"],
              ["1.725", "Very Active"],
              ["1.9", "Super Active"],
            ].map(([v, l]) => (
              <SelectItem key={v} value={v} className="text-white">
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={calc}
          className="w-full py-2 rounded-lg btn-neon-purple font-bold text-sm"
        >
          Calculate TDEE
        </button>
        {tdee !== null && (
          <div
            className="text-center p-4 rounded-xl"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <p
              className="text-3xl font-orbitron font-black"
              style={{ color: "#8b5cf6" }}
            >
              {Math.round(tdee)}
            </p>
            <p className="text-sm text-white mt-1">calories/day</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Macro Calculator ---
function MacroCalc() {
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [macros, setMacros] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);
  const calc = () => {
    const cal = Number.parseFloat(calories);
    if (!cal) return;
    const adj = goal === "bulk" ? cal * 1.1 : goal === "cut" ? cal * 0.85 : cal;
    setMacros({
      protein: Math.round((adj * 0.3) / 4),
      carbs: Math.round((adj * 0.4) / 4),
      fat: Math.round((adj * 0.3) / 9),
    });
  };
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        🥩 Macro Calculator
      </h3>
      <div className="space-y-3">
        <div>
          <Label className="text-white text-xs">Daily Calories (TDEE)</Label>
          <Input
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            type="number"
            placeholder="2000"
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>
        <Select value={goal} onValueChange={setGoal}>
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a1a] border-white/20">
            <SelectItem value="bulk" className="text-white">
              Bulk (gain muscle)
            </SelectItem>
            <SelectItem value="maintain" className="text-white">
              Maintain
            </SelectItem>
            <SelectItem value="cut" className="text-white">
              Cut (lose fat)
            </SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={calc}
          className="w-full py-2 rounded-lg btn-neon-cyan font-bold text-sm"
        >
          Calculate Macros
        </button>
        {macros && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Protein", val: macros.protein, color: "#00d4ff" },
              { label: "Carbs", val: macros.carbs, color: "#06ffd4" },
              { label: "Fat", val: macros.fat, color: "#8b5cf6" },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                className="p-3 rounded-xl text-center"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                }}
              >
                <p
                  className="font-orbitron font-bold text-lg"
                  style={{ color }}
                >
                  {val}g
                </p>
                <p className="text-xs text-white mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Body Fat Estimator ---
function BodyFatCalc() {
  const [gender, setGender] = useState("male");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [h, setH] = useState("");
  const [bf, setBf] = useState<number | null>(null);
  const calc = () => {
    const n = Number.parseFloat(neck);
    const w = Number.parseFloat(waist);
    const hi = Number.parseFloat(hip);
    const ht = Number.parseFloat(h);
    if (!n || !w || !ht) return;
    if (gender === "male")
      setBf(
        495 /
          (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(ht)) -
          450,
      );
    else
      setBf(
        495 /
          (1.29579 -
            0.35004 * Math.log10(w + hi - n) +
            0.221 * Math.log10(ht)) -
          450,
      );
  };
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        📍 Body Fat Estimator
      </h3>
      <div className="space-y-3">
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a1a] border-white/20">
            <SelectItem value="male" className="text-white">
              Male
            </SelectItem>
            <SelectItem value="female" className="text-white">
              Female
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-white text-xs">Neck (cm)</Label>
            <Input
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              type="number"
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white text-xs">Waist (cm)</Label>
            <Input
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              type="number"
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
          {gender === "female" && (
            <div>
              <Label className="text-white text-xs">Hip (cm)</Label>
              <Input
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                type="number"
                className="bg-white/5 border-white/20 text-white mt-1"
              />
            </div>
          )}
          <div>
            <Label className="text-white text-xs">Height (cm)</Label>
            <Input
              value={h}
              onChange={(e) => setH(e.target.value)}
              type="number"
              className="bg-white/5 border-white/20 text-white mt-1"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={calc}
          className="w-full py-2 rounded-lg btn-neon-pink font-bold text-sm"
        >
          Estimate Body Fat
        </button>
        {bf !== null && (
          <div
            className="text-center p-4 rounded-xl"
            style={{
              background: "rgba(255,0,110,0.1)",
              border: "1px solid rgba(255,0,110,0.3)",
            }}
          >
            <p
              className="text-3xl font-orbitron font-black"
              style={{ color: "#ff006e" }}
            >
              {Math.max(0, bf).toFixed(1)}%
            </p>
            <p className="text-sm text-white mt-1">Body Fat</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Workout Timer ---
function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const inputSec = "60";
  const isCountdown = false;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (!running) {
      if (seconds === 0 && isCountdown)
        setSeconds(Number.parseInt(inputSec) || 60);
      setRunning(true);
    } else {
      setRunning(false);
    }
  };
  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (isCountdown && s <= 1) {
            setRunning(false);
            return 0;
          }
          return isCountdown ? s - 1 : s + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        ⏱️ Workout Timer
      </h3>
      <div className="text-center">
        <div
          className="font-orbitron font-black text-6xl mb-6"
          style={{
            color: running ? "#00d4ff" : "#e0e0e0",
            textShadow: running ? "0 0 20px rgba(0,212,255,0.8)" : "none",
            transition: "all 0.3s",
          }}
        >
          {format(seconds)}
        </div>
        <div className="flex gap-3 justify-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={start}
            data-ocid="tools.timer_button"
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${running ? "btn-neon-pink" : "btn-neon-blue"}`}
          >
            {running ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Start
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-4 py-3 rounded-xl btn-neon-purple"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// --- Rest Timer ---
function RestTimer() {
  const PRESETS = [30, 60, 90, 120];
  const [selected, setSelected] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (sec: number) => {
    setSelected(sec);
    setRemaining(sec);
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setRemaining(selected);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((s) => {
          if (s <= 1) {
            setRunning(false);
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Rest Complete!", {
                body: "Time to get back to work!",
              });
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        🛌 Rest Timer
      </h3>
      <div className="text-center">
        <div
          className="font-orbitron font-black text-5xl mb-4"
          style={{ color: remaining > 10 ? "#06ffd4" : "#ff006e" }}
        >
          {remaining}s
        </div>
        <div
          className="h-2 rounded-full mb-4"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${(remaining / selected) * 100}%`,
              background: "linear-gradient(90deg, #06ffd4, #00d4ff)",
            }}
          />
        </div>
        <div className="flex gap-2 justify-center mb-4">
          {PRESETS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => start(s)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${selected === s && running ? "btn-neon-cyan" : "glass-card text-white hover:text-white"}`}
            >
              {s}s
            </button>
          ))}
        </div>
        {!running && (
          <button
            type="button"
            onClick={reset}
            className="btn-neon-purple px-4 py-2 rounded-lg text-sm"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// --- Water Intake Tracker ---
function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  const GOAL = 8;
  const pct = (glasses / GOAL) * 100;
  return (
    <div
      data-ocid="tools.water_tracker.card"
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        💧 Water Tracker
      </h3>
      <div className="flex flex-col items-center">
        {/* Animated water fill */}
        <div
          className="relative w-28 h-40 mb-4 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(0,212,255,0.05)",
            border: "2px solid rgba(0,212,255,0.3)",
          }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            animate={{ height: `${pct}%` }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "linear-gradient(180deg, rgba(0,212,255,0.8), rgba(6,255,212,0.6))",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-orbitron font-black text-2xl text-white">
              {glasses}/{GOAL}
            </span>
          </div>
        </div>
        <p className="text-white text-sm mb-4">
          {glasses < GOAL
            ? `${GOAL - glasses} more glasses to go`
            : "Daily goal reached! 🎉"}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setGlasses((g) => Math.max(0, g - 1))}
            className="w-10 h-10 rounded-xl btn-neon-purple flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setGlasses((g) => Math.min(GOAL, g + 1))}
            className="w-10 h-10 rounded-xl btn-neon-blue flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Weekly Planner ---
function WeeklyPlanner() {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [plan, setPlan] = useState<Record<string, string[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []])),
  );
  const [input, setInput] = useState<Record<string, string>>({});

  const addExercise = (day: string) => {
    const val = input[day]?.trim();
    if (!val) return;
    setPlan((p) => ({ ...p, [day]: [...p[day], val] }));
    setInput((i) => ({ ...i, [day]: "" }));
  };

  return (
    <div className="glass-card rounded-2xl p-6 lg:col-span-2">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        🗓️ Weekly Planner
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAYS.map((day) => (
          <div
            key={day}
            className="rounded-xl p-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              className="font-exo font-bold text-xs text-center mb-2"
              style={{ color: "#00d4ff" }}
            >
              {day}
            </p>
            <div className="space-y-1 mb-2 min-h-16">
              {plan[day].map((ex) => (
                <div
                  key={ex}
                  className="text-xs text-white bg-white/5 rounded px-2 py-1 truncate"
                >
                  {ex}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={input[day] || ""}
                onChange={(e) =>
                  setInput((i) => ({ ...i, [day]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && addExercise(day)}
                placeholder="Add..."
                className="flex-1 text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white placeholder:text-gray-600 outline-none min-w-0"
              />
              <button
                type="button"
                onClick={() => addExercise(day)}
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0,212,255,0.2)" }}
              >
                <Plus className="w-3 h-3" style={{ color: "#00d4ff" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          Fitness <span style={{ color: "#06ffd4" }}>Tools</span>
        </h1>
        <p className="text-white">
          Professional calculators and trackers at your fingertips
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BMICalc />
        <TDEECalc />
        <MacroCalc />
        <BodyFatCalc />
        <WorkoutTimer />
        <RestTimer />
        <WaterTracker />
        <WeeklyPlanner />
      </div>
    </div>
  );
}
