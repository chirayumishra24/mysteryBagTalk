import { useEffect } from "react";
import ParticleBackground from "./components/ui/ParticleBackground";
import GameFlow from "./components/game/GameFlow";
import TeacherDashboard from "./components/game/TeacherDashboard";
import FullscreenButton from "./components/ui/FullscreenButton";
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#fff8ef] font-body text-[#3d2516] selection:bg-[#ffd089]/50">
      <ParticleBackground />
      <FullscreenButton />

      <TeacherDashboard />

      <div className="relative z-10 w-full min-h-screen">
        <GameFlow />
      </div>
    </div>
  );
}

export default App;
