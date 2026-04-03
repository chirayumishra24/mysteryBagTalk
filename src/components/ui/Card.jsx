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
    light: "bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]",
    solid: "bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]",
    highlight: "card-playful-yellow border-black shadow-[8px_8px_0px_#ca8a04]",
  };

  const Component = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay, ease: "easeOut" },
        ...(onClick ? { whileHover: { scale: 1.02, x: -2, y: -2, boxShadow: "10px 10px 0px 0px #000" } } : {})
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
