const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "guilds/:guildID/roles/:roleID" });
  }

  get(request, response) {
    const { guildID, roleID } = request.params;
    const guild = this.client.guilds.get(guildID);
    if (!guild) return response.end("{}");
    const role = guild.roles.get(roleID);
    if (!role) return response.end("{}");
    return response.end(JSON.stringify(role));
  }

};
