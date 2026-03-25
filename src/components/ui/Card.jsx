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
    default: "card-playful",
    yellow: "card-playful-yellow",
    green: "card-playful-green",
    light: "bg-white/90 backdrop-blur-md rounded-3xl border-2 border-sky-100 shadow-xl",
    solid: "bg-white rounded-3xl shadow-2xl border-4 border-secondary",
    highlight: "card-playful border-primary shadow-[0_12px_0_#ca8a04]",
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
