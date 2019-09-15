module.exports.NotFoundError = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = 404;
    this.code = this.name;
  }
};
