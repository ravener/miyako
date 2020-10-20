const Command = require("../../structures/Command.js");

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
  
  async run(msg, args) {
    if(!args.length) return msg.send("What are you trying to ask?");
    
    // Allow users to trigger this in a fancy way using @Miyako What time is it?
    // If they invoke it with the "what"/"where"/"when"/"who"/"why" alias, we must also treat it as an argument.
    // A trick to make it look like some advanced A.I bot i guess.
    const query = msg.alias === "what" || msg.alias === "when" || msg.alias === "how" ||
      msg.alias === "where" || msg.alias === "who" || msg.alias === "why" ?
      `${this.client.utils.toProperCase(msg.alias)} ${args.join(" ")}` : args.join(" ");

    const url = new URL("http://api.wolframalpha.com/v2/query");
    url.search = new URLSearchParams([
      ["input", query],
      ["primary", true],
      ["appid", process.env.WOLFRAM],
      ["output", "json"]
    ]);
    
    const pods = await fetch(url)
      .then((res) => res.json())
      .then((body) => body.queryresult.pods);
    
    if(!pods || pods.error) return msg.send("Couldn't find an answer to that question!");

    return msg.send(this.client.embed()
      .setTitle(pods[0].subpods[0].plaintext)
      .setDescription(pods[1].subpods[0].plaintext.substring(0, 1950)));
  }
}

module.exports = Wolfram;
