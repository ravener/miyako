const Command = require("../../structures/Command.js");
const { stripIndents } = require("common-tags");

class Upvote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Upvote for me!",
      aliases: ["vote"],
      modes: ["text"]
    });

    this.url = "https://top.gg/bot/397796982120382464/vote";
  }

  async run(ctx) {
    return ctx.reply(stripIndents`
      Upvote me here: ${this.url}

      Upvoting will help me grow and in the future will have some special perks!`);
  }
}

module.exports = Upvote;
