import { motion } from "framer-motion";

const tabMeta = {
  "1-1": { label: "Introduction", icon: "🌟" },
  "1-2": { label: "Watch & Learn", icon: "🎬" },
  "1-3": { label: "Quick Practice", icon: "🔍" },
  "2-1": { label: "The Mission", icon: "🎯" },
  "2-2": { label: "Discussion", icon: "💬" },
  "2-3": { label: "Takeaways", icon: "🏆" },
};

export default function TabNavigation({ modules, activeChapter, onSelectChapter }) {
  // Flatten all chapters
  const allChapters = modules.flatMap((m) => m.chapters);

  return (
    <nav className="sticky top-0 z-30 py-3 px-4" style={{
      background: "linear-gradient(180deg, rgba(13, 10, 30, 0.98) 0%, rgba(22, 33, 62, 0.95) 100%)",
      backdropFilter: "blur(20px)",
      borderBottom: "2px solid rgba(255, 215, 0, 0.15)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 justify-center flex-wrap">
          {allChapters.map((ch, i) => {
            const meta = tabMeta[ch.id] || { label: ch.id, icon: "📖" };
            const isActive = activeChapter === ch.id;

            return (
              <motion.button
                key={ch.id}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectChapter(ch.id)}
                className="relative group"
                style={{
                  padding: "10px 22px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: isActive ? "2px solid rgba(255, 215, 0, 0.6)" : "2px solid rgba(255, 255, 255, 0.08)",
                  background: isActive
                    ? "linear-gradient(135deg, #ffd700 0%, #ffaa00 50%, #ff8c00 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
                  color: isActive ? "#1a1a2e" : "rgba(255, 255, 255, 0.5)",
                  boxShadow: isActive
                    ? "0 4px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                    : "none",
                }}
              >
                {/* Glow effect behind active tab */}
                {isActive && (
                  <motion.div
                    layoutId="tabGlow"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                      filter: "blur(12px)",
                      opacity: 0.3,
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <span className="flex items-center gap-2">
                  <span className="text-base">{meta.icon}</span>
                  <span className="hidden sm:inline">{meta.label}</span>
                  <span className="sm:hidden">{ch.tabLabel}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
