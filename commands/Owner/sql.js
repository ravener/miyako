const { Command, Stopwatch, util: { codeBlock } } = require("klasa");
const { table } = require("table");

class SQL extends Command {
  constructor(...args) {
    super(...args, {
      description: "Run some SQL",
      permissionLevel: 10,
      usage: "<query:string>"
    });
    this.config = {
      border: {
        topBody: "─",
        topJoin: "┬",
        topLeft: "┌",
        topRight: "┐",
        bottomBody: "─",
        bottomJoin: "┴",
        bottomLeft: "└",
        bottomRight: "┘",
        bodyLeft: "│",
        bodyRight: "│",
        bodyJoin: "│",
        joinBody: "─",
        joinLeft: "├",
        joinRight: "┤",
        joinJoin: "┼"
      }
    };
  }

  async run(msg, [query]) {
    const db = this.client.providers.get("postgresql").db;
    const time = new Stopwatch();
    const res = await db.query(query).catch((err) => {
      throw codeBlock("", err.toString());
    });
    time.stop();
    if(!res.rows || !res.rows.length) return msg.send(`⏱ ${time} \`${res.command}\``);
    const rows = [
      [...Object.keys(res.rows[0])]
    ];
    for(const row of res.rows) {
      rows.push(...Object.values(row).map(String));
    }
    const output = table(rows, this.config);
    if(output.length >= 1980) return msg.channel.send(output, { code: true, split: "\n" });
    return msg.send(`⏱ {time} returned ${res.rows.length} rows\n${codeBlock("", output)}`);
  }
}
 
module.exports = SQL;