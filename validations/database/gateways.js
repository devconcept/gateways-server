module.exports = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['serial', 'name', 'ipv4'],
    properties: {
      serial: {
        bsonType: 'string',
        description: 'must be a string and is required',
      },
      name: {
        bsonType: 'string',
        description: 'must be a string and is required',
      },
      ipv4: {
        bsonType: 'string',
        description: 'must be a string and is required',
      },
      peripherals: {
        bsonType: 'array',
        description: 'must be a array of objects containing uid, vendor, created and status',
        items: {
          bsonType: 'object',
          required: ['uid', 'vendor', 'created', 'status'],
          properties: {
            uid: {
              bsonType: 'double',
              description: 'must be a number and is required',
            },
            vendor: {
              bsonType: 'string',
              description: 'must be a string and is required',
            },
            created: {
              bsonType: 'date',
              description: 'must be a date and is required',
            },
            status: {
              bsonType: 'bool',
              description: 'must be a boolean and is required',
            },
          },
        },
      },
    },
  },
};
