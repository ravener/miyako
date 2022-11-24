const Command = require("../../structures/Command.js");
const { request } = require("undici");

class DogFact extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["dogfacts"],
      description: "Gives you a random dog fact.",
      cooldown: 5
    });
  }
  
  async run(ctx) {
    const fact = await request("https://dog-api.kinduff.com/api/facts?number=1")
      .then(({ body }) => body.json())
      .then((body) => body.facts[0]);

    return ctx.reply(`📢 **Dogfact:** *${fact}*`);
  }
}

module.exports = DogFact;
