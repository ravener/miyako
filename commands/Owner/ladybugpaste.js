const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");

class LadybugPaste extends Command {
  constructor(...args) {
    super(...args, {
      description: "Paste code in ladybug pastebin",
      permissionLevel: 10,
      usage: "<code:codeblock|code:string>",
      aliases: ["pastebin", "lbpaste"]
    });
  }

  async run(msg, [code]) {
    const url = await ladybug.post("https://itsladybug.ml/pastebin/json")
      .set("Authorization", this.client.config.pastebin)
      .send({ content: code.code ? code.code : code })
      .then((res) => res.body.url);
    return msg.send(`Pastebin-ified: ${url}${code.language ? `.${code.language}` : ""}`);
  }
}

module.exports = LadybugPaste;
