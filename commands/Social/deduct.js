const { Command } = require("klasa");

class Deduct extends Command {
  constructor(...args) {
    super(...args, {
      description: "Deduct a user's points",
      cooldown: 30,
      permissionLevel: 7,
      usage: "<user:member> <amount:int>",
      usageDelim: " ",
      aliases: ["takepoints", "punish"],
      runIn: ["text"]
    });
  }

  async run(msg, [member, amount]) {
    if(member.user.bot) throw "You can't deduct a bot!";
    if(member.id === msg.author.id) throw "Why are you deducting yourself?";
    if(amount > member.settings.points) throw "You can't deduct more than what they have.";
    await member.givePoints(-amount);
    return msg.send(`Deducted **${amount.toLocaleString()}** ${this.client.constants.currency} from **${member.displayName}**`);
  }
}

module.exports = Deduct;
