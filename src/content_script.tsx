import React from "react";
import {createRoot} from "react-dom/client";
import {ObsidianDialog} from "./obsidian_dialog";

const containerNode = document.createElement("div");
document.body.appendChild(containerNode);
const shadowRoot = containerNode.attachShadow({ mode: 'open' });
const rootNode = document.createElement("div");
shadowRoot.appendChild(rootNode)
const root = createRoot(rootNode, {});

root.render(
    <React.StrictMode>
        <ObsidianDialog />
    </React.StrictMode>
);
