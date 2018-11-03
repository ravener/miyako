const { Argument, util: { regExpEsc } } = require("klasa");
const { GuildMember, User } = require("discord.js");
const { promptArgument } = require("../utils/utils.js");

const USER_REGEXP = Argument.regex.userOrMember;

function resolveUser(query, guild) {
  if (query instanceof GuildMember) return query.user;
  if (query instanceof User) return query;
  if (typeof query === "string") {
    if (USER_REGEXP.test(query)) return guild.client.users.fetch(USER_REGEXP.exec(query)[1]).catch(() => null);
    if (/\w{1,32}#\d{4}/.test(query)) {
      const res = guild.members.find(member => member.user.tag === query);
      return res ? res.user : null;
    }
  }
  return null;
}

class Username extends Argument {

  async run(arg, possible, msg) {
    if (!msg.guild) return this.user(arg, possible, msg);
    const resUser = await resolveUser(arg, msg.guild);
    if (resUser) return resUser;
    if(!arg || !arg.length) throw `${possible.name} Must be a valid name, id or user mention.`;
    const results = [];
    const reg = new RegExp(regExpEsc(arg), "i");
    for (const member of msg.guild.members.values()) {
      if (reg.test(member.user.username)) results.push(member.user);
    }

    let querySearch;
    if (results.length > 0) {
      const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, "i");
      const filtered = results.filter(user => regWord.test(user.username));
      querySearch = filtered.length > 0 ? filtered : results;
    } else {
      querySearch = results;
    }

    switch (querySearch.length) {
      case 0: throw `${possible.name} Must be a valid name, id or user mention`;
      case 1: return querySearch[0];
      default: return promptArgument(msg, querySearch.slice(0, 10), "tag");
    }
  }
}

module.exports = Username;
