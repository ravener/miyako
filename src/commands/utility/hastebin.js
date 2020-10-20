const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class Hastebin extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["hb"],
      description: "Upload some code to hastebin.",
      usage: "hastebin <code>",
      cooldown: 5
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What am I supposed to upload?");

    const { code, lang } = this.client.utils.getCodeBlock(msg.rawArgs);
  
    const { key } = await fetch("https://hastebin.com/documents", {
      method: "POST",
      body: code
    })
      .then((res) => {
        if(!res.ok) throw `Something went wrong with Hastebin. Try again later. (Status: ${res.status} ${res.statusText})`;
        return res.json();
      });

    return msg.send(`Hastebin-ified: https://hastebin.com/${key}${lang ? `.${lang}` : ""}`);
  }
}

module.exports = Hastebin;
