const { Command, util: { codeBlock } } = require("klasa");

const actions = ["list", "exec", "delete", "add"];

class Snippets extends Command {
  constructor(...args) {
    super(...args, {
      description: "Store snippets of arguments for any command.",
      aliases: ["snippet", "s"],
      permissionLevel: 10,
      usage: "(action:action) (name:name) (args:args) [...]",
      usageDelim: " "
    });

    this
      .createCustomResolver("action", (arg, possible, msg) => {
        if(!arg) throw msg.language.get("COMMANDMESSAGE_NOMATCH", actions.join(", "));
        return arg;
      })
      .createCustomResolver("name", (arg, possible, msg, [action]) => {
        if(actions.includes(action) && action !== "list" && !arg) throw msg.language.get("COMMANDMESSAGE_MISSING_REQUIRED", "name");
        return arg;
      })
      .createCustomResolver("args", (arg, possible, msg, [action]) => {
        if(action !== "add") return;
        if(!arg) throw "Missing arguments for add.";
        return arg;
      });
  }

  async run(msg, [action, ...args]) {
    if(this[action]) return this[action](msg, args);
    return this.exec(msg, [action, ...args]);
  }

  async add(msg, [name, ...args]) {
    const command = this.store.get(args[0]);
    if(!command) throw "Invalid command.";
    if(this.client.settings.snippets.find((x) => x.name === name)) throw "A snippet with that name already exists!";
    await this.client.settings.update("snippets", {
      command: command.name,
      args: args.slice(1).join(" "),
      name: name
    });
    return msg.send(`Added a snippet for command \`${command.name}\` with name \`${name}\``);
  }

  list(msg) {
    return msg.send(codeBlock("", this.client.settings.snippets.map((sn) =>
      `• ${sn.name} -> ${sn.command}`
    ).join("\n")));
  }

  async delete(msg, [name]) {
    const sn = this.client.settings.snippets.find((x) => x.name === name.toLowerCase());
    if(!sn) throw "Snippet not found.";
    await this.client.settings.update("snippets", sn, { action: "remove" });
    return msg.send(`Deleted the snippet with name \`${name}\``);
  }

  async exec(msg, [name]) {
    const sn = this.client.settings.snippets.find((x) => x.name === name.toLowerCase());
    if(!sn) throw "Snippet not found.";
    const cmd = this.store.get(sn.command);
    return cmd.run(msg, cmd.args.split("|").map((x) => x.trim()));
}

module.exports = Snippets;
