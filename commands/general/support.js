const Command = require("../../structures/Command.js");

class Support extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get the link to our support server."
    });
  }

  async run(ctx, args) {
    return ctx.reply("Join our server at https://discord.gg/mDkMbEh for support or to just chill.");
  }
}

module.exports = Support;
