const { Command } = require("klasa");
const { Canvas } = require("canvas-constructor");
const { wordwrap } = require("../../utils/utils.js");
const { get } = require("superagent");
const fsn = require("fs-nextra");

class TrapCard extends Command {
  constructor(...args) {
    super(...args, {
      description: "Create a Yugioh trap card",
      aliases: ["yugioh", "yugi", "trap"],
      usage: "[user:user] <text:string> [...]",
      usageDelim: " ",
      cooldown: 5
    });
  }

  async run(msg, [user = msg.author, ...text]) {
    const image = await fsn.readFile(`${process.cwd()}/assets/trap.jpg`);
    const av = await get(user.displayAvatarURL({ format: "png", size: 1024 })).then((r) => r.body);
    const buff = await new Canvas(333, 493)
      .addImage(image, 0, 0, 333, 493)
      .addImage(av, 44, 106, 245, 250)
      .addText(wordwrap(text.join(" "), 45), 40, 395)
      .setTextFont("20px Arial")
      .setColor("#FFFFFF")
      .addText(user.username, 29, 50)
      .toBufferAsync();
    return msg.channel.sendFile(buff, "trapcard.png");
  }
}

module.exports = TrapCard;
