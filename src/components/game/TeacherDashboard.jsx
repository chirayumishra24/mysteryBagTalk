import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import Avatar3D from "../3d/Avatar3D";

/**
 * TeacherDashboard - Hidden teacher panel (Shift+T to toggle).
 * Allows custom object entry and shows keyboard shortcuts.
 */
export default function TeacherDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [customObjects, setCustomObjects] = useState("");

  useEffect(() => {
    const toggle = () => setIsOpen((v) => !v);
    window.addEventListener("toggle-teacher-dashboard", toggle);
    return () => window.removeEventListener("toggle-teacher-dashboard", toggle);
  }, []);

  const handleSaveObjects = () => {
    try {
      const objects = customObjects
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
        .map((name) => ({ emoji: "📦", name }));
      if (objects.length > 0) {
        localStorage.setItem("customObjects", JSON.stringify(objects));
        alert(`Saved ${objects.length} custom objects! They will appear in the next game round.`);
      }
    } catch (e) {
      console.error("Error saving objects:", e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900/95 backdrop-blur-xl border-l border-purple-500/30 z-[200] p-6 overflow-y-auto shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              🧑‍🏫 Teacher Mode
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-purple-400 hover:text-white text-2xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="mb-8">
            <h3 className="text-sm font-display font-bold text-purple-300 uppercase tracking-wider mb-4">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {[
                ["Space", "Next step"],
                ["Shift + →", "Next step anywhere"],
                ["Shift + ←", "Previous step anywhere"],
                ["Shift + R", "Reset game"],
                ["Shift + T", "Toggle this panel"],
              ].map(([key, action]) => (
                <div key={key} className="flex items-center justify-between bg-purple-900/30 p-3 rounded-xl border border-purple-500/10">
                  <kbd className="bg-purple-800/50 px-2 py-1 rounded text-xs font-mono text-purple-200 border border-purple-500/30">
                    {key}
                  </kbd>
                  <span className="text-purple-100 text-sm font-body">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Objects Input */}
          <div className="mb-8">
            <h3 className="text-sm font-display font-bold text-purple-300 uppercase tracking-wider mb-4">
              Custom Objects
            </h3>
            <p className="text-purple-300/60 text-xs mb-3 font-body">
              Enter comma-separated object names. These will replace the default list.
            </p>
            <textarea
              value={customObjects}
              onChange={(e) => setCustomObjects(e.target.value)}
              placeholder="pencil, eraser, key, ball, scissors..."
              className="w-full h-28 bg-purple-900/30 border border-purple-500/20 rounded-xl p-3 text-purple-100 text-sm font-body placeholder:text-purple-400/40 focus:outline-none focus:border-purple-400 resize-none"
            />
            <button
              onClick={handleSaveObjects}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-500 text-white font-display font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Save Custom Objects
            </button>
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-sm font-display font-bold text-purple-300 uppercase tracking-wider mb-4">
              Class Leaderboard
            </h3>
            <LeaderboardDisplay />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LeaderboardDisplay() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      setEntries(stored.sort((a, b) => b.stars - a.stars).slice(0, 10));
    } catch {
      setEntries([]);
    }
  }, []);

  if (entries.length === 0) {
    return (
      <p className="text-purple-400/50 text-sm font-body italic text-center py-6">
        No entries yet. Complete a game round to populate the leaderboard!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-purple-900/30 p-3 rounded-xl border border-purple-500/10"
        >
          <div className="w-10 h-10 rounded-full bg-black/20 overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 5, 2]} intensity={1} />
              <Suspense fallback={null}>
                <Avatar3D name={entry.avatar} isSelected={false} />
              </Suspense>
            </Canvas>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-purple-100 font-display font-semibold text-sm truncate">
              {entry.name}
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: entry.stars }).map((_, j) => (
                <span key={j} className="text-xs">⭐</span>
              ))}
            </div>
          </div>
          <span className="text-purple-300 text-xs font-mono">#{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
