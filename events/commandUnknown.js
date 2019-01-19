const { Event } = require("klasa");
const levenshtein = require("fast-levenshtein");

class CommandUnknown extends Event {

  async run(msg, command, prefixLength) {
    const args = msg.content.slice(prefixLength).trim().split(/ +/g).slice(1);
    const res = await this.client.commands.get("tag")
      .get(msg, command.toLowerCase(), args)
      .catch(() => null);
    if(res) return; // Tag found.

    const distances = [];
    const usableCommands = await msg.usableCommands();
    for(const [cmd] of usableCommands)
      distances.push({
        dist: levenshtein.get(cmd, command),
        cmd
      });

    if(!distances.length) return;
    distances.sort((a, b) => a.dist - b.dist);
    if(distances[0].dist > 0 && distances[0].dist <= 2)
      return msg.send(`|\`❔\`| Did you mean \`${msg.guildSettings.prefix + distances[0].cmd}\`?`)
        .catch(() => null);
  }
}

module.exports = CommandUnknown;
