// __mocks__/ws.js

// mock for ws package
class WebSocket {
    // mock implementations for WebSocket methods
    send = jest.fn();
    on = jest.fn();
    close = jest.fn();
  
    constructor(url) {
      console.log(`WebSocket connection created with URL: ${url}`);
    }
  }
  
  module.exports = WebSocket;
  module.exports.default = WebSocket;