// Strapi
import { request } from "@strapi/helper-plugin";

const webshellRequests = {
  getConfig: async () => {
    return await request(`/webshell/config`, {
      method: "GET",
    });
  },
};

export default webshellRequests;
