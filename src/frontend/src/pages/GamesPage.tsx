import { Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// --- 1. Reaction Speed Trainer ---
type ReactionState = "idle" | "waiting" | "ready" | "clicked" | "too_early";
function ReactionGame() {
  const [state, setState] = useState<ReactionState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    setState("waiting");
    setReactionTime(null);
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setState("ready");
      startRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState("too_early");
    } else if (state === "ready") {
      const rt = Date.now() - startRef.current;
      setReactionTime(rt);
      if (!best || rt < best) setBest(rt);
      setState("clicked");
    } else {
      start();
    }
  };

  const bgColor =
    state === "waiting"
      ? "rgba(255,0,110,0.2)"
      : state === "ready"
        ? "rgba(6,255,212,0.2)"
        : "rgba(0,212,255,0.1)";
  const borderColor =
    state === "ready" ? "rgba(6,255,212,0.6)" : "rgba(255,255,255,0.1)";

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        ⚡ Reaction Trainer
      </h3>
      <div
        onClick={handleClick}
        onKeyDown={(e) => e.key === " " && handleClick()}
        className="relative h-40 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300 select-none"
        style={{
          background: bgColor,
          border: `2px solid ${borderColor}`,
          boxShadow:
            state === "ready" ? "0 0 30px rgba(6,255,212,0.4)" : "none",
        }}
      >
        {state === "idle" && (
          <p className="text-white font-exo">Click to Start</p>
        )}
        {state === "waiting" && (
          <p className="text-[#ff006e] font-exo font-bold text-lg">
            Wait for GREEN...
          </p>
        )}
        {state === "ready" && (
          <p
            className="font-orbitron font-black text-3xl"
            style={{ color: "#06ffd4", textShadow: "0 0 20px #06ffd4" }}
          >
            CLICK NOW!
          </p>
        )}
        {state === "clicked" && (
          <div className="text-center">
            <p
              className="font-orbitron font-black text-4xl"
              style={{ color: "#00d4ff" }}
            >
              {reactionTime}ms
            </p>
            <p className="text-white text-sm mt-1">Click to try again</p>
          </div>
        )}
        {state === "too_early" && (
          <div className="text-center">
            <p
              className="font-exo font-bold text-xl"
              style={{ color: "#ff006e" }}
            >
              Too Early!
            </p>
            <p className="text-white text-sm mt-1">Click to try again</p>
          </div>
        )}
      </div>
      {best && (
        <p className="text-white text-sm mt-2 text-center">
          Best: <span style={{ color: "#00d4ff" }}>{best}ms</span>
        </p>
      )}
    </div>
  );
}

// --- 2. Reflex Test ---
function ReflexTest() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const counterRef = useRef(0);

  const spawnTarget = useCallback(() => {
    const id = counterRef.current++;
    setTargets((t) => [
      ...t,
      { id, x: Math.random() * 80, y: Math.random() * 70 },
    ]);
    setTimeout(() => setTargets((t) => t.filter((tp) => tp.id !== id)), 800);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const spawner = setInterval(spawnTarget, 500);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("done");
          clearInterval(spawner);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(spawner);
      clearInterval(timer);
    };
  }, [gameState, spawnTarget]);

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameState("playing");
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-4">
        🎯 Reflex Test
      </h3>
      {gameState === "idle" || gameState === "done" ? (
        <div className="text-center py-8">
          {gameState === "done" && (
            <p
              className="font-orbitron font-black text-4xl mb-2"
              style={{ color: "#8b5cf6" }}
            >
              {score}
            </p>
          )}
          {gameState === "done" && (
            <p className="text-white mb-4">targets hit!</p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={start}
            data-ocid="games.play_button"
            className="btn-neon-purple px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />{" "}
            {gameState === "done" ? "Play Again" : "Start Game"}
          </motion.button>
        </div>
      ) : (
        <div
          className="relative h-48 rounded-xl overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="absolute top-2 left-2 font-orbitron font-bold"
            style={{ color: "#8b5cf6" }}
          >
            {timeLeft}s
          </div>
          <div
            className="absolute top-2 right-2 font-orbitron font-bold"
            style={{ color: "#00d4ff" }}
          >
            Score: {score}
          </div>
          {targets.map((t) => (
            <motion.button
              key={t.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => {
                setScore((s) => s + 1);
                setTargets((tp) => tp.filter((x) => x.id !== t.id));
              }}
              className="absolute w-10 h-10 rounded-full"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                background: "rgba(139,92,246,0.8)",
                border: "2px solid #8b5cf6",
                boxShadow: "0 0 12px #8b5cf6",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- 3. Fitness Quiz ---
const QUIZ_QUESTIONS = [
  {
    q: "How many calories in 1g of protein?",
    options: ["4 kcal", "7 kcal", "9 kcal", "11 kcal"],
    answer: 0,
  },
  {
    q: "What muscle does a bench press primarily work?",
    options: ["Biceps", "Pectorals", "Triceps", "Deltoids"],
    answer: 1,
  },
  {
    q: "How many calories in 1g of fat?",
    options: ["4 kcal", "7 kcal", "9 kcal", "12 kcal"],
    answer: 2,
  },
  {
    q: "What does HIIT stand for?",
    options: [
      "High Intensity Interval Training",
      "Heavy Iron Interval Training",
      "High Intensity Isolation Training",
      "Hybrid Intensity Interval Training",
    ],
    answer: 0,
  },
  {
    q: "How long should you rest between heavy compound sets?",
    options: ["30 seconds", "1 minute", "2-3 minutes", "10 minutes"],
    answer: 2,
  },
  {
    q: "Which macronutrient is most important for muscle repair?",
    options: ["Carbohydrates", "Fats", "Protein", "Fiber"],
    answer: 2,
  },
  {
    q: "What is the recommended daily water intake?",
    options: ["1L", "2L", "2.5-3.7L", "5L"],
    answer: 2,
  },
  {
    q: "Which exercise is best for overall leg development?",
    options: ["Leg Press", "Lunges", "Squats", "Leg Extensions"],
    answer: 2,
  },
  {
    q: "How many hours of sleep is recommended for muscle recovery?",
    options: ["4-5 hours", "6-7 hours", "7-9 hours", "10+ hours"],
    answer: 2,
  },
  {
    q: "What does BMI stand for?",
    options: [
      "Body Mass Index",
      "Basic Muscle Indicator",
      "Body Metabolism Index",
      "Base Metabolic Index",
    ],
    answer: 0,
  },
];

function FitnessQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };
  const next = () => {
    if (selected === null) return;
    const correct = selected === QUIZ_QUESTIONS[current].answer;
    if (correct) setScore((s) => s + 1);
    if (current + 1 >= QUIZ_QUESTIONS.length) setDone(true);
    else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (done) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-exo font-bold text-white text-lg mb-4">
          🦾 Fitness Quiz
        </h3>
        <div className="text-center py-8">
          <p
            className="font-orbitron font-black text-5xl mb-2"
            style={{
              color:
                score >= 7 ? "#06ffd4" : score >= 5 ? "#8b5cf6" : "#ff006e",
            }}
          >
            {score}/10
          </p>
          <p className="text-white mb-2">
            {score >= 7
              ? "Excellent! 🏆"
              : score >= 5
                ? "Good job! ⭐"
                : "Keep learning! 💪"}
          </p>
          <p className="text-white text-sm mb-6">
            {Math.round(score * 10)}% correct
          </p>
          <button
            type="button"
            onClick={reset}
            className="btn-neon-cyan px-6 py-3 rounded-xl font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[current];
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-2">
        🦾 Fitness Quiz
      </h3>
      <p className="text-white text-xs mb-4">
        {current + 1} / {QUIZ_QUESTIONS.length}
      </p>
      <div
        className="h-1 rounded-full mb-4"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(current / QUIZ_QUESTIONS.length) * 100}%`,
            background: "linear-gradient(90deg, #00d4ff, #8b5cf6)",
          }}
        />
      </div>
      <p className="text-white font-medium mb-4 leading-relaxed">{q.q}</p>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <button
            type="button"
            key={opt}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${selected === i ? "" : "glass-card text-white hover:text-white"}`}
            style={
              selected === i
                ? {
                    background: "rgba(0,212,255,0.2)",
                    border: "1px solid rgba(0,212,255,0.6)",
                    color: "#00d4ff",
                  }
                : {}
            }
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={next}
        disabled={selected === null}
        className="w-full py-2.5 rounded-xl btn-neon-blue font-bold text-sm disabled:opacity-40"
      >
        Next Question
      </button>
    </div>
  );
}

// --- 4. Dodge Junk Food ---
function DodgeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const stateRef = useRef({
    x: 200,
    vx: 0,
    score: 0,
    lives: 3,
    items: [] as { x: number; y: number; type: number; speed: number }[],
    frame: 0,
    running: false,
  });

  const ITEMS = ["🍔", "🍕", "🍩"];

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.x = 200;
    s.vx = 0;
    s.score = 0;
    s.lives = 3;
    s.items = [];
    s.frame = 0;
    s.running = true;
    setScore(0);
    setLives(3);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    const keysDown = new Set<string>();
    const onKey = (e: KeyboardEvent) => {
      keysDown.add(e.key);
      e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keysDown.delete(e.key);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    let rafId: number;
    const loop = () => {
      if (!s.running) return;
      s.frame++;

      // Move player
      if (keysDown.has("ArrowLeft") || keysDown.has("a")) s.vx = -4;
      else if (keysDown.has("ArrowRight") || keysDown.has("d")) s.vx = 4;
      else s.vx *= 0.8;
      s.x = Math.max(20, Math.min(canvas.width - 20, s.x + s.vx));

      // Spawn items
      if (s.frame % 40 === 0) {
        s.items.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -30,
          type: Math.floor(Math.random() * 3),
          speed: 2 + s.score / 200,
        });
      }

      // Update items
      s.items = s.items.filter((item) => {
        item.y += item.speed;
        if (item.y > canvas.height - 50 && Math.abs(item.x - s.x) < 30) {
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) {
            s.running = false;
            setGameState("dead");
          }
          return false;
        }
        return item.y < canvas.height;
      });

      s.score++;
      setScore(Math.floor(s.score / 10));

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(10,10,20,0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(0,212,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw player
      ctx.font = "28px serif";
      ctx.fillText("🥤", s.x - 14, canvas.height - 20);

      // Draw items
      for (const item of s.items) {
        ctx.font = "24px serif";
        ctx.fillText(ITEMS[item.type], item.x - 12, item.y);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState]);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-exo font-bold text-white text-lg mb-2">
        🎮 Dodge Junk Food
      </h3>
      {gameState === "idle" || gameState === "dead" ? (
        <div className="text-center py-6">
          {gameState === "dead" && (
            <>
              <p
                className="font-orbitron font-black text-4xl mb-1"
                style={{ color: "#ff006e" }}
              >
                {score}
              </p>
              <p className="text-white mb-4">points survived!</p>
            </>
          )}
          {gameState === "idle" && (
            <p className="text-white mb-4 text-sm">
              Use arrow keys / A D to dodge falling junk food!
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={startGame}
            data-ocid="games.play_button"
            className="btn-neon-blue px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />{" "}
            {gameState === "dead" ? "Play Again" : "Start Game"}
          </motion.button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold" style={{ color: "#00d4ff" }}>
              Score: {score}
            </span>
            <span className="text-sm">
              {Array(3)
                .fill(null)
                .map((_, hIdx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static hearts array
                  <span key={hIdx} style={{ opacity: hIdx < lives ? 1 : 0.2 }}>
                    ❤️
                  </span>
                ))}
            </span>
          </div>
          <canvas
            ref={canvasRef}
            data-ocid="games.canvas_target"
            width={400}
            height={280}
            className="rounded-xl w-full"
            style={{ maxHeight: "280px" }}
          />
          <p className="text-white text-xs mt-2 text-center">
            Arrow keys or A/D to move
          </p>
        </div>
      )}
    </div>
  );
}

const GAME_TABS = [
  "Reaction Trainer",
  "Reflex Test",
  "Fitness Quiz",
  "Dodge Game",
];

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState("Reaction Trainer");

  const gameMap: Record<string, React.ReactElement> = {
    "Reaction Trainer": <ReactionGame />,
    "Reflex Test": <ReflexTest />,
    "Fitness Quiz": <FitnessQuiz />,
    "Dodge Game": <DodgeGame />,
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          Mini <span style={{ color: "#8b5cf6" }}>Games</span>
        </h1>
        <p className="text-white">
          Train your reflexes and test your fitness knowledge
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {GAME_TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-ocid="games.tab"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "" : "glass-card text-white hover:text-white"}`}
            style={
              activeTab === tab
                ? {
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.5)",
                    color: "#8b5cf6",
                  }
                : {}
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {gameMap[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
