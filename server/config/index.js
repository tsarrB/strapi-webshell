'use strict';

module.exports = {
  default: {
    IOServerOptions: {}
  },
  validator(config) {
    if (typeof config.IOServerOptions !== 'object') {
      throw new Error('`IOServerOptions` must be an object and can`t be null.');
    }
  },
};
