import { Readability } from "@mozilla/readability";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { SHOW_POPUP } from "./actions";

const Turndown = require("turndown").default;

const VAULT_NAME_KEY = "vaultName";
const NOTES_PATH_KEY = "notesPath";

const LABEL_STYLE: CSSProperties = {
  color: "#000",
  display: "block",
  fontSize: "1em",
};
const INPUT_STYLE: CSSProperties = {
  borderRadius: 6,
  border: "1px solid #aaa",
  boxSizing: "border-box",
  padding: "0.5em",
  fontSize: "1em",
  width: "100%",
};
const INPUT_CONTAINER_STYLE: CSSProperties = {
  marginBottom: "1em",
};
const BUTTON_STYLE: CSSProperties = {
  fontSize: "1em",
  padding: "0.7em",
  /* border-radius: 6px; */
  // /* border: 1px solid rgb(170, 170, 170); */
  border: "1px solid #D2D5DB",
  background: "#fafafa",
  color: "rgb(17 24 39)",
  borderRadius: 6,
  fontWeight: 600,
};

export const ObsidianDialog = () => {
  const [vaultName, setVaultName] = useState(
    localStorage.getItem(VAULT_NAME_KEY) || "Personal Vault"
  );
  const [notesPath, setNotesPath] = useState(
    localStorage.getItem(NOTES_PATH_KEY) || ""
  );
  const [isVisible, setIsVisible] = useState(false);
  const closePopup = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const createNote = useCallback(async () => {
    closePopup();
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone as any).parse();
    const markdown = new Turndown().turndown(article!.content);
    const notePath = notesPath.trim() + "/" + article!.title;
    const url = `obsidian://new?vault=${encodeURIComponent(
      vaultName.trim()
    )}&file=${encodeURIComponent(notePath)}&content=${encodeURIComponent(
      markdown
    )}`;
    window.open(url);
  }, [closePopup, vaultName, notesPath]);

  const showPopup = useCallback(
    (message: any) => {
      if (!message || !message.action || message.action !== SHOW_POPUP) return;
      setIsVisible(true);
    },
    [setIsVisible]
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(showPopup);
    return () => chrome.runtime.onMessage.removeListener(showPopup);
  }, [showPopup]);

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        position: "fixed",
        right: 20,
        top: 20,
        background: "#fff",
        borderColor: "#bbb",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
        boxShadow: "#aaa 0 0 10px",
        boxSizing: "border-box",
        height: 400,
        width: 400,
        padding: 10,
        zIndex: 999999999999999,
        fontSize: 16,
      }}
    >
      <form
        style={{
          display: "block",
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          await createNote();
        }}
      >
        <h1
          style={{
            color: "#000",
            display: "block",
            float: "none",
            fontFamily: "Arial",
            fontSize: "2em",
          }}
        >
          Save to Obsidian
        </h1>
        <p
          style={{
            color: "#000",
            display: "block",
            float: "none",
            fontFamily: "Arial",
            fontSize: "1em",
          }}
        >
          Please select where you'd like to save this page in Obsidian:
        </p>
        <div style={INPUT_CONTAINER_STYLE}>
          <label htmlFor="vault-name" style={LABEL_STYLE}>
            Vault name
          </label>
          <input
            id="vault-name"
            style={INPUT_STYLE}
            onChange={(e) => {
              const value = e.target.value;
              localStorage.setItem(VAULT_NAME_KEY, value);
              setVaultName(value);
            }}
            value={vaultName}
            type="text"
          />
        </div>

        <div style={INPUT_CONTAINER_STYLE}>
          <label htmlFor="notes-path" style={LABEL_STYLE}>
            Notes path
          </label>
          <input
            id="notes-path"
            style={INPUT_STYLE}
            onChange={(e) => {
              const value = e.target.value;
              localStorage.setItem(NOTES_PATH_KEY, value);
              setNotesPath(value);
            }}
            value={notesPath}
            type="text"
          />
        </div>

        <button
          onClick={closePopup}
          style={{
            ...BUTTON_STYLE,
            marginRight: "1em",
          }}
          type="button"
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            ...BUTTON_STYLE,
            background: "rgb(79 70 229)",
            color: "#fff",
            border: "0 none",
            boxShadow: "inset 0 1px 0 0 #fff3",
          }}
        >
          Save note
        </button>
      </form>
    </div>
  );
};
