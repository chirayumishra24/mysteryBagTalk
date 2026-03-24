// Dynamic content data structured from the provided activity content.
// All image paths are stored as relative - the IMAGE_PREFIX is applied at render time.

export const IMAGE_PREFIX = "https://login.skillizee.io";

export const gameContent = {
  title: "Mystery Bag Challenge",
  subtitle: "SkilliZee Activity: Mystery Bag Talk",
  objective:
    "To develop students' speaking confidence, vocabulary, and sentence formation skills through a fun and interactive guessing and speaking game.",

  modules: [
    {
      id: "module-1",
      title: "MODULE 1: ACTIVITY DISCOVERY",
      chapters: [
        {
          id: "chapter-1-1",
          title: "Introduction of the Activity",
          intro:
            '"Have you ever picked something without looking and tried to guess what it is? Today, we are going to play a fun game where you will become Mystery Speakers!"',
          images: [
            "/s/articles/69c22d247fb44369a486f649/images/image-20260324115032-1.png",
            "/s/articles/69c22d247fb44369a486f649/images/image-20260324115032-2.png",
            "/s/articles/69c22d247fb44369a486f649/images/image-20260324115032-3.png",
          ],
          questions: [
            "Have you ever guessed something just by touching it?",
            "Can you describe your favourite object in one sentence?",
            "What clues help you identify an object?",
          ],
          explain:
            '"Good speakers don\'t just say what something is — they describe it clearly so others can imagine it. Today, you will learn how to speak like confident presenters!"',
        },
        {
          id: "chapter-1-2",
          title: "Watch & Learn (Optional Demo)",
          intro:
            'Show a sample object (e.g., pencil) and model:\n"This is a pencil. It is yellow in colour. We use it to write."',
          video: {
            url: "https://youtu.be/3UdR7G3IXWg?si=fSdsM4VRiw2RWdwi",
            title:
              "Fun Riddles for Kids | What's in the Mystery Box? | Guess the Objects",
          },
          questions: [
            "What did they say first?",
            "How did they describe the object?",
            "What made the sentence clear?",
          ],
          explain:
            '"Speaking becomes easy when we follow a simple structure."',
        },
        {
          id: "chapter-1-3",
          title: "Interactive Quick Practice",
          intro: "Show an object and ask:",
          images: [
            "/s/articles/69c22d247fb44369a486f649/images/image-20260324115033-4.png",
          ],
          questions: [
            "What is it?",
            "What colour is it / where we usually found it?",
            "What do we use it for?",
          ],
          explain:
            '"Now you\'re ready to try the Mystery Bag Challenge!"',
        },
      ],
    },
    {
      id: "module-2",
      title: "MODULE 2: ACTIVITY EXECUTION",
      chapters: [
        {
          id: "chapter-2-1",
          title: "Problem Statement",
          intro:
            '"You are Mystery Speakers. Your challenge is to pick an object from the bag, think carefully, and describe it clearly so others can understand and guess it."',
        },
      ],
    },
    {
      id: "module-3",
      title: "MODULE 3: RULES & HOW TO PLAY",
      chapters: [
        {
          id: "chapter-3-1",
          title: "The 5 Steps of Mystery Bag",
          intro: "Follow these simple rules when it's your turn:",
          questions: [
            "1️⃣ Pick an object without looking",
            "2️⃣ Feel it carefully and think in your head",
            "3️⃣ Speak in 2–3 clear sentences using the sentence starters",
            "4️⃣ The class will guess what it is!",
            "5️⃣ Show the object to everyone. Everyone claps! 👏",
          ],
        },
        {
          id: "chapter-3-2",
          title: "Star Speaker Qualities",
          intro: "To earn the Star Speaker Badge, remember your brownie points:",
          questions: [
            "✨ Use a Clear, loud voice",
            "🗣️ Speak in full, complete sentences",
            "🎨 Use good describing words (colors, shapes)",
          ],
          explain: "Today, you'll learn how to speak clearly, describe objects, and listen carefully. These are the skills of a great communicator!"
        }
      ],
    },
  ],

  taskInstructions: [
    "Pick an object without looking",
    "Think about its features",
    "Speak in 2–3 clear sentences",
    "Help others guess the object",
  ],

  objects: {
    "2nd grade": [
      { emoji: "🔑", name: "Key" },
      { emoji: "📛", name: "Name badge" },
      { emoji: "🪙", name: "Coin" },
      { emoji: "🖊", name: "Whiteboard marker" },
      { emoji: "🤍", name: "Chalk" },
      { emoji: "🪪", name: "ID card" },
      { emoji: "🕒", name: "Small clock" },
      { emoji: "🪛", name: "Pencil sharpener" },
      { emoji: "🥤", name: "Water bottle" },
      { emoji: "✂", name: "Safe scissors" },
      { emoji: "🍃", name: "Leaf" },
      { emoji: "🪶", name: "Feather" },
      { emoji: "🪨", name: "Small stone" },
      { emoji: "🌸", name: "Flower" },
    ],
    "3rd grade": [
      { emoji: "🧲", name: "Magnet" },
      { emoji: "🎡", name: "Game spinner" },
      { emoji: "🔋", name: "Battery" },
      { emoji: "📔", name: "Small diary" },
      { emoji: "🔦", name: "Flashlight" },
      { emoji: "🔖", name: "Bookmark" },
      { emoji: "🔍", name: "Magnifying glass" },
      { emoji: "🖌", name: "Paint Brush" },
      { emoji: "🌡", name: "Thermometer" },
      { emoji: "🧴", name: "Hand sanitizer" },
      { emoji: "🌍", name: "Globe" },
      { emoji: "🛞", name: "Simple pulley model" },
      { emoji: "🗺", name: "Map" },
      { emoji: "⏰", name: "Alarm clock" },
      { emoji: "💵", name: "Currency note" },
      { emoji: "📏", name: "Measuring tape" },
      { emoji: "🚦", name: "Traffic signal model" },
      { emoji: "🔐", name: "Lock & key" },
      { emoji: "📅", name: "Calendar" },
    ],
  },

  sentenceStarters: [
    { template: "This is a ___.", placeholder: "name of the object" },
    { template: "It is ___ in colour.", placeholder: "colour" },
    { template: "We use it to ___.", placeholder: "what it's used for" },
  ],

  steps: [
    {
      id: "step-1",
      title: "Step 1: Prepare the Mystery Bag",
      description: "Keep simple objects in a bag.",
    },
    {
      id: "step-2",
      title: "Step 2: Pick & Feel",
      description: "One student comes forward and:",
      items: [
        "Picks an object without looking",
        "Feels it carefully",
        "Thinks before speaking",
      ],
    },
    {
      id: "step-3",
      title: "Step 3: Speak Using Sentence Starters",
      items: [
        '"This is a ___."',
        '"It is ___ in colour."',
        '"We use it to ___."',
      ],
    },
    {
      id: "step-4",
      title: "Step 4: Guessing Time",
      description: "Before showing the object:",
      items: [
        "Class guesses what it is",
        "Students raise hands or call out answers",
      ],
      note: "This builds excitement and listening skills.",
    },
    {
      id: "step-5",
      title: "Step 5: Reveal & Applaud",
      description: "The student shows the object.",
      items: ["👏 Clap Rule – Everyone claps after each speaker"],
      note: "This boosts confidence.",
    },
  ],

  discussionQuestions: [
    "Which description helped you guess correctly?",
    "What made a speaker sound confident?",
    "Which words were interesting or new?",
  ],

  speakerQualities: ["Clear voice", "Complete sentences", "Good describing words"],

  browniePoints: [
    { action: "Speaking clearly", points: 1 },
    { action: "Using full sentences", points: 1 },
    { action: "Helping others guess", points: 1 },
  ],

  rewardThreshold: 5,
  rewardBadge: "Star Speaker Badge",

  keyTakeaways: {
    message:
      '"Today, you learned how to speak clearly, describe objects, and listen carefully. These are the skills of a great communicator!"',
    skills: [
      {
        title: "Speaking Confidence",
        description: "Expressing ideas in front of others.",
      },
      {
        title: "Vocabulary Building",
        description: "Using describing words.",
      },
      {
        title: "Sentence Formation",
        description: "Speaking in structured sentences.",
      },
      {
        title: "Listening Skills",
        description: "Understanding clues and guessing.",
      },
      {
        title: "Observation Skills",
        description: "Identifying objects through touch and description.",
      },
    ],
  },
};
