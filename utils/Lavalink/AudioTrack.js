
class AudioTrack {
  constructor(data = {}) {
    this.track = data.track;
    this.uri = data.uri;
    this.length = data.length;
    this.isStream = data.isStream;
    this.title = data.title;
    this.position = data.position;
    this.author = data.author;
    this.isSeekable = data.isSeekable;
    this.identifier = data.identifier;
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
