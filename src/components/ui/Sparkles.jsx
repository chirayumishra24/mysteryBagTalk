import { useEffect, useState } from "react";

export default function Sparkles() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 3,
      color: Math.random() > 0.7 ? "var(--accent-purple)" : "var(--accent-gold)",
    }));
    setSparkles(arr);
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            animation: `sparkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Large ambient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{ background: "var(--accent-gold)", top: "20%", left: "-10%" }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{ background: "var(--accent-purple)", bottom: "10%", right: "-5%" }}
      />
    </div>
  );
}
