import { useEffect } from "react";
import useGameStore from "../store/useGameStore";

/**
 * useTeacherMode - Keyboard shortcuts for teacher presentation control.
 *
 * Space / ArrowRight: Advance to next step
 * ArrowLeft: Go back to previous step
 * Shift + R: Reset game
 */
export default function useTeacherMode() {
  const { currentStep, nextStep, prevStep, resetGame } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          nextStep();
          break;
        case "ArrowRight":
          if (e.shiftKey || currentStep !== "content") {
            e.preventDefault();
            nextStep();
          }
          break;
        case "ArrowLeft":
          if (e.shiftKey || currentStep !== "content") {
            e.preventDefault();
            prevStep();
          }
          break;
        case "KeyR":
          if (e.shiftKey) {
            e.preventDefault();
            resetGame();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, nextStep, prevStep, resetGame]);
}
