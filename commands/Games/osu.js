const { Command } = require("klasa");

class Osu extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a picture with your osu! stats",
      cooldown: 5,
      usage: "<username:string>"
    });
  }
  
  async run(msg, [user]) {
    const image = await this.client.idioticapi.osu(user).catch(() => {
      throw "Failed to fetch that username.";
    });
    return msg.channel.sendFile(image, "osu.png");
  }
}

module.exports = Osu;
