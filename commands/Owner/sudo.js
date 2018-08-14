const { Command } = require("klasa");
const { Util: { cloneObject } } = require("discord.js");

class Sudo extends Command {
  constructor(...args) {
    super(...args, {
      description: "Runs a command behalf of another user",
      permissionLevel: 10,
      guarded: true,
      usage: "<user:member> <command:command> [args:string] [...]",
      runIn: ["text"],
      usageDelim: " "
    });
  }
  
  async run(message, [member, command, ...args]) {
    const msg = cloneObject(message);
    msg.author = member.user;
    Object.defineProperty(msg, "member", { value: member });
    msg.content = `${message.guild.settings.prefix}${command.name} ${args.length ? args.join(" ") : ""}`;
    this.client.emit("message", msg);
  }
}

module.exports = Sudo;
