const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "pieces/:type" });
  }

  get(request, response) {
    const { type } = request.params;
    const store = this.client.pieceStores.get(type);
    if (!store) return response.end("[]");
    return response.end(JSON.stringify(store.keyArray()));
  }

};
