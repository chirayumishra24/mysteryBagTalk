import { create } from "zustand";

function getStoredActivityMode() {
  if (typeof window === "undefined") {
    return "solo";
  }

  try {
    return localStorage.getItem("activityMode") || "solo";
  } catch (error) {
    return "solo";
  }
}

// Game steps in order
export const GAME_STEPS = [
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
  currentStep: "content",
  stepIndex: 0,

  // Selected object from the mystery bag
  selectedObject: null,

  // Grade level
  gradeLevel: "2nd grade",

  // Classroom format
  activityMode: getStoredActivityMode(),

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

  // AI Voice Analysis
  aiReview: null,
  isAnalyzing: false,

  // Content navigation
  currentChapterIndex: 0,
  currentModuleIndex: 0,
  contentSlideIndex: 0,

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
      currentStep: "content",
      stepIndex: 0,
      selectedObject: null,
      sentences: { name: "", colour: "", use: "" },
      guesses: [],
      aiReview: null,
      isAnalyzing: false,
      isCorrectGuess: false,
      timerSeconds: 30,
      timerActive: false,
      score: 0,
      stars: 0,
      currentChapterIndex: 0,
      currentModuleIndex: 0,
      contentSlideIndex: 0,
      hasSeenContent: false,
    });
  },

  setSelectedObject: (obj) => set({ selectedObject: obj }),

  setAvatar: (avatar) => set({ selectedAvatar: avatar }),
  setPlayerName: (name) => set({ playerName: name }),
  setActivityMode: (mode) => {
    try {
      localStorage.setItem("activityMode", mode);
    } catch (error) {}

    set({ activityMode: mode });
  },

  saveToLeaderboard: () => {
    const { playerName, selectedAvatar, stars, activityMode } = get();
    try {
      const stored = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      stored.push({
        name: playerName || (activityMode === "group" ? "Mystery Team" : "Mystery Speaker"),
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

  setAiReview: (review) => set({ aiReview: review }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),

  nextChapter: () =>
    set((state) => ({
      currentChapterIndex: state.currentChapterIndex + 1,
    })),

  nextModule: () =>
    set((state) => ({
      currentModuleIndex: state.currentModuleIndex + 1,
      currentChapterIndex: 0,
    })),

  setContentPosition: (slideIndex, moduleIndex, chapterIndex) =>
    set({
      contentSlideIndex: slideIndex,
      currentModuleIndex: moduleIndex,
      currentChapterIndex: chapterIndex,
    }),
}));

export default useGameStore;
