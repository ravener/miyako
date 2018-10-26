const { Command } = require("klasa");

class Trigger extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manages word triggers for this server",
      permissionLevel: 6,
      aliases: ["triggers"],
      usage: "<view|add|remove|edit> (key:trigger) (value:trigger) [...]",
      usageDelim: " ",
      subcommands: true
    });

    this.createCustomResolver("trigger", (arg, possible, msg, [action]) => {
      if(action === "view") return undefined;
      if(action === "remove" && possible.name === "value") return undefined;
      return this.client.arguments.get("string").run(arg, possible, msg);
    });
  }

  async add(msg, [word, ...response]) {
    if(msg.guild.settings.triggers.find((x) => x.word === word)) throw "That word already exists.";
    await msg.guild.settings.update("triggers", { word, response: response.join(" ") }, { action: "add" });
    return msg.send(`Success, i will respond with **${response.join(" ")}** whenever someone mentions **${word}**`);
  }

  async view(msg) {
    if(!msg.guild.settings.triggers.length) throw "No triggers in this server.";
    return msg.sendCode("", msg.guild.settings.triggers.map((x) => `• ${x.word}`).join("\n"));
  }

  async remove(msg, [word]) {
    const obj = msg.guild.settings.triggers.find((x) => x.word === word);
    if(!obj) throw "That trigger doesn't exist";
    await msg.guild.settings.update("triggers", obj, { action: "remove" });
    return msg.send(`Deleted trigger **${word}**`);
  }

  async edit(msg, [word, ...response]) {
    const obj = msg.guild.settings.triggers.find((x) => x.word === "word");
    if(!obj) throw "That trigger doesn't exist.";
    await msg.guild.settings.update("triggers", obj, { action: "remove" });
    obj.response = response.join(" ");
    await msg.guild.settings.update("triggers", obj, { action: "add" });
    return msg.send(`Updated the response for **${word}** to **${response.join(" ")}**`);
  }
}

module.exports = Trigger;
