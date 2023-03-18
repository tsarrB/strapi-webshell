"use strict";

module.exports = ({ strapi }) => ({
  async config() {
    const { serverUrl } = await strapi.config.get("plugin.webshell", {});

    return {
      serverUrl,
    }
  },
});
