import { motion } from "framer-motion";

const sizeClasses = {
  sm: {
    shell: "h-36 w-36 rounded-[2rem]",
    iconWrap: "h-24 w-24 rounded-[1.6rem]",
    icon: "text-5xl",
    title: "text-lg",
  },
  md: {
    shell: "h-48 w-48 rounded-[2.4rem]",
    iconWrap: "h-32 w-32 rounded-[2rem]",
    icon: "text-6xl",
    title: "text-xl",
  },
  lg: {
    shell: "h-56 w-56 rounded-[3rem]",
    iconWrap: "h-40 w-40 rounded-[2.2rem]",
    icon: "text-[5rem]",
    title: "text-2xl",
  },
  xl: {
    shell: "h-72 w-72 rounded-[3rem]",
    iconWrap: "h-52 w-52 rounded-[2.6rem]",
    icon: "text-[8rem]",
    title: "text-3xl",
  },
};

const toneClasses = {
  warm: "from-[#fff4ea] to-[#fffce7]",
  mint: "from-[#effffb] to-[#fff8db]",
  pink: "from-[#fff1f5] to-[#fff4ea]",
};

export default function MysteryToken({
  emoji = "?",
  title = "Mystery item",
  subtitle = "Keep it secret",
  size = "lg",
  tone = "warm",
  className = "",
}) {
  const classes = sizeClasses[size] || sizeClasses.lg;
  const gradient = toneClasses[tone] || toneClasses.warm;

  return (
    <motion.div
      layoutId="mystery-token-shell"
      className={`relative flex flex-col items-center justify-center border border-[#ffd8c2] bg-white/90 shadow-[0_20px_40px_rgba(249,115,22,0.12)] ${classes.shell} ${className}`}
    >
      <motion.div
        layoutId="mystery-token-core"
        className={`flex items-center justify-center border border-white/90 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] shadow-[0_14px_30px_rgba(249,115,22,0.12)] ${classes.iconWrap} ${gradient}`}
      >
        <motion.span layoutId="mystery-token-emoji" className={`${classes.icon} drop-shadow-sm`}>
          {emoji}
        </motion.span>
      </motion.div>

      <motion.div layoutId="mystery-token-copy" className="mt-5 px-4 text-center">
        <p className={`font-display font-black uppercase tracking-[0.12em] text-[#432414] ${classes.title}`}>
          {title}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#654331]">{subtitle}</p>
      </motion.div>
    </motion.div>
  );
}
