const Command = require("../../structures/Command.js");

class LMGTFY extends Command {
  constructor(...args) {
    super(...args, {
      description: "Let me google it for you!",
      aliases: ["letmegoogleitforyou"],
      usage: "m!lmgtfy <query>"
    });

    // TODO: More!
    this.responses = [
      "Oh come on how hard is it to google that! But here you go: {{link}}",
      "Jeez! how lazy are you? Here you go anyway {{link}}",
      "Um, Why do you want me to google that? Here you go {{link}}"
    ];
  }

  async run(msg, query) {
    const url = `https://lmgtfy.com/?q=${query.join(" ").replace(/ /g, "+")}`;
    return msg.send(this.client.utils.random(this.responses).replace(/{{link}}/g, url));
  }
}

module.exports = LMGTFY;
