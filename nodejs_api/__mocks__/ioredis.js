// __mocks__/ioredis.js

const Redis = jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    set: jest.fn().mockResolvedValue("OK"),
    setex: jest.fn().mockResolvedValue("OK"),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    quit: jest.fn().mockResolvedValue("OK"),
    flushall: jest.fn().mockResolvedValue("OK"),
}));

module.exports = Redis;