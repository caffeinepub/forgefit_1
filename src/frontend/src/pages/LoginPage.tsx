import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1
            className="font-orbitron font-black text-3xl neon-text-blue mb-2"
            style={{ color: "#00d4ff" }}
          >
            Welcome Back
          </h1>
          <p className="text-white">Sign in to your FORGEFIT account</p>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
          }}
        >
          <p className="text-white text-sm mb-4">
            FORGEFIT uses{" "}
            <strong className="text-[#00d4ff]">Internet Identity</strong> — a
            secure, passwordless authentication system. No email or password
            required.
          </p>
          <ul className="text-white text-sm space-y-1">
            <li>✔ No passwords to remember</li>
            <li>✔ Cryptographically secure</li>
            <li>✔ Your data stays on-chain</li>
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={isLoggingIn}
          data-ocid="auth.submit_button"
          className="w-full py-4 rounded-xl btn-neon-blue font-exo font-bold text-lg flex items-center justify-center gap-3"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" /> Sign In with Internet Identity
            </>
          )}
        </motion.button>

        <p className="text-center text-white text-sm mt-6">
          New to FORGEFIT?{" "}
          <a href="/register" className="text-[#8b5cf6] hover:underline">
            Create an account
          </a>
        </p>
      </motion.div>
    </div>
  );
}
