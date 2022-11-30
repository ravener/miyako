const Command = require("../../structures/Command.js");
const { STATUS_CODES } = require("http");

class HttpStatus extends Command {
  constructor(...args) {
    super(...args, {
      description: "HTTP Status codes with Cats!",
      aliases: ["httpcat", "cathttp"],
      usage: "httpstatus <status>",
      options: [
        {
          name: "status",
          description: "HTTP Status Code",
          type: "integer",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const status = options.getInteger("status");

    // 599 is not in Node.js but it's on http.cat so let's handle it.
    if (status !== "599" && !STATUS_CODES[status]) {
      return ctx.reply("Baka! That's an invalid http status code.");
    }

    const embed = this.client.embed(ctx.author)
      .setTitle("HTTP Cat")
      .setImage(`https://http.cat/${status}.jpg`)
      .setDescription(status === "599" ? "Network Connect Timeout Error" : STATUS_CODES[status]);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = HttpStatus;
