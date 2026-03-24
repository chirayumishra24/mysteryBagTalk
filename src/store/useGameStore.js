import { create } from "zustand";

// Game steps in order
export const GAME_STEPS = [
  "start",
  "mysteryBag",
  "content",
  "think",
  "speaking",
  "guessing",
  "reveal",
  "reward",
];

export const AVATARS = [
  { emoji: "🧙", name: "Wizard" },
  { emoji: "🚀", name: "Astronaut" },
  { emoji: "🦸", name: "Superhero" },
  { emoji: "🧚", name: "Fairy" },
  { emoji: "🤖", name: "Robot" },
  { emoji: "🦄", name: "Unicorn" },
  { emoji: "🐱", name: "Cat" },
  { emoji: "🦊", name: "Fox" },
];

const useGameStore = create((set, get) => ({
  // Current game step
  currentStep: "start",
  stepIndex: 0,

  // Selected object from the mystery bag
  selectedObject: null,

  // Grade level
  gradeLevel: "2nd grade",

  // Avatar and player name
  selectedAvatar: null,
  playerName: "",

  // Sentence builder answers
  sentences: {
    name: "",
    colour: "",
    use: "",
  },

  // Guessing state
  guesses: [],
  isCorrectGuess: false,

  // Timer
  timerSeconds: 30,
  timerActive: false,

  // Score and rewards
  score: 0,
  stars: 0,
  badges: [],

  // Content navigation
  currentChapterIndex: 0,
  currentModuleIndex: 0,

  // Actions
  setStep: (step) => {
    const index = GAME_STEPS.indexOf(step);
    set({ currentStep: step, stepIndex: index });
  },

  nextStep: () => {
    const { stepIndex } = get();
    if (stepIndex < GAME_STEPS.length - 1) {
      const newIndex = stepIndex + 1;
      set({ currentStep: GAME_STEPS[newIndex], stepIndex: newIndex });
    }
  },

  prevStep: () => {
    const { stepIndex } = get();
    if (stepIndex > 0) {
      const newIndex = stepIndex - 1;
      set({ currentStep: GAME_STEPS[newIndex], stepIndex: newIndex });
    }
  },

  // Content tracking
  hasSeenContent: false,
  setHasSeenContent: (val) => set({ hasSeenContent: val }),

  resetGame: () => {
    set({
      currentStep: "start",
      stepIndex: 0,
      selectedObject: null,
      sentences: { name: "", colour: "", use: "" },
      guesses: [],
      isCorrectGuess: false,
      timerSeconds: 30,
      timerActive: false,
      score: 0,
      stars: 0,
      currentChapterIndex: 0,
      currentModuleIndex: 0,
      hasSeenContent: false,
    });
  },

  setSelectedObject: (obj) => set({ selectedObject: obj }),

  setAvatar: (avatar) => set({ selectedAvatar: avatar }),
  setPlayerName: (name) => set({ playerName: name }),

  saveToLeaderboard: () => {
    const { playerName, selectedAvatar, stars } = get();
    try {
      const stored = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      stored.push({
        name: playerName || "Mystery Speaker",
        avatar: selectedAvatar?.name || "Wizard",
        stars,
        date: new Date().toISOString(),
      });
      localStorage.setItem("leaderboard", JSON.stringify(stored));
    } catch (e) {}
  },

  setGradeLevel: (level) => set({ gradeLevel: level }),

  updateSentence: (key, value) =>
    set((state) => ({
      sentences: { ...state.sentences, [key]: value },
    })),

  addGuess: (guess) =>
    set((state) => ({
      guesses: [...state.guesses, guess],
    })),

  setCorrectGuess: (isCorrect) => set({ isCorrectGuess: isCorrect }),

  setTimerActive: (active) => set({ timerActive: active }),

  decrementTimer: () =>
    set((state) => ({
      timerSeconds: Math.max(0, state.timerSeconds - 1),
    })),

  resetTimer: (seconds = 30) =>
    set({ timerSeconds: seconds, timerActive: false }),

  addScore: (points) =>
    set((state) => ({
      score: state.score + points,
      stars: Math.min(5, Math.floor((state.score + points) / 1)),
    })),

  setStars: (count) => set({ stars: count }),

  addBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, badge],
    })),

  nextChapter: () =>
    set((state) => ({
      currentChapterIndex: state.currentChapterIndex + 1,
    })),

  nextModule: () =>
    set((state) => ({
      currentModuleIndex: state.currentModuleIndex + 1,
      currentChapterIndex: 0,
    })),
}));

export default useGameStore;
