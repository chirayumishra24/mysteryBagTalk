import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import MysteryToken from "../ui/MysteryToken";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";
import { playPop, playMagicOpen } from "../../hooks/useAudio";

export default function ThinkMode() {
  const { setStep, setSelectedObject, gradeLevel } = useGameStore();
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(null);

  const objects = (() => {
    try {
      const custom = JSON.parse(localStorage.getItem("customObjects") || "null");
      if (custom && custom.length > 0) return custom;
    } catch (error) {}
    return gameContent.objects[gradeLevel] || gameContent.objects["2nd grade"];
  })();

  const handleSelectObject = (object) => {
    setSelected(object);
    setSelectedObject(object);
    playPop();
    setTimeout(() => setStep("speaking"), 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-24 md:px-6"
    >
      {!showOptions ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-5 rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white">
                Think Mode
              </span>
              <span className="rounded-full border border-[#d7f4ef] bg-[#effffb] px-4 py-2 text-sm font-bold text-[#0f7c70]">
                Quiet clues first
              </span>
            </div>

            <h2 className="text-5xl font-black uppercase tracking-tight text-[#432414] text-glow md:text-7xl">
              Get your clue ready
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[#654331] md:text-lg">
              Give the speaker a moment to imagine the object before they talk. This keeps the clue calm, clear, and easier for the class to understand.
            </p>

            <div className="grid gap-3">
              {[
                { icon: "✋", title: "Feel the shape", text: "Is it long, round, soft, or hard?" },
                { icon: "🎨", title: "Notice a clue", text: "Can you name the colour, size, or texture?" },
                { icon: "🗣️", title: "Plan the sentence", text: "Think about what you will say before the mic turns on." },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * index }}
                  className="flex items-start gap-4 rounded-[1.6rem] border border-[#ffe0cf] bg-[#fffaf4] p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#9b5430]">{card.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#654331]">{card.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                size="xl"
                variant="primary"
                onClick={() => {
                  playMagicOpen();
                  setShowOptions(true);
                }}
              >
                Pick the secret object
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.32),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.16),_transparent_30%)]" />
            <div className="relative flex min-h-[440px] flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.04, 1], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <MysteryToken
                  emoji="?"
                  title="Mystery item"
                  subtitle="Choose one secretly"
                  size="lg"
                />
              </motion.div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[#ff7a45]">Teacher prompt</p>
              <p className="mt-3 max-w-md text-xl font-black leading-relaxed text-[#432414]">
                "Think quietly first... then turn your idea into a clue."
              </p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 rounded-[2.4rem] border border-white/85 bg-white/86 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.14)] backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#ff7a45] px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-white">
                  Secret Object Wall
                </span>
                <span className="rounded-full border border-[#ffe7a1] bg-[#fff8db] px-4 py-2 text-sm font-bold text-[#8c5a1a]">
                  Pick one and keep it hidden
                </span>
              </div>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-[#432414] md:text-5xl">
                What did you find?
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#654331]">
                Choose the object for this round. Once it is picked, the next screen will help the speaker build the clue and record it.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <MysteryToken
                emoji="?"
                title="Secret object"
                subtitle="Keep it hidden"
                size="sm"
                tone="mint"
              />
              <div className="rounded-[1.6rem] border border-[#d7f4ef] bg-[#effffb] px-5 py-4 text-sm font-bold text-[#0f7c70]">
                Tip: Remind students not to say the object name out loud.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {objects.map((object, index) => (
              <motion.button
                key={object.name}
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectObject(object)}
                disabled={selected !== null}
                className={`group relative aspect-square rounded-[2rem] border p-5 text-center transition-all ${
                  selected?.name === object.name
                    ? "border-[#ffb087] bg-[linear-gradient(135deg,#fb923c,#fb7185)] text-white shadow-[0_18px_36px_rgba(249,115,22,0.2)]"
                    : selected !== null
                    ? "border-[#f4e1d3] bg-white text-[#c2a894] opacity-50 grayscale"
                    : "border-[#ffd8c2] bg-[#fffaf4] text-[#7d4522] shadow-[0_14px_28px_rgba(249,115,22,0.08)]"
                }`}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="text-5xl transition-transform group-hover:scale-110">{object.emoji}</span>
                  <span className="mt-4 text-base font-black uppercase leading-tight tracking-[0.08em]">
                    {object.name}
                  </span>
                </div>

                {selected?.name === object.name && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-[2rem] border-4 border-white/60"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
