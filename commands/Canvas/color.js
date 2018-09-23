const { Command } = require("klasa");

class Color extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a color",
      extendedHelp: "Examples:\ncolor rgb(a, b, c)\ncolor #FF0000",
      usage: "<color:string>",
      cooldown: 5,
      aliases: ["colour"]
    });
  }

  async run(msg, [color]) {
    return msg.channel.sendFile(await this.client.idioticapi.color(color), "color.png");
  }
}

module.exports = Color;
