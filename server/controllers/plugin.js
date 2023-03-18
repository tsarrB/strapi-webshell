"use strict";

module.exports = {
  async config(ctx) {
    return await strapi.plugin("webshell").service("plugin").config();
  },
};
