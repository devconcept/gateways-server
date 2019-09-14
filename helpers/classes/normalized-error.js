module.exports.NormalizedError = class NormalizedError extends Error {
  constructor(message, code, original, extra) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.original = original;
    this.extra = extra;
    this.stack = original.stack;
  }
};
