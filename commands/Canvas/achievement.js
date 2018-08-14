const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Achievement extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get an achievement!",
      cooldown: 5,
      usage: "[user:username] <text:string> [...]",
      usageDelim: " "
    });
  }

  async run(msg, [user = msg.author, ...text]) {
    if(text.join(" ").length > 22) throw "Text must be smaller than 22 characters.";
    return msg.send(new MessageAttachment(await this.client.idioticapi.achievement(user.displayAvatarURL({ format: "png", size: 2048 }), text.join(" ")), "achievement.png"));
  }
}

module.exports = Achievement;
