const Command = require("../../structures/Command.js");

class DM extends Command {
  constructor(...args) {
    super(...args, {
      description: "DMs someone",
      ownerOnly: true,
      usage: "dm <user> <msg...>",
      aliases: ["pm"],
      modes: ["text"],
      options: [
        {
          name: "user",
          description: "The user to DM.",
          type: "user",
          required: true
        },
        {
          name: "message",
          description: "The message to send.",
          type: "string",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const user = options.getUser("user");
    const message = options.getString("message");

    try {
      const embed = this.client.embed(ctx.author)
        .setTitle("Message from the bot owner")
        .setDescription([
          message,
          "",
          "You may [join our support server](https://discord.gg/mDkMbEh) if you want to reply or for further discussion."
        ].join("\n"));

      await user.send({ embeds: [embed] });
      return ctx.reply(`Message sent to **${user.tag}** (${user.id})`);
    } catch (err) {
      if (err.status === 403) {
        return ctx.reply({
          content: "I cannot DM that user, they probably have DMs blocked."
        });
      }

      throw err;
    }
  }
}

module.exports = DM;
