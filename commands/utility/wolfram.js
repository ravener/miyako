const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Wolfram extends Command {
  constructor(...args) {
    super(...args, {
      description: "Query Wolfram Alpha with any mathematical question.",
      usage: "wolfram <query>",
      aliases: ["what"],
      cooldown: 5
    });
  }
  
  async run(ctx, args) {
    if(!args.length) return ctx.reply("What are you trying to ask?");
    
    // Allow users to trigger this in a fancy way using @Miyako What time is it?
    // If they invoke it with the "what" alias, we must also treat it as an argument.
    const query = ctx.invokedName === "what" ? `What ${args.join(" ")}` : args.join(" ");

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
