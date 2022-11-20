const Command = require("../../structures/Command.js");

class Avatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Grab someone's avatar.",
      aliases: ["av", "pfp"],
      usage: "avatar [@user]",
      options: [
        {
          name: "user",
          description: "The user to get the avatar of.",
          type: "user"
        }
      ]
    });
  }

  async run(ctx, options) {
    const user = options.getUser("user") ?? ctx.author;

    const embed = this.client.embed(user)
      .setTitle(`${user.username}'s avatar`)
      .setImage(user.displayAvatarURL({
        size: 2048,
        format: "png",
        dynamic: true
      }));

    return ctx.reply({ embeds: [embed] })
  }
}

module.exports = Avatar;
