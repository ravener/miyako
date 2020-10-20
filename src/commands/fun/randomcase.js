const Command = require("../../structures/Command.js");

class RandomCase extends Command {
  constructor(...args) {
    super(...args, {
      description: "Random case a message.",
      usage: "randomcase <text>",
      aliases: ["rcase"]
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! You didn't give me any input.");

    return msg.send(args.join(" ").replace(/\w/g, (ch) => {
      const fn = this.client.utils.random([ch.toUpperCase, ch.toLowerCase]);
      return fn.apply(ch);
    }));
  }
}

module.exports = RandomCase;
