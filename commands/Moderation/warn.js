const { Command } = require("klasa");

class Warn extends Command {
  constructor(...args) {
    super(...args, {
      description: "Warns a member",
      permissionLevel: 5,
      usage: "<user:member> <reason:string> [...]",
      usageDelim: " ",
      runIn: ["text"]
    });
  }
  
  async run(msg, [user, ...reason]) {
    return user.send(`You've been warned in ${msg.guild.name} by ${msg.author.tag} for: ${reason.join(" ")}`)
      .then((m) => {
        this.client.emit("modlogs", "warn", { name: "warn", user, reason: reason.join(" ") });
        return msg.send(`Warned **${user.tag}**`);
      })
      .catch(() => msg.send("I couldn't dm the user, maybe they have DMs blocked."));
  }
}

module.exports = Warn;
