const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class YoMomma extends Command {
  constructor(...args) {
    super(...args, {
      description: "Yo momma so fat.",
      aliases: ["urmom"],
      cooldown: 3,
      usage: "yomomma [@user]"
    });
  }
  
  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const { joke } = await fetch("http://api.yomomma.info")
      .then((res) => res.json());

    return msg.send(`${user}, ${joke}`);
  }
}

module.exports = YoMomma;
