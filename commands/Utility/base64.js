const { Command, util: { codeBlock } } = require("klasa");
const { clean } = require("../../utils/utils.js");

class Base64 extends Command {
  constructor(...args) {
    super(...args, {
      description: "Encodes/Decodes Base64",
      usage: "<encode|decode> <text:...string>",
      usageDelim: " ",
      aliases: ["b64"],
      subcommands: true
    });
  }
  
  async encode(msg, [text]) {
    return msg.send(codeBlock("", Buffer.from(text).toString("base64")));
  }
  
  async decode(msg, [text]) {
    return msg.send(codeBlock("", clean(msg, Buffer.from(text, "base64").toString("utf8"))));
  }
}

module.exports = Base64;