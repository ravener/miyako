const { Command, util: { codeBlock } } = require("klasa");
const { createHash } = require("crypto");

class Hash extends Command {
  constructor(...args) {
    super(...args, {
      description: "Creates a hash from the algorithm you pick",
      usage: "<sha256|sha512|md5|sha|sha1|md4|sha384|sha224|whirlpool> <text:string> [...]",
      aliases: ["createhash"],
      usageDelim: " ",
      subcommands: true,
      extendedHelp: "This command will create a hash of an algorithm you pick. if a hash is too long to be sent you can add --dm to dm the full hash into multiple messages, most hashes also support RSA Encryption to add RSA Encryption add --rsa into your message."
    });
  }

  async hash(msg, algorithm, text) {
    if(msg.flags.rsa && algorithm === "whirlpool") throw "Whirlpool doesn't support RSA Encryption";
    const rsa = msg.flags.rsa ? "WithRSAEncryption" : "";
    const hash = createHash(algorithm + rsa).update(text.join(" ")).digest("hex");
    if(msg.flags.dm) {
      await msg.author.send(hash, { code: true, split: "\n" })
        .catch(() => {
          throw "Couldn't DM you, make sure you have DMs enabled";
        });
      return msg.send("DMed you the full hash!");
    }
    if(hash.length > 1980) throw "Hash results too long to be sent, append --dm in your message and i'll dm you the full hash splitted into multiple messages.";
    return msg.send(codeBlock("", hash));
  }

  async md5(msg, text) {
    return this.hash(msg, "md5", text);
  }

  async sha512(msg, text) {
    return this.hash(msg, "sha512", text);
  }

  async sha256(msg, text) {
    return this.hash(msg, "sha256", text);
  }

  async sha(msg, text) {
    return this.hash(msg, "sha", text);
  }

  async sha1(msg, text) {
    return this.hash(msg, "sha1", text);
  }

  async md4(msg, text) {
    return this.hash(msg, "md4", text);
  }

  async sha384(msg, text) {
    return this.hash(msg, "sha384", text);
  }

  async sha224(msg, text) {
    return this.hash(msg, "sha224", text);
  }

  async whirlpool(msg, text) {
    return this.hash(msg, "whirlpool", text);
  }
}

module.exports = Hash;
