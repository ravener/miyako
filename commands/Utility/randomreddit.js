const { Command } = require("klasa");
const fetch = require("node-fetch");

class RandomReddit extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns a random reddit post on a given subreddit.",
      usage: "<subreddit:str>",
      aliases: ["rreddit"]
    });
    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(msg, [subreddit]) {
    const data = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`)
      .then(response => response.json())
      .then(body => {
        if (body.error) throw this.errorMessage;
        return body[0].data.children[0].data;
      })
      .catch(() => { throw this.errorMessage; });

    if (data.over_18 && !msg.channel.nsfw) {
      throw "I cant post a NSFW image in this channel unless you mark it as NSFW!";
    }

    return msg.send(`${data.title} ${data.url}`);
  }
}

module.exports = RandomReddit;
