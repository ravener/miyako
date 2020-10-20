/**
 * This is a simple mock for the module dblapi.js
 * It covers the cases:
 * - Because we don't want to post stats in development mode.
 * - Because the bot is not in dbl.
 *
 * This is not a full mock but just enough for us.
 */

class DBLMock {
  async hasVoted() {
    return false;
  }

  async isWeekend() {
    return false;
  }

  async getVotes() {
    return [];
  }
}

module.exports = DBLMock;
