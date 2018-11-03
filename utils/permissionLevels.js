const { PermissionLevels } = require("klasa");

const perms = new PermissionLevels()
  // User
  .add(0, () => true)
  // Beta testers
  .add(2, (client, msg) => {
    const guild = client.guilds.get(client.constants.mainGuild);
    if(!guild) return false;
    const member = guild.members.get(msg.author.id);
    if(!member) return false;
    return member.roles.has(client.constants.betaRole);
  }, { fetch: true, break: true })
  // Premium users
  .add(3, (client, msg) => {
    const guild = client.guilds.get(client.constants.mainGuild);
    if(!guild) return false;
    const member = guild.members.get(msg.author.id);
    if(!member) return false;
    return member.roles.has(client.constants.premiumRole);
  }, { fetch: true, break: true })
  // Mini mods
  .add(4, (client, message) => message.guild && message.member.permissions.has("MANAGE_MESSAGES"), { fetch: true })
  // Moderators
  .add(5, (client, message) => message.guild && (message.member.permissions.has("BAN_MEMBERS") && message.member.permissions.has("KICK_MEMBERS")), { fetch: true })
  // Server managers.
  .add(6, (client, message) => message.guild && message.member.permissions.has("MANAGE_GUILD"), { fetch: true })
  // Admins.
  .add(7, (client, message) => message.guild && message.member.permissions.has("ADMINISTRATOR"), { fetch: true })
  // Guild Owner.
  .add(8, (client, message) => message.guild && message.member === message.guild.owner, { fetch: true })
  // Bot Owner.
  .add(9, (client, message) => message.author === client.owner, { break: true })
  .add(10, (client, message) => message.author === client.owner);

module.exports = perms;
