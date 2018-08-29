const { Command } = require("klasa");

class VaporWave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Send a text  in vaporwave",
      usage: "<text:string>",
      aliases: ["vapor"],
      cooldown: 3
    });
  }
  
  async run(msg, [text]) {
    return msg.send(await this.client.idioticapi.vapor(text));
  }
}

module.exports = VaporWave;