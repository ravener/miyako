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
      await this.client.settings.update(["psa.message", "psa.date"], [null, null]);
      return msg.send("Cleared psa.");
    }
    await this.client.settings.update(["psa.message", "psa.date"], [news, Date.now()]);
    return msg.send("Successfully set announcement.");
  }
  
  async init() {
    const { schema } = this.client.gateways.clientStorage;
    if(!schema.has("psa")) await schema.add("psa", {
      message: { type: "string" },
      date: { type: "integer" }
    });
  }
}

module.exports = PSA;