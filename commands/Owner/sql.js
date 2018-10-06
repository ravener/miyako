const { Command, Stopwatch, util: { codeBlock } } = require("klasa");

class SQL extends Command {
  constructor(...args) {
    super(...args, {
      description: "Run some SQL",
      permissionLevel: 10,
      usage: "<query:string>",
      quotedStringSupport: false
    });
  }

  async run(msg, [query]) {
    const db = this.client.providers.get("postgresql").db;
    const time = new Stopwatch();
    const res = await db.query(query).catch((err) => {
      throw codeBlock("", err.toString());
    });
    time.stop();
    if(!res.rows || !res.rows.length) return msg.send(`⏱ ${time} \`${res.command}\` *No rows returned*`);
    let rows = res.rows;
    if(msg.flags.index) rows = rows[parseInt(msg.flags.index)];
    const output = JSON.stringify(rows, null, 2);
    if(output.length >= 1980) return msg.channel.send(output, { code: true, split: "\n" });
    return msg.send(`⏱ ${time} returned ${res.rows.length} row${res.rows.length > 1 ? "s" : ""} ${msg.flags.index ? `(selected row ${parseInt(msg.flags.index) + 1})` : ""}\n${codeBlock("", output)}`);
  }
}
 
module.exports = SQL;
