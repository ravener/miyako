const { Argument, util: { regExpEsc } } = require("klasa");
const { promptArgument } = require("../utils/utils.js");

class GuildName extends Argument {
  
  run(arg, possible, msg) {
    const guild = this.constructor.regex.snowflake.test(arg) ? this.client.guilds.get(arg) : null;
    if (guild) return guild;
    if(!arg || !arg.length) throw `${possible.name} must be a valid guild name or id.`;
    const results = [];   
    const reg = new RegExp(regExpEsc(arg, "i"));
    
    for(const g of this.client.guilds.values()) {
      if(reg.test(g.name)) results.push(g);
    }
    
    let querySearch;
    if (results.length > 0) {
      const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, "i");
      const filtered = results.filter(guild => regWord.test(guild.name));
      querySearch = filtered.length > 0 ? filtered : results;
    } else {
      querySearch = results;
    }
    
    switch(querySearch.length) {
      case 0: throw `${possible.name} Must be a valid guild name or id.`;
      case 1: return querySearch[0];
      default: return promptArgument(msg, querySearch.slice(0, 10));
    }
  }
}

module.exports = GuildName;
