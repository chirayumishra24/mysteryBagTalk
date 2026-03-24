import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  variant = "default",
  animate = true,
  delay = 0,
  onClick,
}) {
  const variants = {
    default: "glass",
    light: "glass-light",
    solid:
      "bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border border-purple-500/20 rounded-2xl",
    highlight:
      "glass border-purple-400/30 glow-purple",
  };

  const Component = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay, ease: "easeOut" },
        ...(onClick ? { whileHover: { scale: 1.02, y: -2 } } : {})
      }
    : {};

  return (
    <Component
      className={`p-6 ${variants[variant]} ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      {...animateProps}
    >
      {children}
    </Component>
  );
}
