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
          className="fixed bottom-0 right-0 top-0 z-[200] w-96 overflow-y-auto border-l border-[#ffd8c2] bg-[#fff9f3]/95 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="flex items-center gap-2 text-xl font-display font-bold text-[#432414]">
              🧑‍🏫 Teacher Mode
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-[#ff7a45] transition-colors hover:text-[#d95b25]"
            >
              ✕
            </button>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="mb-8">
            <h3 className="mb-4 text-sm font-display font-bold uppercase tracking-wider text-[#9b5430]">
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
                <div key={key} className="flex items-center justify-between rounded-xl border border-[#ffd8c2] bg-white p-3">
                  <kbd className="rounded border border-[#ffd8c2] bg-[#fff4ea] px-2 py-1 text-xs font-mono text-[#86401b]">
                    {key}
                  </kbd>
                  <span className="text-sm font-body text-[#654331]">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Objects Input */}
          <div className="mb-8">
            <h3 className="mb-4 text-sm font-display font-bold uppercase tracking-wider text-[#9b5430]">
              Custom Objects
            </h3>
            <p className="mb-3 text-xs font-body text-[#8a6a56]">
              Enter comma-separated object names. These will replace the default list.
            </p>
            <textarea
              value={customObjects}
              onChange={(e) => setCustomObjects(e.target.value)}
              placeholder="pencil, eraser, key, ball, scissors..."
              className="h-28 w-full resize-none rounded-xl border border-[#ffd8c2] bg-white p-3 text-sm font-body text-[#654331] placeholder:text-[#b69380] focus:border-[#ffb087] focus:outline-none"
            />
            <button
              onClick={handleSaveObjects}
              className="mt-3 w-full rounded-xl bg-[linear-gradient(135deg,#fb923c,#fb7185)] py-2.5 text-sm font-display font-semibold text-white transition-colors hover:opacity-95"
            >
              Save Custom Objects
            </button>
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="mb-4 text-sm font-display font-bold uppercase tracking-wider text-[#9b5430]">
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
      <p className="py-6 text-center text-sm font-body italic text-[#9d7d68]">
        No entries yet. Complete a game round to populate the leaderboard!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-[#ffd8c2] bg-white p-3"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#fff4ea]">
            <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 5, 2]} intensity={1} />
              <Suspense fallback={null}>
                <Avatar3D name={entry.avatar} isSelected={false} />
              </Suspense>
            </Canvas>
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-display font-semibold text-[#654331]">
              {entry.name}
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: entry.stars }).map((_, j) => (
                <span key={j} className="text-xs">⭐</span>
              ))}
            </div>
          </div>
          <span className="text-xs font-mono text-[#9b5430]">#{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
