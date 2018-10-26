const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "pieces/:type/:name" });
  }

  get(request, response) {
    const { type, name } = request.params;
    const store = this.client.pieceStores.get(type);
    if (!store) return response.end("[]");
    if (name === "all") return response.end(JSON.stringify(store.array()));
    const piece = store.get(name);
    if (!piece) return response.end("{}");
    return response.end(JSON.stringify(piece));
  }

};
