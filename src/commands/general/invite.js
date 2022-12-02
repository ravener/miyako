const Command = require("../../structures/Command.js");
const { link } = require("../../utils/utils.js");
const { stripIndents } = require("common-tags");

class Invite extends Command {
  constructor(...args) {
    super(...args, {
      description: "Invite me to your server!",
      aliases: ["inv"],
      modes: ["text"]
    });
  }

  async run(ctx) {
    const embed = this.client.embed(this.client.user)
      .setTitle("Invite Miyako to your server")
      .setDescription(stripIndents`
        You can invite me to your server using the following link:

        • ${link("Invite Link", this.client.invite)}
        • ${link("Join Miyako Lounge", "https://discord.gg/mDkMbEh")}
        • ${link("Upvote Miyako", "https://top.gg/bot/397796982120382464/vote")}
        • ${link("Start on GitHub", "https://github.com/ravener/miyako")}`);

    return ctx.reply({ embeds: [embed] })
  }
}

module.exports = Invite;

