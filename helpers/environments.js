module.exports.isProduction = function isProduction() {
  return process.env.NODE_ENV === 'production';
};

module.exports.isDevelopment = function isDevelopment() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
};

module.exports.isTest = function isTest() {
  return process.env.NODE_ENV === 'test';
};
