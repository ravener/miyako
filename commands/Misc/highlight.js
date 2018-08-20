const { Command, util: { codeBlock } } = require("klasa");

class Highlight extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manages word highlights",
      extendedHelp: "What highlights do is hold some words that if whenever it is mentioned in chat you will be DMed with the message information, making you never miss something.",
      usage: "<show|enable|disable|add|blacklist|remove> [args:string] [...]",
      usageDelim: " ",
      subcommands: true,
      runIn: ["text"]
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
    if(!words.length) throw "You have no highlights to show.";
    return msg.send(`**Status**${codeBlock("", status)}\n${channels.length ? `**Blacklisted Channels**${codeBlock("", channels.join("\n"))}\n` : ""}**Highlighted Words**\n${codeBlock("", words.join("\n"))}`);
  }

  async disable(msg) {
    if(!msg.member.settings.highlight.enabled) throw "Highlight is already disabled.";
    await msg.memher.settings.update("highlight.enabled", false);
    return msg.send("Successfully disabled highlight.");
  }

  async add(msg, [...word]) {
    if(!word.length) throw "Mention the word to add.";
    if(msg.member.settings.highlight.words.length >= 10) throw "You can only have upto 10 highlights at a time, remove some and try again.";
    if(msg.member.settings.highlight.words.includes(word.join(" ").toLowerCase())) throw "That word is already in your list.";
    await msg.member.settings.update("highlight.words", word.join(" ").toLowerCase(), { action: "add" });
    return msg.send(`Added the word **${word.join(" ")}** in your highlight list.`);
  }

  async blacklist(msg) {
    if(!msg.mentions.channels.size) throw "You need to mention a channel to blacklist";
    const channel = msg.mentions.channels.first();
    await msg.member.settings.update("highlight.blacklistedChannels", channel.id);
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
  }
}

module.exports = Highlight;
