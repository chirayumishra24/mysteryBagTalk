import { useEffect } from "react";
import ParticleBackground from "./components/ui/ParticleBackground";
import GameFlow from "./components/game/GameFlow";
import FullscreenButton from "./components/ui/FullscreenButton";
import ProgressBar from "./components/ui/ProgressBar";
import Mascot from "./components/ui/Mascot";
import useGameStore from "./store/useGameStore";
import useTeacherMode from "./hooks/useTeacherMode";

function App() {
  const { setStep } = useGameStore();

  useTeacherMode();

  useEffect(() => {
    // Start on the activity deck
    setStep("content");
  }, [setStep]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-body text-[#e0f2fe] selection:bg-cyan-500/30">
      {/* Underwater Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/images/sea/bg.png')" }}
      />

      <ParticleBackground />
      <ProgressBar />
      <Mascot />
      <FullscreenButton />

      <div className="relative z-10 w-full min-h-screen">
        <GameFlow />
      </div>
    </div>
  );
}

export default App;
