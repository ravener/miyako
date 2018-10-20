const { Command, util: { codeBlock } } = require("klasa");

class Highlight extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manages word highlights",
      extendedHelp: "What highlights do is hold some words that if whenever it is mentioned in chat you will be DMed with the message information, making you never miss something.",
      usage: "<show|enable|disable|add|blacklist|remove> [args:string] [...]",
      usageDelim: " ",
      subcommands: true,
      runIn: ["text"],
      aliases: ["hl"]
    });
  }

  async enable(msg) {
    if(msg.member.settings.highlight.enabled) throw "Highlight is already enabled.";
    await msg.member.settings.update("highlight.enabled", true);
    return msg.send("Enabled highlight.");
  }

  async show(msg) {
    let counter = 1;
    const words = msg.member.settings.highlight.words.map((x) => `${counter++}. ${x}`);
    const status = msg.member.settings.highlight.enabled ? "Enabled" : "Disabled";
    const channels = msg.member.settings.highlight.blacklistedChannels.map((x) => {
      const channel = msg.guild.channels.get(x);
      if(!channel) return;
      return `#${channel.name} (${channel.id})`;
    }).filter((x) => x !== undefined);
    const users = msg.member.settings.highlight.blacklistedUsers.map((x) => {
      const user = msg.guild.members.get(x);
      if(!user) return;
      return `@${user.displayName} (${user.id})`;
    }).filter((x) => x !== undefined);
    if(!words.length) throw "You have no highlights to show.";
    return msg.send(`**Status**${codeBlock("", status)}\n${channels.length ? `**Blacklisted Channels**${codeBlock("", channels.join("\n"))}\n` : ""}${users.length ? `**Blacklisted Users**${codeBlock("", users.join("\n"))}\n` : ""}**Highlighted Words**\n${codeBlock("", words.join("\n"))}`);
  }

  async disable(msg) {
    if(!msg.member.settings.highlight.enabled) throw "Highlight is already disabled.";
    await msg.member.settings.update("highlight.enabled", false, msg.guild);
    return msg.send("Successfully disabled highlight.");
  }

  async add(msg, word) {
    if(!word.length) throw "Mention the word to add.";
    const premium = await msg.hasAtLeastPermissionLevel(2);
    const limit = premium ? 20 : 10;
    if(msg.member.settings.highlight.words.length >= limit) throw `You can only have up to ${limit} highlights at a time, remove some and try again. ${!premium ? `Premium users can have up to 20 highlights! to be a premium join our server and be active, use \`${msg.guild.settings.prefix}support\`` : ""}`;
    if(msg.member.settings.highlight.words.includes(word.join(" ").toLowerCase())) throw "That word is already in your list.";
    await msg.member.settings.update("highlight.words", word.join(" ").toLowerCase(), { action: "add" });
    return msg.send(`Added the word **${word.join(" ")}** in your highlight list.`);
  }

  async blacklist(msg) {
    if(!msg.mentions.channels.size && !msg.mentions.members.size) throw "You need to mention a channel or user to blacklist";
    if(msg.mentions.members.size) {
      const user = msg.mentions.members.first();
      await msg.member.settings.update("highlight.blacklistedUsers", user.id, msg.guild);
      if(msg.member.settings.highlight.blacklistedUsers.includes(user.id)) {
        return msg.send(`Added ${user.toString()} to your user blacklists, any highlighted mentions from this user won't notify you anymore`);
      }
      return msg.send(`Removed ${user.toString()} from your blacklists`);
    }
    const channel = msg.mentions.channels.first();
    await msg.member.settings.update("highlight.blacklistedChannels", channel.id, msg.guild);
    if(msg.member.settings.highlight.blacklistedChannels.includes(channel.id)) {
      return msg.send(`Added ${channel.toString()} to channel blacklists, highlighted words from this channel won't notify you anymore, to unblacklist call this command again in same channel`);
    }
    return msg.send(`Removed ${channel.toString()} from your blacklists.`);
  }

  async remove(msg, [...word]) {
    if(!word.length) throw "You must mention the word to remove.";
    const arr = msg.member.settings.highlight.words.find((x) => x === word.join(" ").toLowerCase());
    if(!arr) throw "That word isn't in your list";
    await msg.member.settings.update("highlight.words", arr, { action: "remove" });
    return msg.send("Removed that word from your highlight list");
  }
}

module.exports = Highlight;
