
class AudioTrack {
  constructor(data = {}) {
    this.track = data.track;
    this.uri = data.info.uri;
    this.length = data.info.length;
    this.isStream = data.info.isStream;
    this.title = data.info.title;
    this.position = data.info.position;
    this.author = data.info.author;
    this.isSeekable = data.info.isSeekable;
    this.identifier = data.info.identifier;
  }

  get seekable() {
    return this.isSeekable;
  }

  get url() {
    return this.uri;
  }

  get stream() {
    return this.isStream;
  }

  get cleanTitle() {
    return this.title.replace(/@(everyone|here)/ig, "@\u200b$1");
  }
}

module.exports = AudioTrack;
