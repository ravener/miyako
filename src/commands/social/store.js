const Command = require("../../structures/Command.js");

class Store extends Command {
  constructor(...args) {
    super(...args, {
      description: "Buy/Sell Roles in exchange for social currency.",
      extendedHelp: "Examples:\n  **m!store add 1000 VIP** (sell VIP role for ¥1000)\n  **m!store add 0 Cool Guy** (Sell the Cool Guy role for free)\n  **m!store buy VIP** (buy the role.)\n  **m!store sell VIP** (sell and remove the role for a 50% refund)",
      usage: "store <add|sell|buy|delete|view:default> <role>",
      guildOnly: true,
      aliases: ["shop"],
      botPermissions: ["MANAGE_ROLES"]
    });
  }

  async run(msg, [action = "view", ...args]) {
    if(!["view", "delete", "buy", "sell", "add"].includes(action))
      return msg.send(`Usage: \`${msg.guild.settings.prefix}${this.usage}\`\n\`\`\`${this.extendedHelp}\n\`\`\``);

    return this[action](msg, args);
  }

  async sell(msg, args) {
    const rolename = args.join(" ").toLowerCase();
    if(!rolename) return msg.send(`Usage: \`${msg.guild.prefix}store sell <rolename>\``);

    const role = msg.guild.roles.cache.find((r) => (r.id === rolename) || (r.name.toLowerCase() === rolename));
    if(!role) return msg.send("That role does not exist!");

    if(!msg.member.roles.cache.has(role.id)) return msg.send("Baka! You don't have that role!");

    const store = this.client.settings.store.get(role.id);
    if(!store) return msg.send("Baka! That role is not for sale!");

    if(role.position > msg.guild.me.roles.highest.position)
      return msg.send("I cannot remove that role from you! My role position needs to be higher than the role you are trying to sell.");

    // Calculate the refund. Which is half the price.
    const refund = Math.floor(parseInt(store.price) / 2);

    await msg.member.roles.remove(role);
    if(refund !== 0) await msg.member.givePoints(refund);

    return msg.send(`Successfully sold the role **${role.name}** for **¥${refund.toLocaleString()}** refund.`);
  }

  async buy(msg, args) {
    const rolename = args.join(" ").toLowerCase();
    if(!rolename) return msg.send(`Usage: \`${msg.guild.settings.prefix}store buy <rolename>\``);

    const role = msg.guild.roles.cache.find((r) => (r.id === rolename) || (r.name.toLowerCase() === rolename));
    if(!role) return msg.send("That role does not exist!");

    if(msg.member.roles.cache.has(role.id)) return msg.send("Baka! You already have that role.");

    const store = this.client.settings.store.get(role.id);

    if(!store) return msg.send("Baka! That role is not for sale!");
    const price = parseInt(store.price);

    if(msg.member.points < price)
      return msg.send(`Baka! You only have **¥${msg.member.points.toLocaleString()}**, but the role costs: **¥${price.toLocaleString()}**`);

    if(role.position > msg.guild.me.roles.highest.position)
      return msg.send("I cannot add that role to you! My role position must be higher than the role you are trying to buy.");
    
    await msg.member.roles.add(role);
    if(price !== 0) await msg.member.takePoints(price);

    return msg.send(`Successfully bought the role **${role.name}** for **¥${price.toLocaleString()}**`);
  }

  async delete(msg, args) {
    if(!msg.member.permissions.has("MANAGE_GUILD"))
      return msg.send("Baka! You need the `Manage Server` permissions to delete roles from the store.");

    const rolename = args.join(" ").toLowerCase();
    if(!rolename) return msg.send(`Usage: \`${msg.guild.settings.prefix}store delete <role>\``);

    const role = msg.guild.roles.cache.find((r) => (r.id === rolename) || (r.name.toLowerCase() === rolename));

    if(!role) return msg.send("That role does not exist.");

    if(!this.client.settings.store.cache.has(role.id)) return msg.send("That role isn't on sale.");

    await this.client.settings.store.delete(role.id);
    return msg.send(`Successfully removed the role **${role.name}** from the store.`);
  }

  async add(msg, [price, ...args]) {
    // Check for permissions.
    if(!msg.member.permissions.has("MANAGE_GUILD"))
      return msg.send("Baka! You need the `Manage Server` permissions to add roles to the store.");

    if(!price) return msg.send(`Usage: \`${msg.guild.settings.prefix}store add <price> <rolename>`);
    price = this.verifyInt(price);

    // Always guard against abuse.
    if(price >= Number.MAX_SAFE_INTEGER) return msg.send("Baka! That price is too high.");

    // Verify the role.
    const rolename = args.join(" ").toLowerCase();
    if(!rolename) return msg.send(`Usage: \`${msg.guild.settings.prefix}store add <price> <rolename>\``);
    const role = msg.guild.roles.cache.find((r) => (r.id === rolename) || (r.name.toLowerCase() === rolename));
    if(!role) return msg.send("That role does not exist!");

    // Make sure we can add it.
    if(role.position >= msg.guild.me.roles.highest.position)
      return msg.send("I can't add that role to users. My role position must be higher than the role you are trying to sell.");

    // Make sure it's not already added.
    if(this.client.settings.store.cache.has(role.id)) return msg.send("That role is already on sale!");

    const roles = await this.client.settings.store.find({ guild: msg.guild.id }).toArray();

    if(roles.length >= 25) return msg.send("Too many roles for sale! Cannot sell more than 25. Remove some before trying again.");

    // Add it.
    await this.client.settings.store.update(role.id, { price, guild: msg.guild.id });
    return msg.send(`Success! **${role.name}** is now on sale for **¥${price.toLocaleString()}**`);
  }

  async view(msg) {
    // Fetch all roles for this server.
    const roles = await this.client.settings.store.find({ guild: msg.guild.id },
      { sort: { price: -1 } }).toArray();
    
    // Make sure there is something to view.
    if(!roles.length) return msg.send("There are no roles for sale in this server.");
    
    // Filter non-existent roles and create a view.
    const view = roles.filter((r) => msg.guild.roles.cache.has(r.id)).map((r) => {
      const role = msg.guild.roles.cache.get(r.id);
      const price = parseInt(r.price) === 0 ? "FREE" : `¥${parseInt(r.price).toLocaleString()}`;
      const has = msg.member.roles.cache.has(r.id);
      
      return `❯ ${role.name}${" ".repeat(20 - role.name.length)}:: ${price}${has ? " :: ✓" : ""}`;
    });
    
    // Show it.
    return msg.send(`= ${msg.guild.name} Store =\n= Roles for Sale =\n${view.join("\n")}`, { code: "asciidoc" });
  }
}

module.exports = Store;
