const Command = require("../../structures/Command.js");

class Reboot extends Command {
  constructor(...args) {
    super(...args, {
      description: "Shuts down/Reboots the bot.",
      ownerOnly: true,
      aliases: ["shutdown", "restart"]
    });
  }

  async run(msg, args) { // eslint-disable-line no-unused-vars
    await msg.send("Shutting down...");
    await this.client.dbClient.close();
    process.exit();
  }
}

module.exports = Reboot;
