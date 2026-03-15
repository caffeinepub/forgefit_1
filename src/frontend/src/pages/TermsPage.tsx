import { motion } from "motion/react";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 md:p-12"
      >
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          Terms of <span style={{ color: "#8b5cf6" }}>Service</span>
        </h1>
        <p className="text-white text-sm mb-8">Last updated: March 2026</p>

        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing and using FORGEFIT, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.",
          },
          {
            title: "2. Use of Service",
            body: "FORGEFIT is provided for personal fitness tracking and community engagement. You agree to use the service in a lawful manner and not to misuse, hack, or attempt to exploit the platform.",
          },
          {
            title: "3. User Accounts",
            body: "You are responsible for maintaining the security of your Internet Identity credentials. You are responsible for all activities that occur under your account.",
          },
          {
            title: "4. User Content",
            body: "You retain ownership of content you create on FORGEFIT. By posting content, you grant FORGEFIT a license to display and use that content within the platform.",
          },
          {
            title: "5. Prohibited Conduct",
            body: "Users may not post offensive, harmful, or misleading content. Harassment, spam, and cheating on leaderboards are strictly prohibited and may result in account suspension or banning.",
          },
          {
            title: "6. Health Disclaimer",
            body: "FORGEFIT provides fitness information for educational purposes only. Always consult a healthcare professional before starting any exercise program. We are not responsible for any health outcomes.",
          },
          {
            title: "7. Modifications to Service",
            body: "FORGEFIT reserves the right to modify, suspend, or discontinue any aspect of the service at any time. We will provide reasonable notice where possible.",
          },
          {
            title: "8. Limitation of Liability",
            body: "FORGEFIT is provided 'as is' without warranties of any kind. We are not liable for any damages arising from your use of the platform.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="mb-8">
            <h2
              className="font-exo font-bold text-lg mb-3"
              style={{ color: "#00d4ff" }}
            >
              {title}
            </h2>
            <p className="text-white leading-relaxed">{body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
