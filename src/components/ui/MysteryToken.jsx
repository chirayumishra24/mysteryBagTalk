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
  warm: "from-cyan-900/60 to-blue-900/40",
  mint: "from-teal-900/60 to-cyan-900/40",
  pink: "from-pink-900/60 to-purple-900/40",
  gold: "from-amber-900/60 to-orange-900/40",
};

export default function MysteryToken({
  emoji = "?",
  title = "Mystery item",
  subtitle = "Keep it secret",
  size = "lg",
  tone = "warm",
  image = null,
  className = "",
}) {
  const classes = sizeClasses[size] || sizeClasses.lg;
  const gradient = toneClasses[tone] || toneClasses.warm;

  return (
    <motion.div
      layoutId="mystery-token-shell"
      className={`relative flex flex-col items-center justify-center border border-cyan-500/20 bg-[rgba(15,30,60,0.6)] shadow-[0_0_40px_rgba(103,232,249,0.1)] backdrop-blur-xl ${classes.shell} ${className}`}
    >
      {/* Sonar pulse ring */}
      <motion.div
        className="absolute inset-[-8px] rounded-[inherit] border-2 border-dashed border-cyan-400/20"
        animate={{ rotate: 360, scale: [1, 1.04, 1] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        layoutId="mystery-token-core"
        className={`flex items-center justify-center border border-cyan-400/20 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] shadow-[0_0_30px_rgba(103,232,249,0.15)] overflow-hidden ${classes.iconWrap} ${gradient}`}
      >
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <motion.span layoutId="mystery-token-emoji" className={`${classes.icon} drop-shadow-sm`}>
            {emoji}
          </motion.span>
        )}
      </motion.div>

      <motion.div layoutId="mystery-token-copy" className="mt-5 px-4 text-center">
        <p className={`font-display font-black uppercase tracking-[0.12em] text-cyan-100 ${classes.title}`}>
          {title}
        </p>
        <p className="mt-2 text-sm font-semibold text-cyan-300/70">{subtitle}</p>
      </motion.div>
    </motion.div>
  );
}
