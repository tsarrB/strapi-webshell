'use strict';

const config = require("./config");
const { Webshell_IO } = require("./webshell");

module.exports = async ({ strapi }) => {
  const { IOServerOptions } = await strapi.config.get(
    "plugin.webshell",
    config.default
  );

  console.log(IOServerOptions);

  strapi.$webshell_io = new Webshell_IO(strapi, IOServerOptions);
};
