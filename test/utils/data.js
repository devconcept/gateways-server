module.exports.generateGateways = function generateGateways(amount = 1) {
  const result = [];
  for (let i = 0; i < amount; i += 1) {
    result.push({
      serial: `1234${i}`,
      name: 'bar',
      ipv4: '192.168.1.1',
      devices: [],
    });
  }
  return amount === 1 ? result[0] : result;
};

module.exports.generateDevices = function generateDevices(amount = 1) {
  const result = [];
  for (let i = 0; i < amount; i += 1) {
    result.push({
      uid: parseInt(`1234${i}`, 10),
      vendor: 'bar',
      created: new Date(),
      status: !!(i % 2),
    });
  }
  return amount === 1 ? result[0] : result;
};

module.exports.changeId = function changeId(objectId) {
  const char = objectId.slice(0, 1);
  const updated = (parseInt(char, 10) + 1).toString(10).slice(-1);
  return updated + objectId.slice(-23);
};
