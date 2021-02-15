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
  
  async run(msg, [user, ...reason]) {
    user = await this.verifyUser(msg, user);
    if(!reason.length) return msg.send("Baka! You didn't give me a reason.");

    if(user.id === msg.author.id) return msg.send("Baka! You can't warn yourself.");
    if(user.id === this.client.user.id) return msg.send("Why would you try to warn me?");
    if(user.bot) return msg.send("Baka! You can't warn bots.");
    if(user.id === msg.guild.ownerID) return msg.send("Baka! You can't warn the owner.");

    try {
      await user.send(`You've been warned in **${msg.guild.name}** by **${msg.author.tag}** for: ${reason.join(" ")}`);
      return msg.send(`I've warned **${user.tag}** for: ${reason.join(" ")}`);
    } catch(err) {
      return msg.send("I couldn't DM the user, maybe they have DMs blocked.");
    }
  }
}

module.exports = Warn;
