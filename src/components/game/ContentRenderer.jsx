import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import MediaRenderer from "../ui/MediaRenderer";
import ReadAloud from "../ui/ReadAloud";
import { gameContent } from "../../data/gameContent";
import { playChime, playClick, resumeAudio } from "../../hooks/useAudio";
import useGameStore from "../../store/useGameStore";

const slides = gameContent.modules.flatMap((module, moduleIndex) =>
  module.chapters.map((chapter, chapterIndex) => ({
    ...chapter,
    moduleTitle: module.title,
    moduleIndex,
    chapterIndex,
  })),
);

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 120 : -120,
    rotate: direction > 0 ? 2 : -2,
    scale: 0.96,
  }),
  center: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -120 : 120,
    rotate: direction > 0 ? -2 : 2,
    scale: 0.96,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

const actionStyles = {
  listen: {
    button: "card-ocean text-cyan-200",
    panel: "card-ocean text-cyan-200",
  },
  try: {
    button: "card-gold text-amber-200",
    panel: "card-gold text-amber-200",
  },
  guess: {
    button: "card-coral text-pink-200",
    panel: "card-coral text-pink-200",
  },
  teacher: {
    button: "border-teal-500/20 bg-teal-900/20 text-teal-200",
    panel: "border-teal-500/20 bg-teal-900/20 text-teal-200",
  },
};

function buildSlideActions(slide) {
  const introText = slide.intro?.replace(/\\n/g, " ") || "Take a quick look at this step together.";
  const promptText = slide.questions?.length
    ? slide.questions.slice(0, 3).join(" ")
    : "Ask the divers to describe the treasure in short, clear clues.";

  return [
    {
      id: "listen",
      icon: "🔊",
      label: "Listen",
      title: "Read it out loud",
      body: introText,
      readText: `${slide.title}. ${introText}`,
    },
    {
      id: "try",
      icon: "🏊",
      label: "Dive In",
      title: "Mini dive action",
      body: slide.video
        ? "Pause after the demo and ask the crew to copy the speaking pattern together."
        : "Ask one diver to answer using a full sentence before moving on.",
    },
    {
      id: "guess",
      icon: "💡",
      label: "Clue",
      title: "Treasure clue idea",
      body: promptText,
    },
    {
      id: "teacher",
      icon: "🧑‍🏫",
      label: "Captain's Tip",
      title: "Facilitation note",
      body: slide.explain || "Keep the energy high and move quickly once divers understand the pattern.",
    },
  ];
}

export default function ContentRenderer({ onComplete }) {
  const { setContentPosition } = useGameStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeActionId, setActiveActionId] = useState("listen");
  const [mobileJumpOpen, setMobileJumpOpen] = useState(false);
  const containerRef = useRef(null);
  const shapeOneRef = useRef(null);
  const shapeTwoRef = useRef(null);
  const shapeThreeRef = useRef(null);
  const slideRef = useRef(null);

  const activeSlide = slides[activeIndex];
  const activeImages = activeSlide.images || [];
  const actions = useMemo(() => buildSlideActions(activeSlide), [activeSlide]);
  const activeAction = actions.find((action) => action.id === activeActionId) || actions[0];
  const progress = ((activeIndex + 1) / slides.length) * 100;
  const isLastSlide = activeIndex === slides.length - 1;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(shapeOneRef.current, {
        x: 36,
        y: -24,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(shapeTwoRef.current, {
        x: -28,
        y: 22,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(shapeThreeRef.current, {
        y: -30,
        rotate: 10,
        duration: 5.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!slideRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        slideRef.current.querySelectorAll("[data-slide-item]"),
        {
          y: 24,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, slideRef);

    return () => ctx.revert();
  }, [activeIndex, activeActionId]);

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveActionId("listen");
    setMobileJumpOpen(false);
    setContentPosition(activeIndex, activeSlide.moduleIndex, activeSlide.chapterIndex);
  }, [activeIndex, activeSlide.chapterIndex, activeSlide.moduleIndex, setContentPosition]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tagName = document.activeElement?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (isLastSlide) {
          resumeAudio();
          playChime();
          onComplete?.();
        } else {
          goToSlide(activeIndex + 1);
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isLastSlide, onComplete]);

  const speakText = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
    resumeAudio();
    playClick();
  };

  const goToSlide = (nextIndex) => {
    if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= slides.length) {
      return;
    }

    resumeAudio();
    playClick();
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const handleAdvance = () => {
    if (isLastSlide) {
      resumeAudio();
      playChime();
      onComplete?.();
      return;
    }

    goToSlide(activeIndex + 1);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x <= -90) {
      handleAdvance();
    }

    if (info.offset.x >= 90) {
      goToSlide(activeIndex - 1);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden px-4 py-10 md:px-6 md:py-14"
    >
      {/* Underwater ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_30%),radial-gradient(circle_at_right,_rgba(45,212,191,0.06),_transparent_24%),radial-gradient(circle_at_left_bottom,_rgba(103,232,249,0.06),_transparent_22%)]" />
        <div
          ref={shapeOneRef}
          className="absolute left-[4%] top-[8%] h-40 w-40 rounded-[2.5rem] bg-cyan-500/[0.08] blur-2xl"
        />
        <div
          ref={shapeTwoRef}
          className="absolute bottom-[12%] right-[8%] h-56 w-56 rounded-full bg-pink-500/[0.06] blur-3xl"
        />
        <div
          ref={shapeThreeRef}
          className="absolute right-[22%] top-[16%] h-28 w-28 rounded-[1.8rem] bg-teal-400/[0.08] blur-2xl"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="sea-glass overflow-hidden p-5 md:p-8"
        >
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="sea-tag-gold flex items-center gap-2 px-4 py-2">
                    🐙 Treasure Deck
                  </span>
                  <span className="sea-tag px-4 py-2">
                    {activeSlide.moduleTitle}
                  </span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-cyan-50 bio-glow md:text-5xl">
                  {gameContent.title}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoTile label="Slide" value={`${activeIndex + 1}/${slides.length}`} tone="cyan" />
                <InfoTile label="Module" value={`0${activeSlide.moduleIndex + 1}`} tone="pink" />
                <InfoTile
                  label="Prompts"
                  value={String(activeSlide.questions?.length || 0).padStart(2, "0")}
                  tone="gold"
                />
                <InfoTile
                  label="Media"
                  value={activeSlide.video ? "Video" : activeImages.length ? "Gallery" : "Focus"}
                  tone="teal"
                />
              </div>
            </div>

            {/* Mobile controls */}
            <CompactGuideControls
              activeIndex={activeIndex}
              slides={slides}
              isLastSlide={isLastSlide}
              isOpen={mobileJumpOpen}
              onToggle={() => setMobileJumpOpen((value) => !value)}
              onJump={goToSlide}
              onPrev={() => goToSlide(activeIndex - 1)}
              onNext={handleAdvance}
              onJumpToFinale={onComplete}
            />

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.28em] text-cyan-400">
                <span>🗺️ Dive progress</span>
                <span>{Math.round(progress)}% explored</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-cyan-950/50 border border-cyan-500/20">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 shadow-[0_0_16px_rgba(103,232,249,0.3)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Desktop slide pills */}
            <div className="hidden flex-wrap gap-2 lg:flex">
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;
                const isVisited = index < activeIndex;

                return (
                  <motion.button
                    key={slide.id}
                    type="button"
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full border px-3 py-2 text-left transition-all md:px-4 ${
                      isActive
                        ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100 shadow-[0_0_20px_rgba(103,232,249,0.1)]"
                        : isVisited
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                        : "border-cyan-500/10 bg-cyan-950/30 text-cyan-300/60 hover:border-cyan-500/25 hover:bg-cyan-500/10"
                    }`}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-[0.28em] opacity-70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                      <span className="block text-sm font-bold md:text-[15px]">{slide.title}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Main slide content */}
            <div className="overflow-hidden rounded-[2rem] sea-glass-light p-3 md:p-4">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeSlide.id}
                  ref={slideRef}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={handleDragEnd}
                  className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]"
                >
                  {/* Media panel */}
                  <div className="relative overflow-hidden rounded-[1.8rem] border border-cyan-500/15 bg-gradient-to-b from-cyan-950/40 to-blue-950/30 p-4 md:p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(103,232,249,0.06),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.04),_transparent_32%)]" />

                    <div data-slide-item className="relative">
                      <SlideMedia
                        slide={activeSlide}
                        activeImageIndex={activeImageIndex}
                        onImageSelect={setActiveImageIndex}
                      />
                    </div>
                  </div>

                  {/* Text content panel */}
                  <div className="flex flex-col gap-4 rounded-[1.8rem] border border-cyan-500/10 bg-[rgba(10,22,40,0.5)] p-5 md:p-6">
                    <div data-slide-item className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-400">
                            Chapter {activeSlide.chapterIndex + 1}
                          </p>
                          <div className="mt-2 flex items-start gap-3">
                            <h2 className="text-3xl font-black leading-tight text-cyan-50 md:text-4xl">
                              {activeSlide.title}
                            </h2>
                            <ReadAloud
                              text={activeSlide.title}
                              className="mt-1 border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300"
                            />
                          </div>
                        </div>

                        <div className="sea-tag px-4 py-2">
                          {activeSlide.video
                            ? "🎬 Watch & respond"
                            : activeImages.length
                            ? `📸 ${activeImages.length} clue${activeImages.length > 1 ? "s" : ""}`
                            : "🗣️ Speaking guide"}
                        </div>
                      </div>

                      {activeSlide.intro && (
                        <p className="text-base leading-relaxed text-cyan-200/80 md:text-lg">
                          {activeSlide.intro}
                        </p>
                      )}
                    </div>

                    {/* Questions */}
                    {activeSlide.questions?.length > 0 && (
                      <div data-slide-item className="space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-[0.32em] text-amber-400">
                          🐠 Treasure Clues
                        </h3>
                        <div className="grid gap-2">
                          {activeSlide.questions.map((question, index) => (
                            <motion.div
                              key={question}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.06 * index }}
                              className="flex items-start gap-3 rounded-[1.2rem] border border-amber-500/20 bg-amber-500/8 px-4 py-3"
                            >
                              <span className="text-amber-400/70 text-sm font-black">{index + 1}.</span>
                              <p className="text-sm leading-relaxed text-amber-100">{question}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Slide Actions */}
                    <div data-slide-item className="space-y-2">
                      <h3 className="text-xs font-black uppercase tracking-[0.32em] text-cyan-400">
                        🧭 Dive Actions
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {actions.map((action) => {
                          const isSelected = action.id === activeAction.id;
                          const tone = actionStyles[action.id];

                          return (
                            <motion.button
                              key={action.id}
                              type="button"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveActionId(action.id)}
                              className={`rounded-[1.4rem] border p-4 text-left transition-all ${tone.button} ${
                                isSelected ? "shadow-[0_0_20px_rgba(103,232,249,0.1)] ring-1 ring-cyan-400/30" : "opacity-75"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/50 text-xl shadow-sm border border-cyan-500/10">
                                  {action.icon}
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.2em]">{action.label}</p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className={`rounded-[1.5rem] border p-5 ${actionStyles[activeAction.id].panel}`}>
                        <p className="text-xs font-black uppercase tracking-[0.28em] opacity-70">
                          {activeAction.title}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed md:text-base">
                          {activeAction.body}
                        </p>

                        {activeAction.readText && (
                          <button
                            type="button"
                            onClick={() => speakText(activeAction.readText)}
                            className="mt-4 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                          >
                            🔊 Read it aloud
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Explain */}
                    {activeSlide.explain && (
                      <div
                        data-slide-item
                        className="rounded-[1.5rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
                          🌟 Why it matters
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-amber-100 md:text-lg">
                          {activeSlide.explain}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 text-sm text-cyan-300/60">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(103,232,249,0.4)]" />
                Swipe, tap, or use arrows to explore the treasure guide 🐠
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <NavButton
                  disabled={activeIndex === 0}
                  label="Previous"
                  direction="left"
                  onClick={() => goToSlide(activeIndex - 1)}
                />
                <NavButton
                  highlight
                  label={isLastSlide ? "🎯 Start the Quest!" : "Next"}
                  direction="right"
                  onClick={handleAdvance}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CompactGuideControls({
  activeIndex,
  slides,
  isLastSlide,
  isOpen,
  onToggle,
  onJump,
  onPrev,
  onNext,
  onJumpToFinale,
}) {
  return (
    <div className="space-y-3 lg:hidden">
      <div className="flex flex-wrap items-center gap-3 rounded-[1.6rem] border border-cyan-500/15 bg-cyan-950/30 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-400">🧭 Navigation</p>
          <p className="mt-1 truncate text-sm font-bold text-cyan-200">
            Slide {activeIndex + 1} of {slides.length}: {slides[activeIndex].title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={activeIndex === 0}
            className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.18em] ${
              activeIndex === 0
                ? "cursor-not-allowed border-cyan-500/10 bg-cyan-950/20 text-cyan-600 opacity-50"
                : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            }`}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            className="coral-btn px-4 py-2 text-sm"
          >
            {isLastSlide ? "Quest!" : "Next"}
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-teal-300"
          >
            Jump
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-[1.6rem] border border-cyan-500/15 bg-cyan-950/30 p-4"
          >
            <div className="flex flex-wrap gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => onJump(index)}
                  className={`rounded-full border px-3 py-2 text-left text-sm font-bold ${
                    activeIndex === index
                      ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                      : "border-cyan-500/10 bg-cyan-950/30 text-cyan-300/60"
                  }`}
                >
                  {slide.title}
                </button>
              ))}
              <button
                type="button"
                onClick={onJumpToFinale}
                className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-300"
              >
                🎯 Start Quest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlideMedia({ slide, activeImageIndex, onImageSelect }) {
  if (slide.video?.url) {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-cyan-500/15 bg-cyan-950/40 p-3 shadow-[0_0_30px_rgba(103,232,249,0.05)]">
          <MediaRenderer
            type="video"
            src={slide.video.url}
            title={slide.video.title}
            className="w-full"
          />
        </div>
        <div className="rounded-[1.4rem] border border-cyan-500/15 bg-cyan-500/5 p-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
            🎬 Demo Dive
          </p>
          <p className="mt-2 text-base font-bold text-cyan-100">
            {slide.video.title || "Watch the underwater demo"}
          </p>
        </div>
      </div>
    );
  }

  if (slide.images?.length) {
    const currentImage = slide.images[activeImageIndex] || slide.images[0];

    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[1.6rem] border border-cyan-500/15 bg-cyan-950/40 shadow-[0_0_30px_rgba(103,232,249,0.05)]">
          <MediaRenderer
            type="image"
            src={currentImage}
            title={slide.title}
            className="aspect-[4/3] w-full"
          />
        </div>

        {slide.images.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {slide.images.map((image, index) => (
              <motion.button
                key={image}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onImageSelect(index)}
                className={`overflow-hidden rounded-[1.2rem] border p-1 transition-all ${
                  index === activeImageIndex
                    ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(103,232,249,0.1)]"
                    : "border-cyan-500/10 bg-cyan-950/30"
                }`}
              >
                <MediaRenderer
                  type="image"
                  src={image}
                  title={`${slide.title} ${index + 1}`}
                  className="aspect-square w-full"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.8rem] border border-cyan-500/15 bg-gradient-to-b from-cyan-950/40 to-blue-950/30 p-8 text-center">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-10 top-10 h-16 w-16 rounded-full border border-cyan-400/10 bg-cyan-500/5" />
        <div className="absolute bottom-14 right-12 h-24 w-24 rounded-full border border-teal-400/10 bg-teal-500/5" />
      </div>
      <div className="relative max-w-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-cyan-400/20 bg-cyan-500/10 shadow-[0_0_30px_rgba(103,232,249,0.15)]">
          <img src="/images/sea/treasure_chest.png" alt="Treasure" className="h-20 w-20 object-contain" />
        </div>
        <h3 className="mt-5 text-2xl font-black text-cyan-50 bio-glow">{slide.title}</h3>
      </div>
    </div>
  );
}

function InfoTile({ label, value, tone }) {
  const tones = {
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-200",
    pink: "border-pink-500/20 bg-pink-500/10 text-pink-200",
    gold: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    teal: "border-teal-500/20 bg-teal-500/10 text-teal-200",
  };

  return (
    <div className={`rounded-[1.3rem] border px-4 py-3 text-left ${tones[tone]}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-70">{label}</p>
      <p className="mt-2 text-lg font-black md:text-xl">{value}</p>
    </div>
  );
}

function NavButton({ direction, disabled = false, highlight = false, label, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={`inline-flex items-center gap-3 rounded-full border px-6 py-3.5 text-base font-black transition-all ${
        highlight
          ? "coral-btn"
          : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
      } ${disabled ? "cursor-not-allowed opacity-40 grayscale" : "hover:-translate-y-0.5"}`}
    >
      {direction === "left" && <span className="text-lg">{"<"}</span>}
      <span>{label}</span>
      {direction === "right" && <span className="text-lg">{">"}</span>}
    </motion.button>
  );
}
