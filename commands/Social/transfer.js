const { Command } = require("klasa");

class Transfer extends Command {
  constructor(...args) {
    super(...args, {
      description: "Transfer some of your balance to someone",
      cooldown: 3,
      usage: "<member:member> <amount:int>",
      runIn: ["text"],
      aliases: ["pay", "donate"]
    });
  }

  async run(msg, [member, amount]) {
    if(member.id === msg.author.id) throw "Why would you transfer balance to yourself?";
    if(member.user.bot) throw "You can't transfer to bots!";
    if(amount > msg.member.settings.points) throw "You can't transfer more than what you have!";
    if(amount < 1) throw "Why would you want to transfer nothing.";
    if(amount > Number.MAX_SAFE_INTEGER) throw "That amount is too high!";
    await msg.member.givePoints(-amount);
    await member.givePoints(amount);
    return msg.send(`Transferred **${amount.toLocaleString()}** ${this.client.constants.currency} to **${member.displayName}**`);
  }
}

module.exports = Transfer;
