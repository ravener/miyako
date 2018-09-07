const { Command, Stopwatch, Type, util } = require("klasa");
const { inspect } = require("util");
const superagent = require("superagent");

// This variable is more like for to be available in
// eval's scope so i can reach it easier.
// eslint-disable-next-line no-unused-vars
const utils = require("../../utils/utils.js");

class Eval extends Command {

  constructor(...args) {
    super(...args, {
      aliases: ["ev"],
      description: (language) => language.get("COMMAND_EVAL_DESCRIPTION"),
      extendedHelp: (language) => language.get("COMMAND_EVAL_EXTENDEDHELP"),
      guarded: true,
      permissionLevel: 10,
      usage: "<expression:code|expression:str>",
      quotedStringSupport: false // Don't want quotes annoying us when using strings
    });

    this.timeout = 30000;
  }

  async run(msg, [code]) {
    if(code.code) code = code.code;
    const flagTime = "no-timeout" in msg.flags ? "wait" in msg.flags ? Number(msg.flags.wait) : this.timeout : Infinity;
    const language = msg.flags.lang || msg.flags.language || (msg.flags.json ? "json" : "js");
    const { success, result, time, type } = await this.timedEval(msg, code, flagTime);

    if (msg.flags.silent) {
      if (!success && result && result.stack) this.client.emit("error", result.stack);
      return null;
    }
    
    if(msg.flags.delete && msg.deletable) await msg.delete();

    const footer = util.codeBlock("ts", type);
    const sendAs = msg.flags.output || msg.flags["output-to"] || (msg.flags.log ? "log" : null);
    return this.handleMessage(msg, { sendAs, hastebinUnavailable: false, url: null }, { success, result, time, footer, language });
  }

  async handleMessage(msg, options, { success, result, time, footer, language }) {
    switch (options.sendAs) {
      case "file": {
        if (msg.channel.attachable) return msg.channel.sendFile(Buffer.from(result), "output.txt", msg.language.get("COMMAND_EVAL_SENDFILE", time, footer));
        await this.getTypeOutput(msg, options);
        return this.handleMessage(msg, options, { success, result, time, footer, language });
      }
      case "haste":
      case "hastebin": {
        if (!options.url) options.url = await this.getHaste(result, language).catch(() => null);
        if (options.url) return msg.sendMessage(`Sent the result to hastebin: ${options.url}\n**Type**:${footer}\n${time}\n`);
        options.hastebinUnavailable = true;
        await this.getTypeOutput(msg, options);
        return this.handleMessage(msg, options, { success, result, time, footer, language });
      }
      case "console":
      case "log": {
        this.client.emit("log", result);
        return msg.sendMessage(msg.language.get("COMMAND_EVAL_SENDCONSOLE", time, footer));
      }
      case "none":
        return null;
      default: {
        if (result.length > 2000) {
          await this.getTypeOutput(msg, options);
          return this.handleMessage(msg, options, { success, result, time, footer, language });
        }
        return msg.sendMessage(msg.language.get(success ? "COMMAND_EVAL_OUTPUT" : "COMMAND_EVAL_ERROR",
          time, util.codeBlock(language, result), footer));
      }
    }
  }

  async getTypeOutput(msg, options) {
    const _options = ["log"];
    if (msg.channel.attachable) _options.push("file");
    if (!options.hastebinUnavailable) _options.push("hastebin");
    let _choice;
    do {
      _choice = await msg.prompt(`Choose one of the following options: ${_options.join(", ")}`).catch(() => ({ content: "none" }));
    } while (!["file", "haste", "hastebin", "console", "log", "default", "none", null].includes(_choice.content));
    options.sendAs = _choice.content;
  }

  timedEval(msg, code, flagTime) {
    if (flagTime === Infinity || flagTime === 0) return this.eval(msg, code);
    return Promise.race([
      util.sleep(flagTime).then(() => ({
        success: false,
        result: `TIMEOUT: Took longer than **${flagTime / 1000}** seconds.`,
        time: "⏱ ...",
        type: "EvalTimeoutError"
      })),
      this.eval(msg, code)
    ]);
  }

  // Eval the input
  async eval(msg, code) {
    const stopwatch = new Stopwatch();
    let success, syncTime, asyncTime, result;
    let thenable = false;
    let type;
    try {
      if (msg.flags.async) code = `(async () => {\n${code}\n})();`;
      result = eval(code);
      syncTime = stopwatch.toString();
      type = new Type(result);
      if (util.isThenable(result)) {
        thenable = true;
        stopwatch.restart();
        result = await result;
        asyncTime = stopwatch.toString();
      }
      success = true;
    } catch (error) {
      if (!syncTime) syncTime = stopwatch.toString();
      if (thenable && !asyncTime) asyncTime = stopwatch.toString();
      if (!type) type = new Type(error);
      result = error;
      success = false;
    }

    stopwatch.stop();
    if (typeof result !== "string") {
      result = result instanceof Error ? String(result) : msg.flags.json ? JSON.stringify(result, null, 4) : inspect(result, {
        depth: msg.flags.depth ? parseInt(msg.flags.depth) || 0 : 0,
        showHidden: Boolean(msg.flags.showHidden)
      });
    }
    return { success, type, time: this.formatTime(syncTime, asyncTime), result: util.clean(result) };
  }

  formatTime(syncTime, asyncTime) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
  }

  async getHaste(evalResult, language) {
    const key = await superagent.post("https://hastebin.com/documents")
      .send(evalResult)
      .then((res) => res.body.key);
    return `https://hastebin.com/${key}.${language}`;
  }
}

module.exports = Eval;
