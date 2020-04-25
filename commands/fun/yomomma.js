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
  
  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const { joke } = await fetch("http://api.yomomma.info")
      .then((res) => res.json());

    return ctx.reply(`${user}, ${joke}`);
  }
}

module.exports = YoMomma;
