const { Command } = require("klasa");

class CoinFlip extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["coin"],
      description: "Flips one or more coins",
      usage: "(coins:coins)"
    });
    
    this.createCustomResolver("coins", (arg, possible, message) => {
      possible.max = 1000;
      if(!arg) return undefined;
      return this.client.arguments.get("integer").run(arg, possible, message);
    });
  }
  
  run(msg, [coins = 0]) {
    if (coins <= 0) return msg.sendMessage(`You flipped ${Math.random() > 0.5 ? "Heads" : "Tails"}.`);
    
    let heads = 0;
    let tails = 0;
    for (let i = 0; i < coins; i++) {
      if (Math.random() > 0.5) heads++;
      else tails++;
    }
    return msg.sendMessage(`You flipped **${coins} coins**. **${heads} ${heads === "1" ? "was" : "were"} heads**, and **${tails} ${tails === "1" ? "was" : "were"} tails.**`);
  }
}

module.exports = CoinFlip;