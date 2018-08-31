const { Command } = require("klasa");

class Reward extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reward someone with this.",
      permissionLevel: 7,
      usage: "<user:member> <amount:int>",
      usageDelim: " ",
      aliases: ["award", "give"],
      cooldown: 30,
      runIn: ["text"]
    });
  }

  async run(msg, [member, amount]) {
    if(member.id === msg.author.id) throw "You cannot reaward yourself.";
    if(member.user.bot) throw "You can't reward a bot!";
    if(amount > Number.MAX_SAFE_INTEGER) throw "That amount is too high!";
    await member.givePoints(amount);
    return msg.send(`Rewarded **$${amount.toLocaleString()}** to **${member.displayName}**`);
  }
}

module.exports = Reward;
