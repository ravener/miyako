const Command = require("../../structures/Command.js");

class Title extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change your profile's title",
      usage: "title <title>"
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! You must provide a title.");
    const title = args.join(" ");
    await ctx.author.update({ title });
    return ctx.reply(`Success! changed your title view it with \`${ctx.guild.settings.prefix}profile\``);
  }
}

module.exports = Title;
