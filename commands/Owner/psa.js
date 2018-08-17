const { Command } = require("klasa");

class PSA extends Command {
  constructor(...args) {
    super(...args, {
      description: "Posts a bot announcement.",
      permissionLevel: 10,
      usage: "<clear|message:string>",
      guarded: true
    });
  }
  
  async run(msg, [news]) {
    if(news === "clear") {
      await this.client.settings.update([
        ["psa.message", null],
        ["psa.date", null]
      ]);
      return msg.send("Cleared psa.");
    }
    await this.client.settings.update([
      ["psa.message", news],
      ["psa.date", Date.now()]
    ]);
    return msg.send("Successfully set announcement.");
  }
}

module.exports = PSA;
