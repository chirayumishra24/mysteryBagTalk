// Course content — ALL text is EXACTLY as provided in the original content.
// Images from the course use the IMAGE_PREFIX.

export const IMAGE_PREFIX = "https://login.skillizee.io";

export const courseData = {
  title: "SkilliZee Activity: Mystery Bag Talk",
  objective:
    "To develop students' speaking confidence, vocabulary, and sentence formation skills through a fun and interactive guessing and speaking game.",

  modules: [
    {
      id: "module-1",
      title: "MODULE 1: ACTIVITY DISCOVERY",
      chapters: [
        {
          id: "1-1",
          tabLabel: "1-1",
          title: "Chapter 1.1 – Introduction of the Activity",
          heroImage: "/images/characters/oliver-welcome.png",
          sceneImage: "/images/scenes/toy-shop-bg.png",
          intro:
            '"Have you ever picked something without looking and tried to guess what it is? Today, we are going to play a fun game where you will become Mystery Speakers!"',
          contentImages: [
            `${IMAGE_PREFIX}/s/articles/69d487bc09177f9263818126/images/image-20260407095742-1.png`,
            `${IMAGE_PREFIX}/s/articles/69d487bc09177f9263818126/images/image-20260407095742-2.png`,
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
          id: "1-2",
          tabLabel: "1-2",
          title: "Chapter 1.2 – Watch & Learn (Optional Demo)",
          heroImage: "/images/characters/oliver-magnifying.png",
          intro:
            'Show a sample object (e.g., pencil) and model:\n"This is a pencil. It is yellow in colour. We use it to write."',
          video: {
            url: "https://youtu.be/3UdR7G3IXWg?si=fSdsM4VRiw2RWdwi",
            embedUrl: "https://www.youtube.com/embed/3UdR7G3IXWg?si=fSdsM4VRiw2RWdwi",
            title:
              "Fun Riddles for Kids | What's in the Mystery Box? | Guess the Objects",
          },
          discussionTitle: "Discussion Questions",
          questions: [
            "What did they say first?",
            "How did they describe the object?",
            "What made the sentence clear?",
          ],
          explain:
            '"Speaking becomes easy when we follow a simple structure."',
        },
        {
          id: "1-3",
          tabLabel: "1-3",
          title: "Chapter 1.3 – Interactive Quick Practice",
          heroImage: "/images/ui/mystery-bag.png",
          intro: "Show an object and asks:",
          contentImages: [
            `${IMAGE_PREFIX}/s/articles/69d487bc09177f9263818126/images/image-20260407095742-3.jpeg`,
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
          id: "2-1",
          tabLabel: "2-1",
          title: "Chapter 2.1 – Problem Statement",
          heroImage: "/images/scenes/kids-guessing.png",
          intro:
            '"You are Mystery Speakers. Your challenge is to pick an object from the bag, think carefully, and describe it clearly so others can understand and guess it."',
          taskInstructions: [
            "Pick an object without looking",
            "Think about its features",
            "Speak in 2–3 clear sentences",
            "Help others guess the object",
          ],
          steps: [
            {
              id: "step-1",
              title: "Step 1: Prepare the Mystery Bag",
              description: "Keep simple objects in a bag:",
              image: "/images/ui/mystery-bag.png",
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
              note: "Complete the sentences.",
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
              items: ["Class celebrates with:", "Clap Rule – Everyone claps after each speaker"],
              note: "This boosts confidence.",
              image: "/images/characters/oliver-celebrating.png",
            },
          ],
          objects: {
            "2nd grade": [
              "Key", "Name badge", "Coin", "Whiteboard marker",
              "Chalk", "ID card", "Small clock", "Pencil sharpener",
              "Water bottle", "Safe scissors", "Leaf", "Feather",
              "Small stone", "Flower",
            ],
            "3rd grade": [
              "Magnet", "Game spinner", "Battery", "Small diary",
              "Flashlight", "Bookmark", "Magnifying glass", "Paint Brush",
              "Thermometer", "Hand sanitizer", "Globe",
              "Simple pulley model", "Map", "Alarm clock",
              "Currency note", "Measuring tape", "Traffic signal model",
              "Lock & key", "Calendar",
            ],
          },
          sentenceStarters: [
            { template: '"This is a ___."\u200B', placeholder: "name of the object" },
            { template: '"It is ___ in colour."', placeholder: "colour" },
            { template: '"We use it to ___."', placeholder: "what it is used for" },
          ],
        },
        {
          id: "2-2",
          tabLabel: "2-2",
          title: "Chapter 2.2 – Discussion Time",
          heroImage: "/images/scenes/discussion.png",
          intro: "After a few rounds, ask:",
          questions: [
            "Which description helped you guess correctly?",
            "What made a speaker sound confident?",
            "Which words were interesting or new?",
          ],
          speakerQualities: [
            "Clear voice",
            "Complete sentences",
            "Good describing words",
          ],
          encourageNotice: "Encourage students to notice:",
          browniePoints: [
            { action: "Speaking clearly", points: 1 },
            { action: "Using full sentences", points: 1 },
            { action: "Helping others guess", points: 1 },
          ],
          rewardText: "5 Points = Star Speaker Badge / Reward",
          badgeImage: "/images/ui/star-badge.png",
        },
        {
          id: "2-3",
          tabLabel: "2-3",
          title: "Chapter 2.3 – Key Takeaways",
          heroImage: "/images/characters/oliver-celebrating.png",
          intro:
            '"Today, you learned how to speak clearly, describe objects, and listen carefully. These are the skills of a great communicator!"',
          skills: [
            {
              title: "Speaking Confidence",
              description: "Expressing ideas in front of others.",
              icon: "/images/ui/skill-speaking.png",
            },
            {
              title: "Vocabulary Building",
              description: "Using describing words.",
              icon: "/images/ui/skill-vocabulary.png",
            },
            {
              title: "Sentence Formation",
              description: "Speaking in structured sentences.",
              icon: "/images/ui/skill-sentences.png",
            },
            {
              title: "Listening Skills",
              description: "Understanding clues and guessing.",
              icon: "/images/ui/skill-listening.png",
            },
            {
              title: "Observation Skills",
              description: "Identifying objects through touch and description.",
              icon: "/images/ui/skill-observation.png",
            },
          ],
        },
      ],
    },
  ],
};
