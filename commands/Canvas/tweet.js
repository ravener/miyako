const { Command } = require("klasa");
const { Canvas } = require("canvas-constructor");
const { wordwrap } = require("../../utils/utils.js");
const fsn = require("fs-nextra");

class Tweet extends Command {
  constructor(...args) {
    super(...args, {
      description: "Tweet something as trump",
      aliases: ["trump", "trumptweet"],
      usage: "<text:string>"
    });
  }

  async run(msg, [text]) {
    const image = await fsn.readFile(`${process.cwd()}/assets/tweet.png`);
    const buff = await new Canvas(1200, 628)
      .addImage(image, 0,  0, 1200, 628)
      .setTextFont("50px Arial")
      .addText(text, 50, 200)
      .toBufferAsync();
    return msg.channel.sendFile(buff, "tweet.png");
  }
}

module.exports = Tweet;
