const Command = require("../../structures/Command.js");

class MyID extends Command {
  constructor(...args) {
    super(...args, {
      description: "Retrieve your User ID."
    });
  }

  async run(ctx) {
    return ctx.reply(`${ctx.author} Your User ID is: **${ctx.author.id}**`);
  }
}

module.exports = MyID;
