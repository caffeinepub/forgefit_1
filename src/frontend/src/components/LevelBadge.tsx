import { getLevelTitle } from "../lib/forgefit";

export default function LevelBadge({ level }: { level: number }) {
  const title = getLevelTitle(level);
  const colorMap: Record<string, string> = {
    Beginner: "rgba(6,255,212,0.2)",
    Trainee: "rgba(0,212,255,0.2)",
    Athlete: "rgba(139,92,246,0.2)",
    Elite: "rgba(255,0,110,0.2)",
    Legend: "rgba(255,215,0,0.2)",
  };
  const borderMap: Record<string, string> = {
    Beginner: "rgba(6,255,212,0.5)",
    Trainee: "rgba(0,212,255,0.5)",
    Athlete: "rgba(139,92,246,0.5)",
    Elite: "rgba(255,0,110,0.5)",
    Legend: "rgba(255,215,0,0.5)",
  };
  const textMap: Record<string, string> = {
    Beginner: "#06ffd4",
    Trainee: "#00d4ff",
    Athlete: "#8b5cf6",
    Elite: "#ff006e",
    Legend: "#ffd700",
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
      style={{
        background: colorMap[title],
        border: `1px solid ${borderMap[title]}`,
        color: textMap[title],
      }}
    >
      LVL {level} · {title}
    </span>
  );
}
