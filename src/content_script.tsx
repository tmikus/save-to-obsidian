import React from "react";
import { createRoot } from "react-dom/client";
import { ObsidianDialog } from "./obsidian_dialog";

const containerNode = document.createElement("div");
document.body.appendChild(containerNode);
const shadowRoot = containerNode.attachShadow({ mode: "open" });
const rootNode = document.createElement("div");
shadowRoot.appendChild(rootNode);
const root = createRoot(rootNode, {});

loadCss();

root.render(
  <React.StrictMode>
    <ObsidianDialog />
  </React.StrictMode>
);

async function loadCss() {
  const styleUrl = chrome.runtime.getURL("style.css");
  const styleResponse = await fetch(styleUrl);
  const style = await styleResponse.text();
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(style);
  shadowRoot.adoptedStyleSheets.push(styleSheet);
}
