// Dynamic content data structured from the provided activity content.
// All image paths are stored as relative - the IMAGE_PREFIX is applied at render time.

export const IMAGE_PREFIX = "https://login.skillizee.io";

export const gameContent = {
  title: "Deep Sea Mystery Quest",
  subtitle: "SkilliZee Activity: Mystery Bag Talk",
  objective:
    "Dive deep into the ocean and become a Treasure Speaker! Describe hidden treasures with clues so your crew can guess what you found on the ocean floor.",

  modules: [
    {
      id: "module-1",
      title: "🌊 DIVE INTO THE ADVENTURE",
      chapters: [
        {
          id: "chapter-1-1",
          title: "Welcome Aboard, Divers!",
          intro:
            '"Ahoy, young divers! 🐙 Today we\'re diving to the bottom of the ocean to find mysterious treasures! Your mission: describe what you find so your crew can guess it!"',
          images: [
            "/images/sea/treasure_chest.png",
            "/images/sea/pearl.png",
            "/images/sea/starfish.png",
          ],
          questions: [
            "Have you ever found something special at the beach?",
            "Can you describe your favourite sea creature in one sentence?",
            "What clues help you identify a treasure?",
          ],
          explain:
            '"Great treasure hunters don\'t just show what they found — they describe it so clearly that others can imagine it! Today, you\'ll speak like brave ocean explorers!"',
        },
        {
          id: "chapter-1-2",
          title: "Watch the Demo Dive!",
          intro:
            'Watch how a diver describes their treasure:\n"This is a golden key. It is shiny and old. We use it to open treasure chests!"',
          video: {
            url: "https://youtu.be/3UdR7G3IXWg?si=fSdsM4VRiw2RWdwi",
            title:
              "Fun Riddles for Kids | What's in the Mystery Box? | Guess the Objects",
          },
          questions: [
            "What did the diver say first?",
            "How did they describe the treasure?",
            "What made the sentence clear?",
          ],
          explain:
            '"Speaking becomes easy when we follow a simple treasure map of words!"',
        },
        {
          id: "chapter-1-3",
          title: "Quick Dive Practice!",
          intro: "Look at this treasure and describe it:",
          images: [
            "/images/sea/treasure_chest.png",
          ],
          questions: [
            "What is the treasure?",
            "What colour is it / what does it look like?",
            "What would a pirate use it for?",
          ],
          explain:
            '"Now you\'re ready for the Deep Sea Mystery Quest! Dive in!"',
        },
      ],
    },
    {
      id: "module-2",
      title: "🏴‍☠️ THE TREASURE MISSION",
      chapters: [
        {
          id: "chapter-2-1",
          title: "Your Ocean Mission",
          intro:
            '"You are Deep Sea Treasure Speakers! Your mission is to pull a treasure from the mystery chest, think carefully, and describe it so your crew can guess what it is!"',
        },
      ],
    },
    {
      id: "module-3",
      title: "🗺️ TREASURE MAP RULES",
      chapters: [
        {
          id: "chapter-3-1",
          title: "The 5 Steps of Treasure Quest",
          intro: "Follow these diver rules when it's your turn:",
          questions: [
            "1️⃣ Reach into the treasure chest without peeking!",
            "2️⃣ Feel the treasure and think about what it could be",
            "3️⃣ Speak in 2–3 clear sentences using the clue starter",
            "4️⃣ Your crew will guess the treasure! 🐠",
            "5️⃣ Reveal it to everyone. The whole crew cheers! 🎉",
          ],
        },
        {
          id: "chapter-3-2",
          title: "Star Diver Qualities",
          intro: "To earn the Golden Pearl Badge, remember your treasure points:",
          questions: [
            "🌟 Use a clear, brave diving voice!",
            "🗣️ Speak in full treasure sentences!",
            "🎨 Use great describing words (colours, shapes, feelings)!",
          ],
          explain: "Today, you'll learn how to speak clearly, describe treasures, and listen to your crew. These are the skills of a true ocean explorer!"
        }
      ],
    },
  ],

  taskInstructions: [
    "Reach into the treasure chest",
    "Think about the treasure's features",
    "Speak in 2–3 clear sentences",
    "Help your crew guess the treasure",
  ],

  objects: {
    "2nd grade": [
      { image: "/images/treasure_key_1775128388849.png", name: "Sunken Key", emoji: "🗝️" },
      { image: "/images/flashlight_1775128407130.png", name: "Dive Light", emoji: "🔦" },
      { image: "/images/magnifying_glass_1775128424472.png", name: "Sonar Glass", emoji: "🔍" },
      { image: "/images/sea/pearl.png", name: "Giant Pearl", emoji: "🪸" },
    ],
    "3rd grade": [
      { image: "/images/treasure_key_1775128388849.png", name: "Captain's Key", emoji: "🗝️" },
      { image: "/images/flashlight_1775128407130.png", name: "Deep Sea Beacon", emoji: "🔦" },
      { image: "/images/magnifying_glass_1775128424472.png", name: "Ocean Inspector", emoji: "🔍" },
      { image: "/images/sea/starfish.png", name: "Glowing Starfish", emoji: "⭐" },
    ],
  },

  sentenceStarters: [
    { template: "This is a ___.", placeholder: "name of the treasure" },
    { template: "It is ___ in colour.", placeholder: "colour" },
    { template: "We use it to ___.", placeholder: "what it's used for" },
  ],

  steps: [
    {
      id: "step-1",
      title: "Step 1: Prepare the Treasure Chest",
      description: "Keep simple treasures in the chest.",
    },
    {
      id: "step-2",
      title: "Step 2: Reach & Feel",
      description: "One diver comes forward and:",
      items: [
        "Reaches into the chest without peeking",
        "Feels the treasure carefully",
        "Thinks before speaking",
      ],
    },
    {
      id: "step-3",
      title: "Step 3: Speak Using Clue Starters",
      items: [
        '"This is a ___."',
        '"It is ___ in colour."',
        '"We use it to ___."',
      ],
    },
    {
      id: "step-4",
      title: "Step 4: Guessing Time!",
      description: "Before revealing the treasure:",
      items: [
        "The crew guesses what it is",
        "Divers raise hands or call out answers",
      ],
      note: "This builds excitement and listening skills!",
    },
    {
      id: "step-5",
      title: "Step 5: Reveal & Celebrate!",
      description: "The diver reveals the treasure.",
      items: ["🎉 Cheer Rule – Everyone cheers after each diver!"],
      note: "This boosts confidence! 🐙",
    },
  ],

  discussionQuestions: [
    "Which description helped you guess correctly?",
    "What made a diver sound confident?",
    "Which words were interesting or new?",
  ],

  speakerQualities: ["Clear voice", "Complete sentences", "Good describing words"],

  browniePoints: [
    { action: "Speaking clearly", points: 1, emoji: "🔊" },
    { action: "Using full sentences", points: 1, emoji: "📝" },
    { action: "Helping crew guess", points: 1, emoji: "🐠" },
  ],

  rewardThreshold: 5,
  rewardBadge: "Golden Pearl Badge",

  keyTakeaways: {
    message:
      '"Today, you learned how to speak clearly, describe treasures, and listen to your crew. These are the skills of a true ocean explorer!"',
    skills: [
      {
        title: "Speaking Confidence",
        description: "Expressing ideas bravely in front of others.",
        emoji: "🎤",
      },
      {
        title: "Vocabulary Building",
        description: "Using creative describing words.",
        emoji: "📚",
      },
      {
        title: "Sentence Formation",
        description: "Speaking in structured treasure sentences.",
        emoji: "✍️",
      },
      {
        title: "Listening Skills",
        description: "Understanding clues and guessing treasures.",
        emoji: "👂",
      },
      {
        title: "Observation Skills",
        description: "Identifying treasures through touch and description.",
        emoji: "👀",
      },
    ],
  },
};
