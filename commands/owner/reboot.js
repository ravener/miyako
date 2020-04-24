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
    // Do other cleanup in the future, e.g close database connection.
    process.exit();
  }
}

module.exports = Reboot;
