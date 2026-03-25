import { motion } from "framer-motion";

export const GameLogo = () => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center select-none"
    >
      <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-primary text-outline-blue transform -rotate-2">
        MYSTERY BAG TALK
      </h1>
      <div className="bg-secondary px-6 py-1 rounded-full -mt-2 rotate-1 shadow-lg border-2 border-white">
        <p className="text-white text-sm md:text-base font-bold tracking-widest uppercase text-center">
          Build Speaking Confidence & Vocabulary
        </p>
      </div>
    </motion.div>
  );
};

export default GameLogo;
