const Command = require("../../structures/Command.js");

const { STATUS_CODES } = require("http");

class HttpStatus extends Command {
  constructor(...args) {
    super(...args, {
      description: "HTTP Status codes with Cats!",
      aliases: ["httpcat", "cathttp"],
      usage: "httpstatus <status>"
    });
  }

  async run(msg, [status]) {
    // 599 isn't standard i think, not in Node.js but it's on http.cat so let's handle it.
    if(status !== "599" && !STATUS_CODES[status]) return msg.send("Baka! That's an invalid http status code.");
    return msg.send(this.client.embed()
      .setTitle("HTTP Cat")
      .setImage(`https://http.cat/${status}.jpg`)
      .setDescription(status === "599" ? "Network Connect Timeout Error" : STATUS_CODES[status])
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 })));
  }
}

module.exports = HttpStatus;
