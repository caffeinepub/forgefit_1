import { getTierClass } from "../lib/forgefit";

export default function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider ${getTierClass(tier)}`}
    >
      {tier?.toUpperCase()} TIER
    </span>
  );
}
