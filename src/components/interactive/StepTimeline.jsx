import { motion } from "framer-motion";

const stepGradients = [
  "linear-gradient(135deg, #ffd700, #ff8c00)",
  "linear-gradient(135deg, #7c3aed, #6d28d9)",
  "linear-gradient(135deg, #2dd4bf, #0d9488)",
  "linear-gradient(135deg, #e74c3c, #c0392b)",
  "linear-gradient(135deg, #ff6b9d, #ec4899)",
];

export default function StepTimeline({ steps }) {
  return (
    <div className="relative pl-10 space-y-8">
      {/* Vertical line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-1 rounded-full"
        style={{
          background: "linear-gradient(180deg, #ffd700, #7c3aed, #2dd4bf, #e74c3c, #ff6b9d)",
          opacity: 0.4,
        }}
      />

      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2, duration: 0.6, type: "spring" }}
          className="relative"
        >
          {/* Numbered dot */}
          <div
            className="absolute -left-6 top-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10"
            style={{
              background: stepGradients[i % stepGradients.length],
              color: i === 0 ? "#1a1a2e" : "#fff",
              boxShadow: `0 4px 15px ${["rgba(255, 215, 0, 0.4)", "rgba(124, 58, 237, 0.4)", "rgba(45, 212, 191, 0.4)", "rgba(231, 76, 60, 0.4)", "rgba(255, 107, 157, 0.4)"][i % 5]}`,
            }}
          >
            {i + 1}
          </div>

          <motion.div
            whileHover={{ scale: 1.01, x: 4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="p-5 md:p-6">
              <h4
                className="text-lg md:text-xl font-bold mb-3"
                style={{
                  background: stepGradients[i % stepGradients.length],
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {step.title}
              </h4>

              {step.description && (
                <p className="text-gray-300 mb-3 font-semibold">{step.description}</p>
              )}

              {step.image && (
                <motion.img
                  src={step.image}
                  alt={step.title}
                  className="w-28 h-28 object-contain mx-auto my-4"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {step.items && (
                <ul className="space-y-2 mt-2">
                  {step.items.map((item, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 + j * 0.1 }}
                      className="flex items-start gap-3 text-gray-200"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                        style={{
                          background: stepGradients[i % stepGradients.length],
                          color: i === 0 ? "#1a1a2e" : "#fff",
                        }}
                      >
                        ★
                      </span>
                      <span className="font-semibold">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {step.note && (
                <div
                  className="mt-4 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255, 215, 0, 0.06)",
                    border: "1px solid rgba(255, 215, 0, 0.15)",
                  }}
                >
                  <p className="text-yellow-200/80 text-sm font-semibold italic">
                    💡 {step.note}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
