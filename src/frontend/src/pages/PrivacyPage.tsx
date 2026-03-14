import { motion } from "motion/react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 md:p-12"
      >
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          Privacy <span style={{ color: "#00d4ff" }}>Policy</span>
        </h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

        {[
          {
            title: "1. Information We Collect",
            body: "FORGEFIT collects information you provide directly, including your username, fitness goals, workout logs, body metrics, and any content you post on the platform. We also collect usage data and performance analytics to improve your experience.",
          },
          {
            title: "2. How We Use Your Information",
            body: "Your information is used to provide and improve our services, personalize your experience, calculate XP and achievements, display leaderboards, and facilitate community features. We do not sell your personal information to third parties.",
          },
          {
            title: "3. Data Storage",
            body: "FORGEFIT operates on the Internet Computer blockchain. Your data is stored in Motoko canisters, which are decentralized and tamper-proof. This means your fitness data is secured by cryptographic guarantees.",
          },
          {
            title: "4. Authentication",
            body: "We use Internet Identity for authentication, which means we never store passwords. Your identity is secured through public-key cryptography, giving you full control over your account.",
          },
          {
            title: "5. Data Sharing",
            body: "Some profile information (username, level, XP, achievements) may be visible to other users through leaderboards and community features. You control what fitness goals and body metrics are shared publicly.",
          },
          {
            title: "6. Your Rights",
            body: "You have the right to access, modify, or delete your personal data. You can update your profile at any time or contact the platform administrators to request data deletion.",
          },
          {
            title: "7. Cookies",
            body: "FORGEFIT uses minimal local storage for session management and user preferences. We do not use advertising cookies or third-party tracking.",
          },
          {
            title: "8. Contact",
            body: "For privacy-related inquiries, please reach out through the platform's community channels or official support.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="mb-8">
            <h2
              className="font-exo font-bold text-white text-lg mb-3"
              style={{ color: "#8b5cf6" }}
            >
              {title}
            </h2>
            <p className="text-gray-400 leading-relaxed">{body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
