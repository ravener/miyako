const Command = require("../../structures/Command.js");

class Award extends Command {
  constructor(...args) {
    super(...args, {
      description: "Award points to someone.",
      userPermissions: ["ADMINISTRATOR"],
      cooldown: 30,
      usage: "award <@user> <amount>",
      aliases: ["give", "reward"],
      guildOnly: true
    });
  }
  
  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);

    if(member.user.bot) return msg.send("Baka! Bots can't have points.");
    if(member.user.id === msg.author.id) return msg.send("Baka! You can't reward yourself. Why did you even try it?");
    
    if(amount < 0) return msg.rely("Baka! You can't reward them a negative amount. Are you trying to rob them?");
    if(amount === 0) return msg.send("Baka! Why would you pay them nothing?");

    // Guard against abuse. We have to be careful not to let users add infinite points and overflow the database.
    if(amount >= 100000) return msg.send("You can't reward more than **¥100,000** at a time.");

    await member.syncSettings();

    // Even more guard.
    if(member.points >= Number.MAX_SAFE_INTEGER)
      return msg.send(`N-nani? **${member.displayName}** have too much credits that I can't even keep track of it anymore. You cannot reward them anymore credits until they spend some.`);

    await member.givePoints(amount);

    return msg.send(`Successfully rewarded **¥${amount.toLocaleString()}** to ${member}`);
  }
}

module.exports = Award;
