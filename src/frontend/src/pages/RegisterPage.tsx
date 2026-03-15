import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { FITNESS_GOALS } from "../lib/forgefit";

export default function RegisterPage() {
  const { login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (!goal) {
      toast.error("Please select a fitness goal");
      return;
    }

    setLoading(true);
    try {
      await login();
      if (actor) {
        await actor.updateCallerProfile(
          username,
          goal,
          BigInt(1),
          BigInt(0),
          BigInt(0),
          null,
        );
        toast.success("Account created! Welcome to FORGEFIT!");
        navigate({ to: "/dashboard" });
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
            Join FORGEFIT
          </h1>
          <p className="text-white">Create your warrior profile</p>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="text-white mb-2 block">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your warrior name"
              data-ocid="auth.input"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-[#00d4ff]"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Fitness Goal</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger
                data-ocid="auth.input"
                className="bg-white/5 border-white/20 text-white"
              >
                <SelectValue placeholder="Select your primary goal" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a1a] border-white/20">
                {FITNESS_GOALS.map((g) => (
                  <SelectItem
                    key={g}
                    value={g}
                    className="text-white focus:bg-white/10"
                  >
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegister}
          disabled={loading || loginStatus === "logging-in"}
          data-ocid="auth.submit_button"
          className="w-full py-4 rounded-xl btn-neon-blue font-exo font-bold text-lg flex items-center justify-center gap-3 mt-8"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" /> Create Account
            </>
          )}
        </motion.button>

        <p className="text-center text-white text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#8b5cf6] hover:underline">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
