const { Command } = require("klasa");

class Update extends Command {
  constructor(...args) {
    super(...args, {
      description: "Execs git pull to update bot.",
      aliases: ["git", "pull"],
      permissionLevel: 10,
      guarded: true
    });
  }
  
  async run(msg) {
    await this.client.commands.get("exec").run(msg, ["git pull"]);
    if("r" in  msg.flags || "reload" in msg.flags) {
      await this.client.commands.get("reload").run(msg, [msg.flags.r || msg.flags.reload]);
    } else if("restart" in msg.flags || "reboot" in msg.flags) {
      await this.client.commands.get("reboot").run(msg);
    }
  }
}

module.exports = Update;
