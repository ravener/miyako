const { Command } = require("klasa");
const superagent = require("superagent");

class Hastebin extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["hb"],
      description: "Upload code or text to hastebin.",
      usage: "<code:code|code:str>",
      cooldown: 5
    });
  }

  async run(msg, [code]) {
    const key = await superagent.post("https://hastebin.com/documents")
      .send(code.code ? code.code : code)
      .then((res) => res.body.key)
      .catch((err) => {
        if(err.status === 500 || err.status === 503) throw "Hastebin is unavailable at this time, try again later.";
        throw err;
      });
    return msg.sendMessage(`Hastebin-ified: https://hastebin.com/${key}${code.language ? `.${code.language}` : ""}`);
  }
}

module.exports = Hastebin;