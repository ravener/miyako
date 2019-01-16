const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");

class Wolfram extends Command {
  constructor(...args) {
    super(...args, {
      description: "Query Wolfram Alpha with any mathematical question.",
      usage: "<query:str>"
    });
  }
  
  async run(msg, [query]) {
    const pods = await ladybug("http://api.wolframalpha.com/v2/query")
      .query({
        input: query,
        primary: true,
        appid: this.client.config.wolfram,
        output: "json"
      })
      .then((res) => res.body.queryresult.pods)
      .catch(() => {
        throw "There was an error. Please try again.";
      });
    
    if(!pods || pods.error) throw "Couldn't find an answer to that question!";
    return msg.sendMessage([
      `**Input Interpretation:** ${pods[0].subpods[0].plaintext}`,
      `**Result:** ${pods[1].subpods[0].plaintext.substring(0, 1500)}`
    ].join("\n"));
  }
}

module.exports = Wolfram;
