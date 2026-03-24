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
    "relative font-display font-semibold rounded-2xl transition-colors duration-300 cursor-pointer select-none overflow-hidden group";

  const variants = {
    primary:
      "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    secondary:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    accent:
      "bg-pink-500 text-white hover:bg-pink-400 shadow-[0_0_30px_rgba(244,114,182,0.3)]",
    ghost:
      "glass text-purple-200 hover:text-white hover:border-purple-400/40",
    outline:
      "border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 shadow-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg",
    xl: "px-14 py-5 text-xl",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Liquid background glow hover element */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden rounded-2xl pointer-events-none">
        <motion.div
           className="absolute w-24 h-24 bg-white/20 blur-xl rounded-full"
           style={{ 
             left: useTransform(mouseXSpring, (v) => `calc(50% + ${v * 4}px - 48px)`),
             top: useTransform(mouseYSpring, (v) => `calc(50% + ${v * 4}px - 48px)`)
           }}
        />
      </div>

      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}
