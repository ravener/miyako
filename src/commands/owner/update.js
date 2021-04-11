const Command = require("../../structures/Command.js");

class Update extends Command {
  constructor(...args) {
    super(...args, {
      description: "Execs git pull to update bot.",
      ownerOnly: true,
      usage: "update --reload=commands --reboot"
    });
  }
  
  async run(msg) {
    await this.store.get("exec").run(msg, ["git pull"]);

    if (msg.commandFlags.reload) {
      if (msg.commandFlags.reload === "commands" || msg.commandFlags.reload === "events") {
        await this.store.get("load").run(msg, [msg.commandFlags.reload]);
      } else {
        await this.client.commands.get("reload").run(msg, [msg.commandFlags.reload]);
      }
    }
    
    if (msg.commandFlags.reboot) {
      await this.client.commands.get("reboot").run(msg);
    }
  }
}

module.exports = Update;
