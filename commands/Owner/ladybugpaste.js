const { Command } = require("klasa");
const { post } = require("superagent");

class LadybugPaste extends Command {
  constructor(...args) {
    super(...args, {
      description: "Paste code in ladybug pastebin",
      permissionLevel: 10,
      usage: "<code:string|code:codeblock>",
      aliases: ["pastebin", "lbpaste"]
    });
  }

  async run(msg, [code]) {
    const url = await post("https://itsladybug.ml/pastebin/json")
      .set("Authorization", this.client.config.pastebin)
      .send({ content: code.code ? code.code : code })
      .then((res) => res.body.url);
    return msg.send(`Pastebin-ified: ${url}${code.language || ""}`);
  }
}

module.exports = LadybugPaste;
