const Command = require("../../structures/Command.js");

class Achievement extends Command {
  constructor(...args) {
    super(...args, {
      description: "Achievement Get!",
      cooldown: 3,
      cost: 5,
      usage: "achievement [@user] <text>",
      options: [
        {
          name: "user",
          description: "The user that got the achievement.",
          type: "user",
          required: true
        },
        {
          name: "text",
          description: "Text of the achievement.",
          type: "string",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const user = options.getUser("user");
    const text = options.getString("text");

    if (text.length > 21) {
      return ctx.reply("Baka! Text cannot be longer than 21 characters.");
    }

    const img = await this.client.img.achievement(user.displayAvatarURL({ size: 64, extension: "png" }), text);

    return ctx.reply({
      files: [{ attachment: img, name: "achievement.png" }]
    });
  }
}

module.exports = Achievement;
