// FORGEFIT utility functions and constants

export const LEVEL_TITLES: Record<number, string> = {
  1: "Beginner",
  5: "Trainee",
  10: "Athlete",
  20: "Elite",
  50: "Legend",
};

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legend";
  if (level >= 20) return "Elite";
  if (level >= 10) return "Athlete";
  if (level >= 5) return "Trainee";
  return "Beginner";
}

export function getXpForLevel(level: number): number {
  // XP thresholds: Level 1=0, Level 5=500, Level 10=2000, Level 20=8000, Level 50=50000
  if (level <= 1) return 0;
  if (level <= 5) return (level - 1) * 125;
  if (level <= 10) return 500 + (level - 5) * 300;
  if (level <= 20) return 2000 + (level - 10) * 600;
  return 8000 + (level - 20) * 1400;
}

export function getLevelFromXp(xp: number): number {
  if (xp >= 50000) return 50;
  if (xp >= 8000) return 20 + Math.floor((xp - 8000) / 1400);
  if (xp >= 2000) return 10 + Math.floor((xp - 2000) / 600);
  if (xp >= 500) return 5 + Math.floor((xp - 500) / 300);
  return 1 + Math.floor(xp / 125);
}

export function getXpProgress(xp: number): {
  current: number;
  needed: number;
  percent: number;
  level: number;
} {
  const level = getLevelFromXp(xp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const current = xp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  const percent = Math.min(100, (current / needed) * 100);
  return { current, needed, percent, level };
}

export const TIER_XP: Record<string, number> = {
  S: 80,
  A: 40,
  B: 20,
  C: 10,
};

export const ACHIEVEMENTS = [
  {
    id: 1,
    name: "First Workout",
    icon: "🏋️",
    description: "Complete your first workout",
  },
  {
    id: 2,
    name: "7-Day Streak",
    icon: "🔥",
    description: "Maintain a 7-day workout streak",
  },
  {
    id: 3,
    name: "30-Day Streak",
    icon: "⚡",
    description: "Maintain a 30-day workout streak",
  },
  {
    id: 4,
    name: "100 Workouts",
    icon: "💯",
    description: "Complete 100 total workouts",
  },
  {
    id: 5,
    name: "S-Tier Master",
    icon: "👑",
    description: "Complete 10 S-Tier exercises",
  },
  {
    id: 6,
    name: "Top 10",
    icon: "🏆",
    description: "Reach top 10 on the leaderboard",
  },
  {
    id: 7,
    name: "Challenge Champion",
    icon: "🎯",
    description: "Complete a challenge",
  },
  { id: 8, name: "Level 10", icon: "⭐", description: "Reach Level 10" },
  { id: 9, name: "Level 20", icon: "💫", description: "Reach Level 20" },
  { id: 10, name: "Level 50", icon: "🌟", description: "Reach Level 50" },
  {
    id: 11,
    name: "Consistency King",
    icon: "📅",
    description: "Work out 30 days in a month",
  },
  { id: 12, name: "Iron Will", icon: "🛡️", description: "Complete 50 workouts" },
];

export const FITNESS_GOALS = [
  "Strength Building",
  "Weightlifting",
  "Fat Loss",
  "Athletic Performance",
  "Mobility & Flexibility",
  "General Fitness",
  "Endurance/Cardio",
  "Home Workouts",
];

export function getTierClass(tier: string): string {
  switch (tier?.toUpperCase()) {
    case "S":
      return "tier-s";
    case "A":
      return "tier-a";
    case "B":
      return "tier-b";
    case "C":
      return "tier-c";
    default:
      return "tier-c";
  }
}

export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString();
}

export function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
