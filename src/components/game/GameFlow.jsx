import { lazy, Suspense, useRef } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import useGameStore from "../../store/useGameStore";

const ContentRenderer = lazy(() => import("./ContentRenderer"));
const HollowInteraction = lazy(() => import("./HollowInteraction"));
const ThinkMode = lazy(() => import("./ThinkMode"));
const SpeakingScreen = lazy(() => import("./SpeakingScreen"));
const GuessPanel = lazy(() => import("./GuessPanel"));
const RevealScreen = lazy(() => import("./RevealScreen"));
const RewardPanel = lazy(() => import("./RewardPanel"));

export default function GameFlow() {
  const { currentStep } = useGameStore();
  const challengeRef = useRef(null);

  const scrollToChallenge = () => {
    challengeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "content":
        return (
          <div key="content" className="w-full pb-20">
            <ContentRenderer onComplete={scrollToChallenge} />
            <section ref={challengeRef} className="scroll-mt-24 px-4 pb-6 md:px-6">
              <HollowInteraction />
            </section>
          </div>
        );
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
        return (
          <div key="fallback" className="w-full pb-20">
            <ContentRenderer onComplete={scrollToChallenge} />
            <section ref={challengeRef} className="scroll-mt-24 px-4 pb-6 md:px-6">
              <HollowInteraction />
            </section>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <Suspense fallback={<FlowLoader />}>
        <LayoutGroup>
          <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
        </LayoutGroup>
      </Suspense>
    </div>
  );
}

function FlowLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[70vh] items-center justify-center px-6 py-16"
    >
      <div className="sea-glass px-8 py-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-cyan-900 border-t-cyan-400"
        />
        <p className="font-display text-lg font-black uppercase tracking-[0.24em] text-cyan-300">
          🐙 Diving deep...
        </p>
      </div>
    </motion.div>
  );
}
