import { lazy, Suspense, useEffect } from "react";
import ParticleBackground from "./components/ui/ParticleBackground";
import GameFlow from "./components/game/GameFlow";
import FullscreenButton from "./components/ui/FullscreenButton";
import ProgressBar from "./components/ui/ProgressBar";
import Mascot from "./components/ui/Mascot";
import useGameStore from "./store/useGameStore";
import useTeacherMode from "./hooks/useTeacherMode";

const TeacherDashboard = lazy(() => import("./components/game/TeacherDashboard"));

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
      <ProgressBar />
      <Mascot />
      <FullscreenButton />
      <Suspense fallback={null}>
        <TeacherDashboard />
      </Suspense>

      <div className="relative z-10 w-full min-h-screen">
        <GameFlow />
      </div>
    </div>
  );
}

export default App;
