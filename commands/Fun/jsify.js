const { Command } = require("klasa");
const jsify = require("../../utils/jsify.js");
class JSify extends Command {
  constructor(...args) {
    super(...args, {
      description: "JavaScriptify your message",
      extendedHelp: "Only JavaScript developers will get this ;)",
      usage: "<word:string>",
      aliases: ["javascriptify"]
    });
  }

  async run(msg, [word]) {
    return msg.send(jsify(word.replace(/@(everyone|here)/g, "@\u200b$1")));
  }
}

module.exports = JSify;
