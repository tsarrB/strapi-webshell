"use strict";

module.exports = [
  {
    method: "GET",
    path: "/config",
    handler: "plugin.config",
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
    },
  },
];
