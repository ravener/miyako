const Command = require("../../structures/Command.js");
const { Util: { cloneObject } } = require("discord.js");

class Sudo extends Command {
  constructor(...args) {
    super(...args, {
      description: "Run a command as someone else.",
      ownerOnly: true,
      guildOnly: true,
      usage: "sudo <@user> <command> [args...]"
    });
  }

  async run(msg, [user, cmd, ...args]) {
    const member = await this.verifyMember(msg, user);
    const command = this.store.get(cmd);
    if(!command) return msg.send("That command does not exist!");
    const message = cloneObject(msg);
    message.author = member.user;
    Object.defineProperty(message, "member", { value: member });
    message.content = `m!${command.name}${args.length ? ` ${args.join(" ")}` : ""}`;
    await this.client.monitors.get("command").run(msg);
  }
}

module.exports = Sudo;
