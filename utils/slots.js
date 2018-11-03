const { random } = require("./utils.js");

const slots = [
  {
    emoji: "🍋",
    name: "Lemon",
    points: 3
  },
  {
    emoji: "🍉",
    name: "Water Melon",
    points: 5
  },
  {
    emoji: "🍎",
    name: "Apple",
    points: 5
  },
  {
    emoji: "🍇",
    name: "Grape",
    points: 3
  },
  {
    emoji: "🍊",
    name: "Orange",
    points: 7
  },
  { 
    emoji: "🍒",
    name: "Cherry",
    points: 5
  },
  {
    emoji: "🔔",
    name: "Bell",
    points: 7
  },
  { 
    emoji: "🍀",
    name: "Clover",
    points: 9
  },
  {
    emoji: "❤",
    name: "Heart",
    points: 8
  },
  {
    emoji: "💰",
    name: "Money",
    points: 10
  },
  {
    emoji: "💎",
    name: "Diamond",
    points: 15
  },
  {
    emoji: "🔅",
    name: "Jackpot",
    points: 100
  }
];

function play() {
  const Mone = random(slots);
  const Mtwo = random(slots);
  const Mthree = random(slots);
  const Tone = random(slots);
  const Ttwo = random(slots);
  const Tthree = random(slots);
  const Bone = random(slots);
  const Btwo = random(slots);
  const Bthree = random(slots);

  const results = { win: false, reward: 0 };

  if(Mone.name === Mtwo.name || Mone.name === Mthree.name || Mthree.name === Mtwo.name) results.win = true;

  if(Mone.name === Mtwo.name && Mtwo.name === Mthree.name) results.reward += Mone.points * 3;
  else if(Mone.name === Mtwo.name) results.reward += Mone.points + Mtwo.points;
  else if(Mone.name === Mthree.name) results.reward += Mone.points + Mthree.points;
  else if(Mthree.name === Mtwo.name) results.reward += Mthree.points + Mtwo.points;

  results.view = [
    `${Tone.emoji} | ${Ttwo.emoji} | ${Tthree.emoji}`,
    `${Mone.emoji} | ${Mtwo.emoji} | ${Mthree.emoji}`,
    `${Bone.emoji} | ${Btwo.emoji} | ${Bthree.emoji}`
  ].join("\n");
  return results;
}

module.exports = play;
