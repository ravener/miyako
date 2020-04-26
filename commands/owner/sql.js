const Command = require("../../structures/Command.js");

class SQL extends Command {
  constructor(...args) {
    super(...args, {
      description: "Run some SQL",
      ownerOnly: true,
      usage: "sql <query>",
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Input a SQL Query!");

    const db = this.client.db;
    try {
      const res = await db.query(args.join(" "));
      if(!res.rows || !res.rows.length) return ctx.reply(`\`${res.command}\` *No rows returned*`);
      let rows = res.rows;
      if(ctx.flags.index) rows = rows[parseInt(ctx.flags.index)];
      const output = JSON.stringify(rows, null, 2);
      if(output.length >= 1980) return ctx.reply(output, { code: true, split: "\n" });
    return ctx.reply(`Returned ${res.rows.length} row${res.rows.length > 1 ? "s" : ""} ${ctx.flags.index ? `(selected row ${parseInt(ctx.flags.index) + 1})` : ""}\n\`\`\`\n${output}\`\`\``);
    } catch(err) {
      return ctx.reply(err.message, { code: true });
    }
  }
}

module.exports = SQL;
