const { Command } = require("klasa");
const superagent = require("superagent");

class YoMomma extends Command {
  constructor(...args) {
    super(...args, {
      description: "Yomomma so fat.",
      aliases: ["urmom"],
      cooldown: 3,
      usage: "[user:user]"
    });
  }
  
  async run(msg, [user]) {
    const joke = await superagent.get("http://api.yomomma.info")
      .then((res) => JSON.parse(res.text).joke);
    return msg.send(`${user ? `${user}, ` : ""}${joke}`);
  }
}

module.exports = YoMomma;