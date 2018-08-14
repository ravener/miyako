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
    this.client.commands.get("exec").run(msg, ["git pull"]).then(() => {
      if("r" in  msg.flags || "reload" in msg.flags) {
        this.client.commands.get("reload").run(msg, [msg.flags.r || msg.flags.reload]);
      } else if("restart" in msg.flags || "reboot" in msg.flags) {
        this.client.commands.get("reboot").run(msg);
      }
    });
  }
}

module.exports = Update;
