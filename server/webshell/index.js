const { Server } = require("socket.io");

const os = require("os");
const pty = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

class Webshell_IO {
  constructor(strapi, options) {
    this.io = new Server(strapi.server.httpServer, options);

    this.io.on("connection", (wsConnection) => {
      wsConnection.ptyContainers = {};

      wsConnection.on("create", (option) => this.create(wsConnection, option));
      wsConnection.on("disconnect", () => this.disconnect(wsConnection));
    });
  }

  create(socket, option = {}) {
    const ptyProcess = pty.spawn(shell, ["--login"], {
      name: "xterm-color",
      cols: option.cols || 80,
      rows: option.rows || 30,
      cwd: option.cwd || process.env.HOME,
      env: process.env,
    });

    ptyProcess.on("data", (data) => socket.emit(option.name + "-output", data));

    socket.on(option.name + "-input", (data) => ptyProcess.write(data));
    socket.on(option.name + "-resize", (size) => {
      ptyProcess.resize(size[0], size[1]);
    });

    socket.on(option.name + "-exit", () => {
      delete socket.ptyContainers[option.name];

      ptyProcess.destroy();
    });

    socket.emit(option.name + "-pid", ptyProcess.pid);

    socket.ptyContainers[option.name] = ptyProcess;
  }

  disconnect(socket) {
    Object.entries(socket.ptyContainers).forEach(([name, ptyProcess]) => {
      ptyProcess.destroy();
    });
  }
}

module.exports = {
  Webshell_IO,
}
