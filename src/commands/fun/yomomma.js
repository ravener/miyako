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

    if (user.id === this.client.user.id) {
      return ctx.reply("My mom is doing fine thanks, how about yours?");
    }

    const { joke } = await request("https://api.yomomma.info")
      .then(({ body }) => body.json());

    return ctx.reply(`${user}, ${joke}`);
  }
}

module.exports = YoMomma;
