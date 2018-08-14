const { Command } = require("klasa");
const figlet = require("util").promisify(require("figlet"));

class Ascii extends Command {
  constructor(...args) {
    super(...args, {
      description: "Creates an ascii art with text you provide",
      usage: "<text:string>",
      aliases: ["asciiart", "banner", "asciibanner"]
    });
  }
  
  async run(msg, [text]) {
    const results = await figlet(text);
    if(results.length > 2000) throw "Results too long to send, try again with a smaller text.";
    return msg.sendCode("", results);
  }
}

module.exports = Ascii;
