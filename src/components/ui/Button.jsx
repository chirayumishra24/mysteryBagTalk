import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set((mouseX - width / 2) * 0.3);
    y.set((mouseY - height / 2) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses =
    "relative font-display font-bold rounded-2xl transition-all duration-200 cursor-pointer select-none overflow-hidden group border-2 border-white/30";

  const variants = {
    primary:
      "bg-primary text-secondary-dark hover:bg-yellow-300 shadow-[0_6px_0_#ca8a04] active:shadow-[0_2px_0_#ca8a04] active:translate-y-[4px]",
    secondary:
      "bg-secondary text-white hover:bg-blue-400 shadow-[0_6px_0_#1d4ed8] active:shadow-[0_2px_0_#1d4ed8] active:translate-y-[4px]",
    accent:
      "bg-accent text-white hover:bg-green-300 shadow-[0_6px_0_#166534] active:shadow-[0_2px_0_#166534] active:translate-y-[4px]",
    ghost:
      "bg-white/20 text-blue-900 hover:bg-white/40 border-none shadow-sm",
    outline:
      "border-4 border-secondary text-secondary hover:bg-secondary/10 shadow-none",
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
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {/* Glossy Reflection Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 pointer-events-none rounded-t-xl" />

      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm uppercase tracking-wider">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}
