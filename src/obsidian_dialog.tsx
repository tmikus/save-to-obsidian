import { Readability } from "@mozilla/readability";
import React, { useCallback, useEffect, useState } from "react";
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

  if (!isVisible) return null;

  return (
    <div
      id="dialog"
      className="relative"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      style={{
        fontFamily: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ].join(","),
        zIndex: 999999999999999,
      }}
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={closePopup}
      ></div>

      <form
        className="fixed inset-0 z-10 w-screen overflow-y-auto"
        onSubmit={async (e) => {
          e.preventDefault();
          await createNote();
        }}
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Save to Obsidian
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please enter the details of your Obsidian vault and where
                      you'd like the new note to be saved.
                    </p>
                    <div className="mt-2">
                      <label
                        htmlFor="vault-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Vault name
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          type="text"
                          id="vault-name"
                          className="block w-full rounded-md border-0 py-1.5 pl-2.5 pr-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Name of your vault"
                          value={vaultName}
                          onChange={(e) => {
                            const value = e.target.value;
                            localStorage.setItem(VAULT_NAME_KEY, value);
                            setVaultName(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="notes-path"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Notes path
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          type="text"
                          id="notes-path"
                          className="block w-full rounded-md border-0 py-1.5 pl-2.5 pr-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Full path to where you want to store notes"
                          value={notesPath}
                          onChange={(e) => {
                            const value = e.target.value;
                            localStorage.setItem(NOTES_PATH_KEY, value);
                            setNotesPath(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              >
                Save Note
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={closePopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
  // return (
  //   <div className="popup">
  //     <form
  //       onSubmit={async (e) => {
  //         e.preventDefault();
  //         await createNote();
  //       }}
  //     >
  //       <h1>Save to Obsidian</h1>
  //       <p>Please select where you'd like to save this page in Obsidian:</p>
  //       <div className="input-container">
  //         <label className="label" htmlFor="vault-name">
  //           Vault name
  //         </label>
  //         <input
  //           id="vault-name"
  //           className="input"
  //           onChange={(e) => {
  //             const value = e.target.value;
  //             localStorage.setItem(VAULT_NAME_KEY, value);
  //             setVaultName(value);
  //           }}
  //           value={vaultName}
  //           type="text"
  //         />
  //       </div>
  //
  //       <div className="input-container">
  //         <label className="label" htmlFor="notes-path">
  //           Notes path
  //         </label>
  //         <input
  //           id="notes-path"
  //           className="input"
  //           onChange={(e) => {
  //             const value = e.target.value;
  //             localStorage.setItem(NOTES_PATH_KEY, value);
  //             setNotesPath(value);
  //           }}
  //           value={notesPath}
  //           type="text"
  //         />
  //       </div>
  //
  //       <button
  //         onClick={closePopup}
  //         className="button"
  //         style={{ marginRight: "1em" }}
  //         type="button"
  //       >
  //         Cancel
  //       </button>
  //       <button type="submit" className="button primary">
  //         Save note
  //       </button>
  //     </form>
  //   </div>
  // );
};
