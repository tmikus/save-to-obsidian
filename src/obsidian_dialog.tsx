import { Readability } from "@mozilla/readability";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { SHOW_POPUP } from "./actions";

const Turndown = require("turndown").default;

const VAULT_NAME_KEY = "vaultName";
const NOTES_PATH_KEY = "notesPath";

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
    <div className="popup">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createNote();
        }}
      >
        <h1>Save to Obsidian</h1>
        <p>Please select where you'd like to save this page in Obsidian:</p>
        <div className="input-container">
          <label className="label" htmlFor="vault-name">
            Vault name
          </label>
          <input
            id="vault-name"
            className="input"
            onChange={(e) => {
              const value = e.target.value;
              localStorage.setItem(VAULT_NAME_KEY, value);
              setVaultName(value);
            }}
            value={vaultName}
            type="text"
          />
        </div>

        <div className="input-container">
          <label className="label" htmlFor="notes-path">
            Notes path
          </label>
          <input
            id="notes-path"
            className="input"
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
          className="button"
          style={{ marginRight: "1em" }}
          type="button"
        >
          Cancel
        </button>
        <button type="submit" className="button primary">
          Save note
        </button>
      </form>
    </div>
  );
};
