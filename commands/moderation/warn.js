const Command = require("../../structures/Command.js");

class Warn extends Command {
  constructor(...args) {
    super(...args, {
      description: "Warns a member",
      userPermissions: ["KICK_MEMBERS"],
      usage: "warn <@user> <reason>",
      guildOnly: true
    });
  }
  
  async run(ctx, [user, ...reason]) {
    user = await this.verifyUser(ctx, user);
    if(!reason.length) return ctx.reply("Baka! You didn't give me a reason.");

    if(user.id === ctx.author.id) return ctx.reply("Baka! You can't warn yourself.");
    if(user.id === this.client.user.id) return ctx.reply("Why would you try to warn me?");
    if(user.bot) return ctx.reply("Baka! You can't warn bots.");
    if(user.id === ctx.guild.ownerID) return ctx.reply("Baka! You can't warn the owner.");

    try {
      await user.send(`You've been warned in **${msg.guild.name}** by **${msg.author.tag}** for: ${reason.join(" ")}`);
      return ctx.reply(`I've warned **${user.user.tag}** for: ${reason.join(" ")}`);
    } catch(err) {
      return ctx.reply("I couldn't DM the user, maybe they have DMs blocked.");
    }
  }
}

module.exports = Warn;
