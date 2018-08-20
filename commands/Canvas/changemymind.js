const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class ChangeMyMind extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change my mind",
      usage: "<text:string>",
      aliases: ["cmm"]
    });
  }
  
  async run(msg, [text]) {
    return msg.send(new MessageAttachment(await this.client.idioticapi.changemymind(msg.author.displayAvatarURL({ format: "png", size: 1024 }), text), "changemymind.png"));
  }
}

module.exports = ChangeMyMind;