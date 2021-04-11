const Command = require("../../structures/Command.js");

class Coin extends Command {
  constructor(...args) {
    super(...args, {
      description: "Flip a coin.",
      extendedHelp: "You can bet on what it will land on.",
      usage: "coin [tails|heads]",
      cost: 5,
      aliases: ["coinflip", "flipcoin"]
    });
  }

  async run(msg, [bet]) {
    if (bet && !["heads", "tails"].includes(bet.toLowerCase())) {
      return msg.send("Invalid bet. You can only bet on `heads` or `tails`");
    }

    const flipped = this.client.utils.random(["Heads", "Tails"]);
    
    if (bet && flipped.toLowerCase() === bet.toLowerCase()) {
      return msg.send(`Congratulations! The coin landed on \`${flipped}\``);
    }

    return msg.send(`The coin landed on \`${flipped}\``);
  }
}

module.exports = Coin;
