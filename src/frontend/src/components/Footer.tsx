import { Link } from "@tanstack/react-router";
import { Dumbbell, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-white/10 glass-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="w-5 h-5" style={{ color: "#00d4ff" }} />
              <span className="font-orbitron font-black text-lg neon-text-blue">
                FORGEFIT
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The premium gamified fitness platform. Track your progress, earn
              XP, compete with others, and forge your ultimate strength.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Exercises", to: "/exercises" },
                { label: "Leaderboard", to: "/leaderboard" },
                { label: "Challenges", to: "/challenges" },
                { label: "Fitness Tools", to: "/tools" },
                { label: "Mini Games", to: "/games" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Safety Disclaimer", to: "/safety" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            &copy; {year}. Built with{" "}
            <Heart className="w-3 h-3 inline text-red-400" /> using{" "}
            <a
              href={caffeineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="text-gray-600 text-xs">
            ⚠️ Always consult a healthcare professional before starting any
            fitness program.
          </div>
        </div>
      </div>
    </footer>
  );
}
