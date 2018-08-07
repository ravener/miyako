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
    return this.client.commands.get("exec").run(msg, "git pull");
  }
}

module.exports = Update;