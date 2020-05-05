const Command = require("../../structures/Command.js");

class Reboot extends Command {
  constructor(...args) {
    super(...args, {
      description: "Shuts down/Reboots the bot.",
      ownerOnly: true,
      aliases: ["shutdown", "restart"]
    });
  }

  async run(ctx, args) {
    await ctx.reply("Shutting down...");
    await this.client.dbconn.release();
    await this.client.db.end();
    process.exit();
  }
}

module.exports = Reboot;
