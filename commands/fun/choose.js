const Command = require("../../structures/Command.js");

class Choose extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pick a random choice!",
      extendedHelp: "Seperate choices with a comma.",
      usage: "choose <option 1, option 2, option 3 ...>",
      aliases: ["choice", "pick"]
    });
  }
  
  async run(ctx, args) {
    const choices = args.join(" ").split(",");
    if(choices.length < 2) return ctx.reply("Not enough choices to pick from. Seperate your choices with a comma.");

    const msg = await ctx.reply(`${this.client.constants.typing} **${this.client.user.username}** is thinking...`);

    await this.client.utils.sleep(Math.floor(Math.random() * 1500) + 1000);

    const choice = this.client.utils.random(choices);

    return msg.edit(`I think \`${choice.trim()}\``);
  }
}

module.exports = Choose;
