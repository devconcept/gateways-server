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
        pattern: '^(?:([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
        description: 'must be a string and is required',
      },
      devices: {
        bsonType: 'array',
        description: 'must be a array of objects containing uid, vendor, created and status',
        maxItems: 10,
        items: {
          bsonType: 'object',
          required: ['uid', 'vendor', 'created', 'status'],
          properties: {
            uid: {
              bsonType: 'int',
              minimum: 1,
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
