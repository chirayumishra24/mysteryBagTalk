import { AnimatePresence } from "framer-motion";
import useGameStore from "../../store/useGameStore";
import StartScreen from "./StartScreen";
import ContentRenderer from "./ContentRenderer";
import ThinkMode from "./ThinkMode";
import SpeakingScreen from "./SpeakingScreen";
import GuessPanel from "./GuessPanel";
import RevealScreen from "./RevealScreen";
import RewardPanel from "./RewardPanel";

// Global Game Flow Orchestrator
export default function GameFlow() {
  const { currentStep } = useGameStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "start":
        return <StartScreen key="start" />;
      case "mysteryBag":
        // 3D Scene is rendered globally in App, this step is just waiting for click
        return null; 
      case "content":
        return <ContentRenderer key="content" />;
      case "think":
        return <ThinkMode key="think" />;
      case "speaking":
        return <SpeakingScreen key="speaking" />;
      case "guessing":
        return <GuessPanel key="guessing" />;
      case "reveal":
        return <RevealScreen key="reveal" />;
      case "reward":
        return <RewardPanel key="reward" />;
      default:
        return <StartScreen key="start" />;
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center w-full h-full overflow-hidden">
      {/* 
        This wrapper captures interactions for the panels while letting 
        clicks through to the 3D scene underneath when panels are empty.
        pt-4 ensures content clears the fixed progress bar.
      */}
      <div className={`w-full max-w-[1440px] px-4 md:px-8 pt-4 max-h-screen overflow-y-auto custom-scrollbar ${
          currentStep === "mysteryBag" ? "pointer-events-none" : "pointer-events-auto"
        }`}>
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
