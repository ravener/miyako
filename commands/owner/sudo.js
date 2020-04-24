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

  async run(ctx, [user, cmd, ...args]) {
    const member = await this.verifyMember(ctx, user);
    const command = this.store.get(cmd);
    if(!command) return ctx.reply("That command does not exist!");
    const message = cloneObject(ctx.message);
    message.author = member.user;
    Object.defineProperty(message, "member", { value: member });
    message.content = `m!${command.name}${args.length ? ` ${args.join(" ")}` : ""}`;
    this.client.emit("message", message);
  }
}

module.exports = Sudo;
