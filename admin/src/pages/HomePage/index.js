/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect } from "react";

import {
  Layout,
  Button,
  HeaderLayout,
  ContentLayout,
  EmptyStateLayout,
} from "@strapi/design-system";

import Plus from "@strapi/icons/Plus";
import Cross from "@strapi/icons/Cross";

import { io } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

import webshellRequests from "../../api/plugin";


import { makeRandom } from '../../utils/make-random'
import { theme, tabButtonStyles, tabsWrapperStyles } from "../../constants";

let socket = null

const HomePage = () => {
  const [shells, setShells] = useState([]);
  const [activeShell, setActiveShell] = useState(null);

  useEffect(async () => {
    if (socket) return

    const { serverUrl } = await webshellRequests.getConfig();

    socket = io(serverUrl, {
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("connected to socket server: " + socket.id);

      createShell();
    });
  }, [])

  useEffect(() => {
    shells.forEach((shell) => {
      if (!shell.activated) {
        shell.terminal.open(document.getElementById(shell.name));
        shell.fitAddon.fit();
        shell.terminal.focus();

        shell.activated = true;
      }
    });
  }, [shells]);

  function createShell() {
    const name = "shell_" + makeRandom(6);

    const fitAddon = new FitAddon();
    const terminal = new Terminal({
      theme,
      rows: 36,
      fontSize: 14,
    });

    terminal.loadAddon(fitAddon);

    const { rows, cols } = terminal.options;

    terminal.onResize((size) => {
      socket.emit(name + "-resize", [size.cols, size.rows]);
    });

    window.addEventListener("resize", () => {
      fitAddon.fit();
    });

    terminal.onData((data) => {
      socket.emit(name + "-input", data);
    });

    socket.on(name + "-output", (arrayBuffer) => {
      terminal.write(arrayBuffer);
    });

    socket.emit("create", { rows, cols, name, cwd: null });

    setShells([...shells, { name, terminal, fitAddon, activated: false }]);
    setActiveShell(name);
  }

  function onCloseShell(name) {
    const { terminal } = shells.find((item) => item.name === name);

    socket.emit(name + "-exit");
    terminal.dispose();

    const filteredShells = shells.filter((item) => item.name !== name);

    setShells(filteredShells);

    if (activeShell === name) {
      setActiveShell(filteredShells.length > 0 ? filteredShells[0].name : null);
    }
  }

  return (
    <Layout>
      <HeaderLayout
        primaryAction={
          <Button startIcon={<Plus />} onClick={createShell}>
            New shell
          </Button>
        }
        title="Web Shell"
        subtitle="A web shell for Strapi"
        as="h2"
      />

      <ContentLayout>
        <div style={tabsWrapperStyles}>
          {shells.map(({ name }, index) => (
            <div
              style={{
                borderBottomColor:
                  activeShell === name ? "#4945ff" : "transparent",
                ...tabButtonStyles,
              }}
              key={"tab_" + name}
            >
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setActiveShell(name)}
              >
                Shell {index + 1}
              </p>

              <Cross
                style={{ opacity: 0.5, cursor: "pointer" }}
                width="8"
                height="8"
                onClick={() => onCloseShell(name)}
              />
            </div>
          ))}
        </div>

        {shells.map(({ name }) => (
          <div
            key={name}
            id={name}
            style={activeShell !== name ? { display: "none" } : {}}
          />
        ))}

        {shells.length === 0 && (
          <EmptyStateLayout
            content="You don't have any web shell yet"
            action={
              <Button
                variant="secondary"
                startIcon={<Plus />}
                onClick={createShell}
              >
                Start a new shell
              </Button>
            }
          />
        )}
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
