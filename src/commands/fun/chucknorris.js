const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class ChuckNorris extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["chucknorrisjoke"],
      description: "Chuck Norris has some good jokes.",
      cooldown: 3,
      usage: "chucknorris [@user]"
    });
  }

  async run(msg, [user]) {
    if(user) user = await this.verifyUser(msg, user);

    const { value } = await fetch("http://api.chucknorris.io/jokes/random")
      .then((res) => res.json());

    return msg.send(user ? value.replace(/Chuck Norris/g, user.toString()) : value);
  }
}

module.exports = ChuckNorris;
