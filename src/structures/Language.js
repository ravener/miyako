
/**
 * Represents a language for translation.
 */
class Language {
  constructor(name, display, keys = {}, defaultLanguage = null) {
    this.name = name;
    this.display = display;
    this.keys = keys;
    this.defaultLanguage = defaultLanguage;
  }

  get(key, ...args) {
    const value = this.keys[key] || (this.defaultLanguage && this.defaultLanguage.keys[key]);
    if (!value) return `Requested an untranslated key \`${key}\``;
    if (typeof value === "function") return value(...args);
    return value;
  }
}

module.exports = Language;
