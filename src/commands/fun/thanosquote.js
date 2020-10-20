const Command = require("../../structures/Command.js");

class ThanosQuote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives a random quote from Thanos."
    });
  }
  
  async run(msg) {
    return msg.send(quotes[Math.floor(Math.random() * quotes.length)]);
  }
}

module.exports = ThanosQuote;

const quotes = [
  "The end is near.",
  "You're strong. But I could snap my fingers, and you'd all cease to exist.",
  "Fun isn't something one considers when balancing the universe. But this… does put a smile on my face.",
  "Stark… you have my respect. I hope the people of Earth will remember you.",
  "When I'm done, half of humanity will still exist. Perfectly balanced, as all things should be. I hope they remember you.",
  "You should have gone for the head.",
  "I know what it's like to lose. To feel so desperately that you're right, yet to fail nonetheless. Dread it. Run from it." +
  " Destiny still arrives. Or should I say, I have.",
  "Going to bed hungry. Scrounging for scraps. Your planet was on the brink of collapse. I was the one who stopped that." +
  " You know what's happened since then? The children born have known nothing but full bellies and clear skies. It's a paradise.",
  "I ignored my destiny once, I can not do that again. Even for you. I'm sorry little one.",
  "With all six stones, I can simply snap my fingers, they would all cease to exist. I call that mercy.",
  "The hardest choices require the strongest wills.",
  "A soul for a soul.",
  "Balanced, as all things should be.",
  "Fun isn't something one considers when balancing the universe. But this… does put a smile on my face.",
  "I know what it's like to lose. To feel so desperately that you're right, yet to fail nonetheless. Dread it. Run from it. Destiny still arrives. Or should I say, I have.",
  "You could not live with your own failure, and where did that bring you? Back to me.",
  "I am... inevitable.",
  "I don't even know who you are.",
  "I used the stones to destroy the stones. It nearly killed me, but the work is done. It always will be. I'm inevitable.",
  "You're not the only one cursed with knowledge.",
  "Reality is often disappointing.",
  "A small price to pay for salvation."
];
