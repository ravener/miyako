const Command = require("../../structures/Command.js");

class Store extends Command {
  constructor(...args) {
    super(...args, {
      description: "Buy/Sell Roles in exchange for social currency.",
      extendedHelp: "Examples: m!store add 1000 VIP (sell VIP role for ¥1000)\nm!store add 0 Cool Guy (Sell the Cool Guy role for free)\nm!store buy VIP (buy the role.)\nm!store sell VIP (sell and remove the role for a 50% refund)",
      usage: "store <add|sell|buy|delete|view:default> <role>",
      guildOnly: true,
      aliases: ["shop"]
    });
  }

  async run(ctx, [action = "view", ...args]) {
    if(!["view", "delete", "buy", "sell", "add"].includes(action))
      return ctx.reply(`Usage: \`${ctx.guild.settings.prefix}${this.usage}\`\n\`\`\`${this.extendedHelp}\n\`\`\``);

    return this[action](ctx, args);
  }

  async sell(ctx, args) {
    const rolename = args.join(" ");
    if(!rolename) return ctx.reply(`Usage: \`${ctx.guild.prefix}store sell <rolename>\``);

    const role = ctx.guild.roles.cache.find((r) => r.name === rolename);
    if(!role) return ctx.reply("That role does not exist!");

    if(!ctx.member.roles.cache.has(role.id)) return ctx.reply("Baka! You don't have that role!");

    const store = this.client.settings.store.get(role.id);
    if(!store) return ctx.reply("Baka! That role is not for sale!");

    if(role.position > ctx.guild.me.roles.highest.position)
      return ctx.reply("I cannot remove that role from you! My role position needs to be higher than the role you are trying to sell.");

    // Calculate the refund. Which is half the price.
    const refund = Math.floor(parseInt(store.price) / 2);

    await ctx.member.roles.remove(role);
    if(refund !== 0) await ctx.member.givePoints(refund);

    return ctx.reply(`Successfully sold the role **${rolename}** for **¥${refund.toLocaleString()}** refund.`);
  }

  async buy(ctx, args) {
    const rolename = args.join(" ");
    if(!rolename) return ctx.reply(`Usage: \`${ctx.guild.settings.prefix}store buy <rolename>\``);

    const role = ctx.guild.roles.cache.find((r) => r.name === rolename);
    if(!role) return ctx.reply("That role does not exist!");

    if(ctx.member.roles.cache.has(role.id)) return ctx.reply("Baka! You already have that role.");

    const store = this.client.settings.store.get(role.id);

    if(!store) return ctx.reply("Baka! That role is not for sale!");
    const price = parseInt(store.price);

    if(ctx.member.points < price)
      return ctx.reply(`Baka! You only have **¥${ctx.member.points.toLocaleString()}**, but the role costs: **¥${price.toLocaleString()}**`);

    if(role.position > ctx.guild.me.roles.highest.position)
      return ctx.reply("I cannot add that role to you! My role position must be higher than the role you are trying to buy.");
    
    await ctx.member.roles.add(role);
    if(price !== 0) await ctx.member.takePoints(price);

    return ctx.reply(`Successfully bought the role **${rolename}** for **¥${parseInt(store.price).toLocaleString()}**`);
  }

  async delete(ctx, args) {
    if(!ctx.member.permissions.has("MANAGE_GUILD"))
      return ctx.reply("Baka! You need the `Manage Server` permissions to delete roles from the store.");

    const rolename = args.join(" ");
    if(!rolename) return ctx.reply(`Usage: \`${ctx.guild.settings.prefix}store delete <role>\``);

    const role = ctx.guild.roles.cache.find((r) => r.name === rolename);
    if(!role) return ctx.reply(`The role **${rolename}** does not exist.`);

    if(!this.client.settings.store.cache.has(role.id)) return ctx.reply("That role isn't on sale.");

    await this.client.settings.store.delete(role.id);
    return ctx.reply(`Successfully removed the role **${rolename}** from the store.`);
  }

  async add(ctx, [price, ...rolename]) {
    // Check for permissions.
    if(!ctx.member.permissions.has("MANAGE_GUILD"))
      return ctx.reply("Baka! You need the `Manage Server` permissions to add roles to the store.")

    if(!price) return ctx.reply(`Usage: \`${ctx.guild.settings.prefix}store add <price> <rolename>`);
    price = this.verifyInt(price);

    // Always guard against abuse.
    if(price >= Number.MAX_SAFE_INTEGER) return ctx.reply("Baka! That price is too high.");

    // Verify the role.
    if(!rolename.length) return ctx.reply(`Usage: \`${ctx.guild.settings.prefix}store add <price> <rolename>\``);
    const role = ctx.guild.roles.cache.find((r) => r.name === rolename.join(" "));
    if(!role) return ctx.reply(`The role **${rolename.join(" ")}** does not exist!`);

    // Make sure we can add it.
    if(role.position >= ctx.guild.me.roles.highest.position)
      return ctx.reply("I can't add that role to users. My role position must be higher than the role you are trying to sell.");

    // Make sure it's not already added.
    if(this.client.settings.store.cache.has(role.id)) return ctx.reply("That role is already on sale!");

    const roles = await this.client.settings.store.find({
      where: { guild: ctx.guild.id }
    });

    if(roles.length >= 25) return ctx.reply("Too many roles for sale! Cannot sell more than 25. Remove some before trying again.");

    // Add it.
    await this.client.settings.store.update(role.id, { price, guild: ctx.guild.id });
    return ctx.reply(`Success! **${rolename.join(" ")}** is now on sale for **¥${price}**`);
  }

  async view(ctx) {
    // Fetch all roles for this server.
    const roles = await this.client.settings.store.find({
      where: { guild: ctx.guild.id },
      sort: { price: -1 }
    });
    
    // Make sure there is something to view.
    if(!roles.length) return ctx.reply("There are no roles for sale in this server.");
    
    // Filter non-existent roles and create a view.
    const view = roles.filter((r) => ctx.guild.roles.cache.has(r.id)).map((r) => {
      const role = ctx.guild.roles.cache.get(r.id);
      const price = parseInt(r.price) === 0 ? "FREE" : `¥${parseInt(r.price).toLocaleString()}`;
      const has = ctx.member.roles.cache.has(r.id);
      
      return `❯ ${role.name}${" ".repeat(20 - role.name.length)}:: ${price}${has ? " :: ✓" : ""}`;
    });
    
    // Show it.
    return ctx.reply(`= ${ctx.guild.name} Store =\n= Roles for Sale =\n${view.join("\n")}`, { code: "asciidoc" });
  }
}

module.exports = Store;
