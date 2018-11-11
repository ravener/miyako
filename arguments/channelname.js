const { Argument, util: { regExpEsc } } = require("klasa");
const { Channel, Message } = require("discord.js");
const { promptArgument } = require("../utils/utils.js");

const CHANNEL_REGEXP = Argument.regex.channel;

function resolveChannel(query, guild) {
  if (query instanceof Channel) return guild.channels.has(query.id) ? query : null;
  if (query instanceof Message) return query.guild.id === guild.id ? query.channel : null;
  if (typeof query === "string" && CHANNEL_REGEXP.test(query)) return guild.channels.get(CHANNEL_REGEXP.exec(query)[1]);
  return null;
}

class ChannelName extends Argument {

  async run(arg, possible, msg) {
    if (!msg.guild) return this.channel(arg, possible, msg);
    const resChannel = resolveChannel(arg, msg.guild);
    if (resChannel) return resChannel;
    if(!arg || !arg.length) throw `${possible.name} Must be a valid name, id or channel mention`;
    const results = [];
    const reg = new RegExp(regExpEsc(arg), "i");
    for (const channel of msg.guild.channels.values()) {
      if (reg.test(channel.name)) results.push(channel);
    }

    let querySearch;
    if (results.length > 0) {
      const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, "i");
      const filtered = results.filter(channel => regWord.test(channel.name));
      querySearch = filtered.length > 0 ? filtered : results;
    } else {
      querySearch = results;
    }

    switch (querySearch.length) {
      case 0: throw `${possible.name} Must be a valid name, id or channel mention`;
      case 1: return querySearch[0];
      default: return promptArgument(msg, querySearch.slice(0, 10));
    }
  }
}

module.exports = ChannelName;
