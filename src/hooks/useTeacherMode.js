import { useEffect } from "react";
import useGameStore, { GAME_STEPS } from "../store/useGameStore";

/**
 * useTeacherMode - Keyboard shortcuts for teacher presentation control.
 * 
 * Space / ArrowRight: Advance to next step
 * ArrowLeft: Go back to previous step
 * R: Reset game
 * T: Toggle teacher dashboard (emits custom event)
 */
export default function useTeacherMode() {
  const { nextStep, prevStep, resetGame } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
        case "ArrowRight":
          e.preventDefault();
          nextStep();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevStep();
          break;
        case "KeyR":
          if (e.shiftKey) {
            e.preventDefault();
            resetGame();
          }
          break;
        case "KeyT":
          if (e.shiftKey) {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("toggle-teacher-dashboard"));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, prevStep, resetGame]);
}
