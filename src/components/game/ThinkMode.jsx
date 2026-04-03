import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import MysteryToken from "../ui/MysteryToken";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";
import { playPop, playMagicOpen } from "../../hooks/useAudio";

export default function ThinkMode() {
  const { setStep, setSelectedObject, gradeLevel, activityMode } = useGameStore();
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(null);
  const isGroupMode = activityMode === "group";

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
          <div className="space-y-5 sea-glass p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="sea-tag-gold px-4 py-2 flex items-center gap-2">
                🧠 Think Mode
              </span>
              <span className="sea-tag-mint px-4 py-2">
                {isGroupMode ? "Crew huddle first" : "Quiet dive first"}
              </span>
            </div>

            <h2 className="text-5xl font-black uppercase tracking-tight text-cyan-50 bio-glow md:text-7xl">
              Get Your Clue Ready! 🐙
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-cyan-200/80 md:text-lg">
              {isGroupMode
                ? "Give each crew a quick whisper huddle before anyone speaks. One team diver can then share a calm, clear treasure clue for the rest of the ocean."
                : "Give the diver a moment to imagine the treasure before they talk. This keeps the clue calm, clear, and easier for the crew to understand."}
            </p>

            <div className="grid gap-3">
              {[
                isGroupMode
                  ? { icon: "👥", title: "Huddle up!", text: "Let crewmates quietly share clue ideas underwater." }
                  : { icon: "🤚", title: "Feel the treasure", text: "Is it long, round, soft, or hard?" },
                isGroupMode
                  ? { icon: "💎", title: "Best clue wins", text: "Pick the colour, shape, or use that helps the crew most." }
                  : { icon: "🎨", title: "Spot a clue", text: "Can you name the colour, size, or texture?" },
                isGroupMode
                  ? { icon: "🎤", title: "Pick one diver", text: "Choose who will share the final treasure clue." }
                  : { icon: "🗣️", title: "Plan the sentence", text: "Think about what you'll say before the mic opens." },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * index }}
                  className="flex items-start gap-4 rounded-[1.6rem] border border-cyan-500/15 bg-cyan-500/5 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950/50 text-2xl shadow-sm border border-cyan-500/10">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">{card.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cyan-200/70">{card.text}</p>
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
                {isGroupMode ? "🐙 Open the crew's chest" : "🐙 Open the treasure chest"}
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden sea-glass p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.06),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(103,232,249,0.06),_transparent_30%)]" />
            <div className="relative flex min-h-[440px] flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.04, 1], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <MysteryToken
                  image="/images/sea/treasure_chest.png"
                  title="Mystery treasure"
                  subtitle={isGroupMode ? "Choose one for the crew" : "Choose one secretly"}
                  size="lg"
                  tone="gold"
                />
              </motion.div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-amber-400">🐙 Captain's prompt</p>
              <p className="mt-3 max-w-md text-xl font-black leading-relaxed text-cyan-100">
                {isGroupMode
                  ? '"Huddle up, crew... then let one brave diver share the treasure clue!"'
                  : '"Think quietly, diver... then turn your discovery into a clue!"'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 sea-glass p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="sea-tag-gold px-4 py-2 flex items-center gap-2">
                  ⚓ Treasure Wall
                </span>
                <span className="sea-tag px-4 py-2">
                  {isGroupMode ? "Pick one and hide it from other crews" : "Pick one and keep it hidden"}
                </span>
              </div>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-cyan-50 bio-glow md:text-5xl">
                Pick a Treasure 🏴‍☠️
              </h2>
              <p className="mt-2 max-w-xl text-lg font-bold text-cyan-200/90">
                {isGroupMode ? "Crew leader, pick a treasure in secret!" : "Diver, pick a secret treasure!"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="grid gap-2">
                {[
                  "Keep it a secret! 🤫",
                  "Think about its colour and shape 🎨",
                  "How do we use it? 🧭"
                ].map((tip, index) => (
                  <motion.div
                    key={tip}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 * index }}
                    className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-sm font-semibold text-cyan-200/80"
                  >
                    {tip}
                  </motion.div>
                ))}
              </div>
              <div className="rounded-[1.6rem] border border-teal-500/20 bg-teal-500/5 px-5 py-4 text-sm font-bold text-teal-300">
                {isGroupMode
                  ? "🐙 Let crewmates whisper ideas, but keep the treasure name hidden!"
                  : "🐙 Remember, don't say the treasure name out loud!"}
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
                    ? "border-amber-400/50 bg-gradient-to-br from-amber-500/20 to-orange-500/15 text-amber-100 shadow-[0_0_40px_rgba(251,191,36,0.2)] animate-treasure-glow"
                    : selected !== null
                    ? "border-cyan-500/10 bg-cyan-950/30 text-cyan-600 opacity-50 grayscale"
                    : "border-cyan-500/15 bg-cyan-950/30 text-cyan-200 shadow-[0_12px_24px_rgba(0,0,0,0.2)] hover:border-cyan-400/30 hover:bg-cyan-500/10"
                }`}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  {object.image ? (
                    <img src={object.image} alt={object.name} className="h-16 w-16 object-contain transition-transform group-hover:scale-110 drop-shadow-lg" />
                  ) : (
                    <span className="text-5xl transition-transform group-hover:scale-110">{object.emoji}</span>
                  )}
                  <span className="mt-4 text-base font-black uppercase leading-tight tracking-[0.08em]">
                    {object.name}
                  </span>
                </div>

                {selected?.name === object.name && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-[2rem] border-4 border-amber-400/40"
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
