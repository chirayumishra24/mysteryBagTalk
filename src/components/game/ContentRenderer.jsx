import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import MediaRenderer from "../ui/MediaRenderer";
import ReadAloud from "../ui/ReadAloud";
import { gameContent } from "../../data/gameContent";
import { playChime, playClick, resumeAudio } from "../../hooks/useAudio";

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

export default function ContentRenderer({ onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const shapeOneRef = useRef(null);
  const shapeTwoRef = useRef(null);
  const shapeThreeRef = useRef(null);
  const slideRef = useRef(null);

  const activeSlide = slides[activeIndex];
  const activeImages = activeSlide.images || [];
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
  }, [activeIndex]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tagName = document.activeElement?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return;
      }

      if (event.key === "ArrowRight") {
        if (isLastSlide) {
          resumeAudio();
          playChime();
          onComplete?.();
        } else {
          setDirection(1);
          setActiveIndex((current) => Math.min(current + 1, slides.length - 1));
          resumeAudio();
          playClick();
        }
      }

      if (event.key === "ArrowLeft") {
        setDirection(-1);
        setActiveIndex((current) => Math.max(current - 1, 0));
        resumeAudio();
        playClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLastSlide, onComplete]);

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

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden px-4 py-10 md:px-6 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.44),_transparent_30%),radial-gradient(circle_at_right,_rgba(251,146,60,0.18),_transparent_24%),radial-gradient(circle_at_left_bottom,_rgba(45,212,191,0.18),_transparent_22%)]" />
        <div
          ref={shapeOneRef}
          className="absolute left-[4%] top-[8%] h-40 w-40 rounded-[2.5rem] bg-[#ffd86c]/[0.55] blur-2xl"
        />
        <div
          ref={shapeTwoRef}
          className="absolute bottom-[12%] right-[8%] h-56 w-56 rounded-full bg-[#ffb5a2]/[0.45] blur-3xl"
        />
        <div
          ref={shapeThreeRef}
          className="absolute right-[22%] top-[16%] h-28 w-28 rounded-[1.8rem] bg-[#7ee7d8]/[0.45] blur-2xl"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="overflow-hidden rounded-[2.3rem] border border-white/[0.75] bg-white/[0.78] p-5 shadow-[0_24px_80px_rgba(249,115,22,0.15)] backdrop-blur-2xl md:p-8"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white shadow-[0_8px_18px_rgba(249,115,22,0.2)]">
                    Showtime Deck
                  </span>
                  <span className="rounded-full border border-[#ffd7be] bg-[#fff4ea] px-4 py-2 text-sm font-bold text-[#8a451b]">
                    {activeSlide.moduleTitle}
                  </span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-[#432414] text-glow md:text-6xl">
                  {gameContent.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#654331] md:text-lg">
                  {gameContent.objective}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoTile label="Slide" value={`${activeIndex + 1}/${slides.length}`} tone="orange" />
                <InfoTile label="Module" value={`0${activeSlide.moduleIndex + 1}`} tone="pink" />
                <InfoTile
                  label="Prompts"
                  value={String(activeSlide.questions?.length || 0).padStart(2, "0")}
                  tone="yellow"
                />
                <InfoTile
                  label="Media"
                  value={activeSlide.video ? "Video" : activeImages.length ? "Gallery" : "Focus"}
                  tone="mint"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.28em] text-[#a86132]">
                <span>Progress</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#ffe9db]">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#fb923c,#fb7185,#14b8a6)] shadow-[0_0_22px_rgba(249,115,22,0.25)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
                        ? "border-[#ffb087] bg-[#fff1e7] text-[#7b3918] shadow-[0_10px_22px_rgba(249,115,22,0.12)]"
                        : isVisited
                        ? "border-[#ffe08a] bg-[#fff7d7] text-[#87511d]"
                        : "border-[#f4e1d3] bg-white text-[#956f59] hover:border-[#ffd2b6] hover:bg-[#fff8f1]"
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

            <div className="overflow-hidden rounded-[2rem] border border-[#fde2cf] bg-[#fffaf6] p-3 md:p-4">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeSlide.id}
                  ref={slideRef}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]"
                >
                  <div className="relative overflow-hidden rounded-[1.8rem] border border-[#ffdccc] bg-[linear-gradient(180deg,rgba(255,243,231,0.96),rgba(255,233,226,0.96))] p-4 md:p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(253,224,71,0.22),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.16),_transparent_32%)]" />

                    <div data-slide-item className="relative">
                      <SlideMedia
                        slide={activeSlide}
                        activeImageIndex={activeImageIndex}
                        onImageSelect={setActiveImageIndex}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-[1.8rem] border border-[#ffe0cf] bg-white/[0.92] p-5 md:p-6">
                    <div data-slide-item className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ff7a45]">
                            Chapter {activeSlide.chapterIndex + 1}
                          </p>
                          <div className="mt-2 flex items-start gap-3">
                            <h2 className="text-3xl font-black leading-tight text-[#432414] md:text-4xl">
                              {activeSlide.title}
                            </h2>
                            <ReadAloud
                              text={activeSlide.title}
                              className="mt-1 border border-[#ffd0a1] bg-[#fff2da] hover:bg-[#ffe8c2]"
                            />
                          </div>
                        </div>

                        <div className="rounded-full border border-[#ffe2cf] bg-[#fff7ef] px-4 py-2 text-sm font-bold text-[#8f522d]">
                          {activeSlide.video
                            ? "Watch and respond"
                            : activeImages.length
                            ? `${activeImages.length} visual clue${activeImages.length > 1 ? "s" : ""}`
                            : "Speaking guide"}
                        </div>
                      </div>

                      {activeSlide.intro && (
                        <p className="text-base leading-relaxed text-[#654331] md:text-lg">
                          {activeSlide.intro}
                        </p>
                      )}
                    </div>

                    {activeSlide.questions?.length > 0 && (
                      <div data-slide-item className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black uppercase tracking-[0.32em] text-[#ff7a45]">
                            Talk Prompts
                          </h3>
                          <span className="rounded-full bg-[#ffe6d9] px-3 py-1 text-xs font-bold text-[#9b5430]">
                            {activeSlide.questions.length} cue
                            {activeSlide.questions.length > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="grid gap-3">
                          {activeSlide.questions.map((question, index) => (
                            <motion.div
                              key={question}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08 * index }}
                              className="rounded-[1.4rem] border border-[#ffe5b6] bg-[#fff7de] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                            >
                              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c47b20]">
                                Prompt {String(index + 1).padStart(2, "0")}
                              </p>
                              <p className="mt-2 text-[15px] leading-relaxed text-[#513120] md:text-base">
                                {question}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSlide.explain && (
                      <div
                        data-slide-item
                        className="rounded-[1.5rem] border border-[#ffd2bc] bg-[linear-gradient(135deg,rgba(253,224,71,0.34),rgba(251,191,36,0.18),rgba(251,146,60,0.24))] p-5"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#935028]">
                          Teacher Note
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-[#5b3420] md:text-lg">
                          {activeSlide.explain}
                        </p>
                      </div>
                    )}

                    <div data-slide-item className="mt-auto grid gap-3 sm:grid-cols-3">
                      <MiniInsight
                        label="Focus"
                        value={activeSlide.video ? "Notice the speaking order" : "Describe using clear clues"}
                        tone="orange"
                      />
                      <MiniInsight
                        label="Goal"
                        value={activeSlide.questions?.length ? "Answer each cue in full sentences" : "Move on when the class is ready"}
                        tone="pink"
                      />
                      <MiniInsight
                        label="Flow"
                        value={isLastSlide ? "Guide ends here, activity starts next" : "Use the next button to keep the pace moving"}
                        tone="mint"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 text-sm text-[#7f5a46]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a45] shadow-[0_0_12px_rgba(249,115,22,0.35)]" />
                Use the buttons or arrow keys to move through the activity.
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
                  label={isLastSlide ? "Start challenge" : "Next"}
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

function SlideMedia({ slide, activeImageIndex, onImageSelect }) {
  if (slide.video?.url) {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-[#ffd8c2] bg-white p-3 shadow-[0_16px_36px_rgba(249,115,22,0.08)]">
          <MediaRenderer
            type="video"
            src={slide.video.url}
            title={slide.video.title}
            className="w-full"
          />
        </div>
        <div className="rounded-[1.4rem] border border-[#ffd8c2] bg-[#fff4ea] p-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ff7a45]">
            Demo Cue
          </p>
          <p className="mt-3 text-lg font-bold text-[#472718]">
            {slide.video.title || "Watch the sample"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#6b4633]">
            Let students notice the order, the describing words, and the calm speaking pace before they try it themselves.
          </p>
        </div>
      </div>
    );
  }

  if (slide.images?.length) {
    const currentImage = slide.images[activeImageIndex] || slide.images[0];

    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[1.6rem] border border-[#ffd8c2] bg-white shadow-[0_16px_36px_rgba(249,115,22,0.08)]">
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
                    ? "border-[#ffb087] bg-[#fff1e7] shadow-[0_10px_22px_rgba(249,115,22,0.12)]"
                    : "border-[#fde0ce] bg-white"
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
    <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.8rem] border border-[#ffdccc] bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.34),_transparent_36%),linear-gradient(180deg,rgba(255,250,237,0.96),rgba(255,233,226,0.96))] p-8 text-center">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-10 top-10 h-16 w-16 rounded-full border border-[#ffd4aa] bg-white/[0.55]" />
        <div className="absolute bottom-14 right-12 h-24 w-24 rounded-full border border-[#b5efe6] bg-[#cffff4]/70" />
      </div>
      <div className="relative max-w-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#ffd6b4] bg-white/[0.75] text-5xl shadow-[0_10px_26px_rgba(249,115,22,0.12)]">
          ?
        </div>
        <h3 className="mt-6 text-3xl font-black text-[#432414]">{slide.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-[#664230]">
          This part is all about vocabulary, speaking structure, and confidence. Use the cue cards to set up the next round smoothly.
        </p>
      </div>
    </div>
  );
}

function InfoTile({ label, value, tone }) {
  const tones = {
    orange: "border-[#ffd6c2] bg-[#fff1e8] text-[#86401b]",
    pink: "border-[#ffd2dc] bg-[#fff1f5] text-[#9b3b58]",
    yellow: "border-[#ffe8ab] bg-[#fff8db] text-[#96611f]",
    mint: "border-[#ccefe8] bg-[#ecfffb] text-[#0f7c70]",
  };

  return (
    <div className={`rounded-[1.3rem] border px-4 py-3 text-left ${tones[tone]}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-70">{label}</p>
      <p className="mt-2 text-lg font-black md:text-xl">{value}</p>
    </div>
  );
}

function MiniInsight({ label, value, tone }) {
  const tones = {
    orange: "border-[#ffd8c2] bg-[#fff3eb] text-[#8b4a22]",
    pink: "border-[#ffd2dc] bg-[#fff0f5] text-[#94425d]",
    mint: "border-[#ccefe8] bg-[#ecfffb] text-[#11685d]",
  };

  return (
    <div className={`rounded-[1.3rem] border p-4 ${tones[tone]}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-70">{label}</p>
      <p className="mt-2 text-sm font-bold leading-relaxed">{value}</p>
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
          ? "border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] text-white shadow-[0_14px_34px_rgba(249,115,22,0.18)]"
          : "border-[#ffd8c2] bg-white text-[#7d4522]"
      } ${disabled ? "cursor-not-allowed opacity-40 grayscale" : "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(249,115,22,0.12)]"}`}
    >
      {direction === "left" && <span className="text-lg">{"<"}</span>}
      <span>{label}</span>
      {direction === "right" && <span className="text-lg">{">"}</span>}
    </motion.button>
  );
}
