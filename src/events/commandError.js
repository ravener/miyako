const Event = require("../structures/Event.js");
const { random } = require("../utils/utils.js");
const responses = require("../utils/responses.js");

class CommandError extends Event {
  async run(ctx, err) {
    // Allow throw "string" to unwind stack from deepest calls
    // for replying with an error message.
    if (typeof err === "string") {
      return ctx.reply({ content: err });
    }

    this.client.log.error(err);

    if (ctx.owner) {
      await ctx.reply(random(responses.reloadErr)
        .replace(/{{command}}/g, ctx.command.name)
        .replace(/{{user}}/g, ctx.author.username)
        .replace(/{{response}}/g, err.message || err))
        .catch(() => null);
    } else {
      await ctx.reply("Something went wrong with the command, whoopsie! I have reportd it to my master, now you are gonna have to wait for it to be fixed, how is that? ｡ﾟ･ (>﹏<) ･ﾟ｡").catch(() => null);
    }

    const channel = this.client.channels.cache.get("454776836929617921");
    if (!channel) return;

    const embed = this.client.embed(ctx.author)
      .setTitle("Command Error")
      .setDescription(`An Error occured in command: ${ctx.command.name}\n\`\`\`js\n${err.stack || err}\`\`\``)
      .setFooter({  
        text: `User ID: ${ctx.author.id}, Guild: ${ctx.guild ? ctx.guild.name : "DM"}`
      });

    return channel.send({ embeds: [embed] }).catch(() => null);
  }
}

module.exports = CommandError;
