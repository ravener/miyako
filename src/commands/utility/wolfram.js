const Command = require("../../structures/Command.js");
const { request } = require("undici");
const { toProperCase } = require("../../utils/utils.js");

class Wolfram extends Command {
  constructor(...args) {
    super(...args, {
      description: "Query Wolfram Alpha with any mathematical question.",
      usage: "wolfram <query>",
      aliases: ["what", "when", "where", "who", "why", "how", "define"],
      cooldown: 5,
      options: [
        {
          name: "query",
          description: "The query to ask wolfram about.",
          type: "string",
          required: true
        }
      ]
    });
  }
  
  async run(ctx, options) {
    // Allow users to trigger this in a fancy way using @Miyako What time is it?
    // If they invoke it with the "what"/"where"/"when"/"who"/"why" alias, we must also treat it as an argument.
    // A trick to make it look like some advanced A.I bot I guess.
    const query = this.aliases.includes(ctx.alias) ? `${toProperCase(ctx.alias)} ${options.getString("query")}` : options.getString("query");

    const url = new URL("http://api.wolframalpha.com/v2/query");
    url.search = new URLSearchParams([
      ["input", query],
      ["primary", true],
      ["appid", process.env.WOLFRAM],
      ["output", "json"]
    ]);
    
    const pods = await request(url)
      .then(({ body }) => body.json())
      .then((body) => body.queryresult.pods);
    
    if (!pods || pods.error) return ctx.reply("Couldn't find an answer to that question!");
    const description = pods[1].subpods[0].plaintext.substring(0, 1980);

    const embed = this.client.embed()
      .setTitle(pods[0].subpods[0].plaintext);

    if (description) embed.setDescription(description);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Wolfram;
