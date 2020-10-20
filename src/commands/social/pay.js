const Command = require("../../structures/Command.js");

class Pay extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your balance.",
      cooldown: 3,
      usage: "pay <@member> <amount>",
      guildOnly: true,
      aliases: ["transfer", "donate"]
    });
  }

  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);

    if(member.id === msg.author.id) return msg.send("Baka! Why would you pay yourself?");
    if(member.user.bot) return msg.send("Baka! You can't pay bots.");
    if(amount > parseInt(msg.member.settings.points)) return msg.send("Baka! You can't pay more than what you have!");
    if(amount < 1) return msg.send("Baka! Why would you pay nothing?");
    if(amount > Number.MAX_SAFE_INTEGER) return msg.send("Baka! That amount is too high!");

    await member.syncSettings();
    await msg.member.takePoints(amount);
    await member.givePoints(amount);

    return msg.send(`Paid **¥${amount.toLocaleString()}** to **${member.displayName}**`);
  }
}

module.exports = Pay;
