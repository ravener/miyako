const Command = require("../../structures/Command.js");

class Prune extends Command {
  constructor(...args) {
    super(...args, {
      userPermissions: ["MANAGE_MESSAGES"],
      botPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
      description: "Prunes a certain amount of messages w/o filter.",
      aliases: ["purge"],
      usage: "prune [limit=50] [link|invite|bots|you|me|upload|@user]"
    });
  }

  async run(ctx, [limit, filter = null]) {
    limit = this.verifyInt(limit, 50);

    let messages = await ctx.channel.messages.fetch({ limit: 100 });

    if(filter) {
      const user = await this.verifyUser(ctx, filter).catch(() => null);
      const type = user ? "user" : filter;
      messages = messages.filter(this.getFilter(ctx, type, user));
    }

    messages = messages.array().slice(0, limit);
    await ctx.channel.bulkDelete(messages);
    return ctx.reply(`Successfully deleted ${messages.length} messages from ${limit}.`);
  }

  getFilter(ctx, filter, user) {
    switch(filter) {
      case "link": return (msg) => /https?:\/\/[^ /.]+\.[^ /.]+/.test(msg.content);
      case "invite": return (msg) => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(msg.content);
      case "bots": return (msg) => msg.author.bot;
      case "you": return (msg) => msg.author.id === this.client.user.id;
      case "me": return (msg) => msg.author.id === msg.author.id;
      case "upload": return (msg) => msg.attachments.size > 0;
      case "user": return (msg) => msg.author.id === user.id;
      default: return () => true;
    }
  }
}

module.exports = Prune;
