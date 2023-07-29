import Base from './Base.js';

class Event extends Base {
  async _run(...args) {
    if (!this.enabled) return;

    try {
      await this.run(...args);
    } catch (err) {
      // Avoid recursion if error handler failed.
      if (this.name !== 'eventError') {
        this.client.emit('eventError', this, err);
      }
    }
  }

  /** @abstract */
  async run() {}
}

export default Event;
