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
