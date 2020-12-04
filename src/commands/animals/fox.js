const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Fox extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomfox"],
      description: "Grabs a random fox image from randomfox.ca",
      extendedHelp: "This command grabs a random fox from https://randomfox.ca/floof/",
      cooldown: 3
    });
  }

  async run(msg) {
    const { image } = await fetch("https://randomfox.ca/floof/")
      .then((res) => res.json());

    return msg.send(this.client.embed()
      .setTitle(msg.tr("COMMAND_FOX_TITLE"))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setImage(image));
  }
}

module.exports = Fox;
