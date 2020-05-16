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

  async run(ctx, [bet]) {
    if(bet && !["heads", "tails"].includes(bet.toLowerCase()))
      return ctx.reply("Invalid bet. You can only bet on `heads` or `tails`");

    const flipped = this.client.utils.random(["Heads", "Tails"]);
    
    if(bet && flipped.toLowerCase() === bet.toLowerCase())
      return ctx.reply(`Congratulations! The coin landed on \`${flipped}\``);

    return ctx.reply(`The coin landed on \`${flipped}\``);
  }
}

module.exports = Coin;
