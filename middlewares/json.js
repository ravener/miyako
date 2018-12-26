const zlib = require("zlib");
const { Middleware } = require("klasa-dashboard-hooks");

module.exports = class extends Middleware {

  constructor(...args) {
    super(...args, { priority: 20 });
  }

  async run(request) {
    if (request.method !== "POST") return;

    const stream = this.contentStream(request);
    let body = "";

    for await (const chunk of stream) body += chunk;

    try {
      const data = JSON.parse(body);
      request.body = data;
    } catch (err) {
      request.body = {};
    }
  }

  contentStream(request) {
    const length = request.headers["content-length"];
    let stream;
    switch ((request.headers["content-encoding"] || "identity").toLowerCase()) {
      case "deflate":
        stream = zlib.createInflate();
        request.pipe(stream);
        break;
      case "gzip":
        stream = zlib.createGunzip();
        request.pipe(stream);
        break;
      case "identity":
        stream = request;
        stream.length = length;
        break;
    }
    return stream;
  }

};
