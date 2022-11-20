const Command = require("../../structures/Command.js");
const { request } = require("undici");

class YoMomma extends Command {
  constructor(...args) {
    super(...args, {
      description: "Yo momma so fat.",
      aliases: ["urmom"],
      cooldown: 3,
      usage: "yomomma [@user]",
      options: [
        {
          name: "user",
          description: "The user to insult their mom. By default that's you!",
          type: "user"
        }
      ]
    });
  }
  
  async run(ctx, options) {
    const user = options.getUser("user") ?? ctx.author;

    const { joke } = await request("http://api.yomomma.info")
      .then(({ body }) => body.json());

    return ctx.reply(`${user}, ${joke}`);
  }
}

module.exports = YoMomma;
