import Base from './Base.js';

class Event extends Base {
  raw?: boolean;

  async _run(...args: unknown[]) {
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
  async run(...args: unknown[]): Promise<any> {}
}

export default Event;
