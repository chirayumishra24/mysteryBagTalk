import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scene from "./components/3d/Scene";
import ParticleBackground from "./components/ui/ParticleBackground";
import ProgressBar from "./components/ui/ProgressBar";
import Mascot from "./components/ui/Mascot";
import GameFlow from "./components/game/GameFlow";
import TeacherDashboard from "./components/game/TeacherDashboard";
import useGameStore from "./store/useGameStore";
import useTeacherMode from "./hooks/useTeacherMode";

// Phase-based background gradients for emotional pacing
const PHASE_BACKGROUNDS = {
  start: "from-[#4c1d95] via-[#7c3aed] to-[#312e81]",
  content: "from-[#1e1b4b] via-[#312e81] to-[#4c1d95]",
  mysteryBag: "from-[#4c1d95] via-[#6d28d9] to-[#1e1b4b]",
  think: "from-[#831843] via-[#6b21a8] to-[#1e1b4b]",
  speaking: "from-[#134e4a] via-[#1e3a5f] to-[#312e81]",
  guessing: "from-[#7f1d1d] via-[#9a3412] to-[#78350f]",
  reveal: "from-[#4c1d95] via-[#7e22ce] to-[#a21caf]",
  reward: "from-[#854d0e] via-[#a16207] to-[#ca8a04]",
};

function App() {
  const { currentStep, setStep, hasSeenContent } = useGameStore();
  const [isBagOpened, setIsBagOpened] = useState(false);

  useTeacherMode();

  useEffect(() => {
    setStep("start");
  }, [setStep]);

  const bgGradient = PHASE_BACKGROUNDS[currentStep] || PHASE_BACKGROUNDS.start;

  const handleBagClick = () => {
    setIsBagOpened(true);
    setTimeout(() => {
      if (hasSeenContent) {
        setStep("think");
      } else {
        setStep("content");
      }
      setTimeout(() => setIsBagOpened(false), 500);
    }, 1500);
  };

  return (
    <motion.div
      className={`w-full h-screen bg-gradient-to-br ${bgGradient} text-white overflow-hidden relative font-body selection:bg-pink-500/50 transition-all duration-1000`}
    >
      <ParticleBackground />
      <ProgressBar />

      <Scene
        onBagClick={handleBagClick}
        isBagOpened={isBagOpened}
      />

      <GameFlow />
      <Mascot />
      <TeacherDashboard />
    </motion.div>
  );
}

export default App;
