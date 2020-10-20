const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Color extends Command {
  constructor(...args) {
    super(...args, {
      description: "View a color by hex e.g #FF0000 or with a name like red",
      cooldown: 3,
      cost: 5,
      usage: "color <hex|name>",
      aliases: ["colour"]
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! You need to provide a color #HEX or a name.");

    const img = await this.client.img.color(args.join(" "))
      .catch((err) => {
        // Can't be bothered to make the input correct.
        // So just throw it to the API and report any validation errors.
        throw err.message;
      });

    return msg.send(new MessageAttachment(img, "color.png"));
  }
}

module.exports = Color;
