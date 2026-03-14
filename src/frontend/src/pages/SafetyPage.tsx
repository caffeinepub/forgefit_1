import { AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-8 flex items-start gap-4"
        style={{
          background: "rgba(245,158,11,0.15)",
          border: "2px solid rgba(245,158,11,0.5)",
          boxShadow: "0 0 20px rgba(245,158,11,0.2)",
        }}
      >
        <AlertTriangle
          className="w-8 h-8 flex-shrink-0"
          style={{ color: "#f59e0b" }}
        />
        <div>
          <h2 className="font-orbitron font-bold text-xl text-amber-400 mb-2">
            Important Safety Warning
          </h2>
          <p className="text-amber-200/80 leading-relaxed">
            Exercise can be physically demanding and carries inherent risks.
            Always consult with a qualified healthcare professional or certified
            personal trainer before beginning any new exercise program,
            especially if you have existing health conditions.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-8 md:p-12"
      >
        <h1 className="font-orbitron font-black text-3xl text-white mb-8">
          Fitness <span style={{ color: "#f59e0b" }}>Safety</span> Guidelines
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[
            {
              title: "Always Warm Up",
              desc: "Spend 5-10 minutes warming up before any workout. Dynamic stretching and light cardio prepare your body and reduce injury risk.",
            },
            {
              title: "Use Proper Form",
              desc: "Technique is more important than weight. Bad form is the leading cause of exercise injuries. Watch instructional videos and consider working with a trainer.",
            },
            {
              title: "Listen to Your Body",
              desc: "Distinguish between productive muscle fatigue and pain. Sharp or shooting pains are warning signs — stop immediately and rest.",
            },
            {
              title: "Progress Gradually",
              desc: "Follow the 10% rule: don't increase training volume or intensity by more than 10% per week. Slow, steady progression prevents overuse injuries.",
            },
            {
              title: "Rest and Recovery",
              desc: "Muscles grow during rest, not during exercise. Allow 48 hours between training the same muscle groups. Prioritize 7-9 hours of sleep.",
            },
            {
              title: "Stay Hydrated",
              desc: "Drink water before, during, and after exercise. Dehydration impairs performance and increases injury risk. Aim for 2.5-3.7 liters daily.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-3">
              <CheckCircle
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#06ffd4" }}
              />
              <div>
                <h3 className="font-exo font-bold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,0,110,0.08)",
            border: "1px solid rgba(255,0,110,0.2)",
          }}
        >
          <h3 className="font-exo font-bold text-white mb-3">
            Medical Disclaimer
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            The information provided on FORGEFIT is for educational and
            informational purposes only and is not intended as medical advice.
            The content on this platform is not a substitute for professional
            medical advice, diagnosis, or treatment. Always seek the guidance of
            your physician or other qualified health provider with any questions
            you may have regarding a medical condition or before undertaking a
            new health care regimen. Never disregard professional medical advice
            or delay in seeking it because of something you have read on
            FORGEFIT.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
