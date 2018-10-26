const { Command } = require("klasa");
const { clean } = require("../../utils/utils.js");

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
    return msg.send(clean(msg, await this.client.idioticapi.owoify(text)));
  }
}

module.exports = OwOify;