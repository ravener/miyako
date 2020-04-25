const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Wolfram extends Command {
  constructor(...args) {
    super(...args, {
      description: "Query Wolfram Alpha with any mathematical question.",
      usage: "wolfram <query>",
      aliases: ["what", "when", "where", "who", "why", "how"],
      cooldown: 5
    });
  }
  
  async run(ctx, args) {
    if(!args.length) return ctx.reply("What are you trying to ask?");
    
    // Allow users to trigger this in a fancy way using @Miyako What time is it?
    // If they invoke it with the "what"/"where"/"when"/"who"/"why" alias, we must also treat it as an argument.
    // A trick to make it look like some advanced A.I bot i guess.
    const query = ctx.invokedName === "what" || ctx.invokedName === "when" || ctx.invokedName === "how" ||
      ctx.invokedName === "where" || ctx.invokedName === "who" || ctx.invokedName === "why" ?
      `${this.client.utils.toProperCase(ctx.invokedName)} ${args.join(" ")}` : args.join(" ");

    const url = new URL("http://api.wolframalpha.com/v2/query");
    url.search = new URLSearchParams([
      ["input", query],
      ["primary", true],
      ["appid", this.client.config.wolfram],
      ["output", "json"]
    ]);
    
    const pods = await fetch(url)
      .then((res) => res.json())
      .then((body) => body.queryresult.pods);
    
    if(!pods || pods.error) return ctx.reply("Couldn't find an answer to that question!");

    return ctx.reply(new MessageEmbed()
      .setTitle(pods[0].subpods[0].plaintext)
      .setDescription(pods[1].subpods[0].plaintext.substring(0, 1950))
      .setColor(0x9590EE));
  }
}

module.exports = Wolfram;
