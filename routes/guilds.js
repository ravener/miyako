const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "guilds" });
  }

  get(request, response) {
    return response.end(JSON.stringify(this.client.guilds.keyArray()));
  }

};
