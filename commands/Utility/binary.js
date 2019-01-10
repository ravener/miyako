const { Command } = require("klasa");

class Binary extends Command {
  constructor(...args) {
    super(...args, {
      description: "Encode/Decode Binary",
      usage: "<encode|decode|encodeascii|decodeascii> <binary:...string>",
      aliases: ["bin"],
      subcommands: true
    });
  }

  async encode(msg, [text]) {
    if(isNaN(text))
      throw `Input must be a number, if you meant to encode ASCII words use \`${msg.guildSettings.prefix}binary encodeascii <word>\``;
    return msg.send(parseInt(text).toString(2));
  }

  async decode(msg, [binary]) {
    const dec = parseInt(binary, 2);
    if(isNaN(dec))
      throw `Invalid Binary literal entered, If you meant to decode ASCII words try \`${msg.guildSettings.prefix}binary decodeascii <binary>\``;
    return msg.send(String(dec));
  }

  async encodeascii(msg, [text]) {
    const bin = text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2))
      .join("");
    if(bin.length >= 2000) throw "Output too long.";
    return msg.send(bin);
  }

  async decodeascii(msg, [binary]) {
    return msg.send(binary.split(" ").map((bin) => String.fromCharCode(parseInt(bin, 2))).join(""));
  }
}

module.exports = Binary;
