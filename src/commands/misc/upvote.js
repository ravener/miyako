const Command = require("../../structures/Command.js");

class Upvote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Upvote for me!",
      aliases: ["vote"]
    });

    this.url = "https://top.gg/bot/397796982120382464/vote";
  }

  async run(msg) {
    return msg.send(`Upvote me here: ${this.url}\n\nUpvoting will help me grow and in the future will have some special perks!`);
  }
}

module.exports = Upvote;
