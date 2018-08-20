const { Command } = require("klasa");

class OwOify extends Command {
  constructor(...args) {
    super(...args, {
      description: "OwO what is this",
      usage: "<text:string>",
      aliases: ["owo"],
      cooldown: 3
    });
  }
  
  async run(msg, [text]) {
    return msg.send(await this.client.idioticapi.owoify(text.replace(/@(everyone|here)/g, "@\u200b$1")));
  }
}

module.exports = OwOify;