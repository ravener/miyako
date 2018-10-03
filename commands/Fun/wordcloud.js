const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");
const cloud = require("d3-cloud");
const Canvas = require("canvas");
const messageLimitHundreds = 1;

// Blame node-canvas for this dirty workaround. Canvas.createCanvas for 2.x, new canvas.Canvas for 1.x
const createCanvas = typeof Canvas.createCanvas === "function" ?
  (...args) => Canvas.createCanvas(...args) :
  (...args) => new Canvas(...args);

class WorldCloud extends Command {
  constructor(...args) {
    super(...args, {
      description: "Generate a wordcloud from the messages in a chat.",
      requiredPermissions: ["ATTACH_FILES", "READ_MESSAGE_HISTORY"],
      cooldown: 10
    });
  }

  async run(msg) {
    const finalImage = createCanvas(2000, 2000);
    const ctx = finalImage.getContext("2d");
    const wordBank = {};

    let messageBank = await msg.channel.messages.fetch({ limit: 100 });
    for (let i = 1; i < messageLimitHundreds; i++) {
      messageBank = messageBank.concat(await msg.channel.messages.fetch({ limit: 100, before: messageBank.last().id }));
    }

    for (const message of messageBank.values()) {
      if (message.content.length <= 2) continue;
      message.content.split(".").join(" ").split(" ").forEach(word => {
        const cleanWord = word.replace(/\W+/g, "").substring(0, 20);
        if (!wordBank[cleanWord]) wordBank[cleanWord] = 0;
        wordBank[cleanWord]++;
      });
    }

    const wordList = Object.keys(wordBank).filter(word => wordBank[word] > 3 && word.length > 4)
      .map(word => ({ text: word, size: 10 * wordBank[word] }));

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 2000, 2000);
    ctx.translate(1000, 1000);
    const end = (words) => {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const rotation = word.rotate;
        ctx.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        ctx.font = `${(word.size * 0.8) + 3}px Arial`;
        ctx.rotate(rotation);
        ctx.fillText(word.text, word.x, word.y);
        ctx.rotate(-rotation);
      }
      const buffer = finalImage.toBuffer();
      return msg.sendMessage(new MessageAttachment(buffer, "image.jpg"));
    };


    cloud().size([1950, 1950])
      .canvas(() => createCanvas(1, 1))
      .words(wordList)
      .padding(1)
      .rotate(() => 0)
      .font("Arial")
      .text((word) => word.text)
      .fontSize((word) => word.size)
      .on("end", end)
      .start();
  }
}

module.exports = WorldCloud;
