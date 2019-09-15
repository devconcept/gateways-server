module.exports.NormalizedError = class NormalizedError extends Error {
  constructor(message, code, original, { status, extra } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.original = original;
    this.stack = original.stack;
    if (status) {
      this.status = status;
    }
    if (extra) {
      this.extra = extra;
    }
  }
};
