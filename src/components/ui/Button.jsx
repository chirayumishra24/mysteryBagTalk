import { useRef } from "react";
import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon,
}) {
  const ref = useRef(null);

  const baseClasses =
    "relative font-display font-bold rounded-2xl transition-all duration-200 cursor-pointer select-none overflow-hidden group border-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-teal-400 text-white border-cyan-400/30 shadow-[0_6px_0_#0e7490,0_0_30px_rgba(103,232,249,0.15)] active:shadow-[0_2px_0_#0e7490] active:translate-y-[4px] hover:from-cyan-400 hover:to-teal-300",
    secondary:
      "bg-gradient-to-r from-pink-500 to-orange-400 text-white border-pink-400/30 shadow-[0_6px_0_#be185d,0_0_30px_rgba(244,114,182,0.15)] active:shadow-[0_2px_0_#be185d] active:translate-y-[4px] hover:from-pink-400 hover:to-orange-300",
    accent:
      "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 border-amber-300/30 shadow-[0_6px_0_#b45309,0_0_30px_rgba(251,191,36,0.15)] active:shadow-[0_2px_0_#b45309] active:translate-y-[4px] hover:from-amber-300 hover:to-yellow-200",
    ghost:
      "bg-white/10 text-cyan-200 border-cyan-500/15 hover:bg-white/15 shadow-none backdrop-blur-sm",
    outline:
      "border-2 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 shadow-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-lg",
    lg: "px-12 py-5 text-xl",
    xl: "px-16 py-6 text-2xl",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
      whileHover={disabled ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {/* Glossy sea-glass reflection */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-xl" />

      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm uppercase tracking-wider">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}
