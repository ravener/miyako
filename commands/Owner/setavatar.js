const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");

class SetAvatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Changes bot avatar url",
      aliases: ["setav"],
      permissionLevel: 10,
      usage: "<url:url>"
    });
  }

  async run(msg, [url]) {
    const { body } = await ladybug(url).catch(() => ({ body: null }));
    if(!body) throw "Failed to fetch URL.";
    // i.e if its parsed as json
    if(!Buffer.isBuffer(body)) throw "The URL did not return a buffer.";
    await this.client.user.setAvatar(body);
    return msg.send("Done! changed my avatar.");
  }
}

module.exports = SetAvatar;
