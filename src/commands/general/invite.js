const Command = require("../../structures/Command.js");
const { link } = require("../../utils/utils.js");

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
      .setDescription([
        "You can invite me to your server using the following link:",
        "",
        "",
        link("Invite Link", this.client.invite),
        link("Join Miyako Lounge", "https://discord.gg/mDkMbEh"),
        link("Upvote Miyako", "https://top.gg/bot/397796982120382464/vote"),
        link("Star on GitHub", "https://github.com/ravener/miyako")
      ].join("\n"));

    return ctx.reply({ embeds: [embed] })
  }
}

module.exports = Invite;

