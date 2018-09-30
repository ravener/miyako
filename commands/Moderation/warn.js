const { Command } = require("klasa");

class Warn extends Command {
  constructor(...args) {
    super(...args, {
      description: "Warns a member",
      permissionLevel: 5,
      usage: "<user:member> <reason:...string>",
      usageDelim: " ",
      runIn: ["text"]
    });
  }
  
  async run(msg, [user, reason]) {
    return user.send(`You've been warned in **${msg.guild.name}** by **${msg.author.tag}** for: ${reason}`)
      .then(() => {
        this.client.emit("modlogs", msg.guild, "warn", { name: "warn", user, mod: msg.member, reason });
        return msg.send(`Warned **${user.user.tag}**`)
          .then((m) => m.delete({ timeout: 3000 }))
          .then(() => msg.delete())
          .catch(() => null);
      })
      .catch(() => msg.send("I couldn't dm the user, maybe they have DMs blocked."));
  }
}

module.exports = Warn;
