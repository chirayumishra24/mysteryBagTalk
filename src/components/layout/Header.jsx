import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative py-8 px-4 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "var(--accent-gold)" }} />
      <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: "var(--accent-purple)" }} />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 relative z-10"
      >
        {/* Mascot with glow ring */}
        <motion.div
          className="relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rounded-full blur-xl opacity-40" style={{ background: "var(--accent-gold)" }} />
          <img
            src="/images/characters/oliver-mascot.png"
            alt="Oliver the Owl"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover relative z-10"
            style={{
              border: "3px solid rgba(255, 215, 0, 0.5)",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0,0,0,0.3)",
            }}
          />
        </motion.div>

        {/* Title with gradient text */}
        <div className="text-center">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
            style={{
              background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 40%, #ff8c00 70%, #ffd700 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))",
            }}
          >
            Mystery Bag Talk
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base mt-2 font-semibold tracking-wide"
            style={{ color: "rgba(255, 255, 255, 0.4)" }}
          >
            Oliver's Magic Toy Shop Adventure
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mt-3 h-0.5 w-32 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)" }}
          />
        </div>
      </motion.div>
    </header>
  );
}
