'use strict';

module.exports = exports = function(buffer) {
  // replaces entire buffer with zeros
  for (let i = 0; i < buffer.length; i++) {
    buffer.writeUInt8(0, i);
  }
};
