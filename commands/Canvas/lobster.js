const { Command } = require("klasa");
const { wordwrap } = require("../../utils/utils.js");
const { Canvas } = require("canvas-constructor");

Canvas.registerFont(`${process.cwd()}/assets/lobster.ttf`);

class Lobster extends Command {
  constructor(...args) {
    super(...args, {
      description: "Send some text in lobster font",
      extendedDescription: "Send some text in lobster font, the font used by Miraculous Ladybug",
      cooldown: 5,
      aliases: ["mlfont", "miraculousladybug", "lobsterfont"],
      usage: "<user:user|text:string>"
    });
  }

  async run(msg, [userOrText]) {
    const str = userOrText.username ? userOrText.username : userOrText;
    if(str.length > 52) throw "Text should be smaller than 52 characters.";
    const buff = await new Canvas(700, 300)
      .setTextFont("70px Lobster")
      .setColor("#FFFFFF")
      .addText(utils.wordwrap(str, 20), 70, 100)
      .toBufferAsync();
    return msg.channel.sendFile(buff, "lobster.png");
  }
}

module.exports = Lobster;
