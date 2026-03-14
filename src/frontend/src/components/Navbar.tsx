import { Link, useLocation } from "@tanstack/react-router";
import { Dumbbell, LogIn, LogOut, Menu, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Exercises", to: "/exercises" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Challenges", to: "/challenges" },
  { label: "Community", to: "/community" },
  { label: "Tools", to: "/tools" },
  { label: "Games", to: "/games" },
  { label: "Wellness", to: "/wellness" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const location = useLocation();
  const isLoggedIn = !!identity;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(0,212,255,0.2)",
              border: "1px solid rgba(0,212,255,0.4)",
            }}
          >
            <Dumbbell className="w-4 h-4" style={{ color: "#00d4ff" }} />
          </div>
          <span className="font-orbitron font-black text-lg neon-text-blue tracking-wider">
            FORGEFIT
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "text-[#00d4ff] bg-[rgba(0,212,255,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/messages"
                data-ocid="nav.link"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Messages
              </Link>
              <NotificationBell />
              <Link
                to="/profile"
                data-ocid="nav.link"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md btn-neon-blue text-sm font-medium"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <button
                type="button"
                onClick={() => clear()}
                data-ocid="nav.button"
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              data-ocid="nav.button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg btn-neon-blue text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          data-ocid="nav.button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden glass-card border-t border-white/10 px-4 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2">
                    <NotificationBell />
                  </div>
                  <Link
                    to="/profile"
                    data-ocid="nav.link"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-sm text-[#00d4ff]"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    login();
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg btn-neon-blue text-sm font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
