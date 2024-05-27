import { Readability } from "@mozilla/readability";
import React, {useCallback, useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {SHOW_POPUP} from "./actions";

const Turndown = require("turndown").default;

const Popup = () => {
    const [isVisible, setIsVisible] = useState(false)
    const closePopup = useCallback(() => {
       setIsVisible(false);
    }, [setIsVisible]);

    const createNote = useCallback(async () => {
        closePopup();
        const documentClone = document.cloneNode(true);
        const article = new Readability(documentClone as any).parse();
        const markdown = new Turndown().turndown(article!.content);
        const url = `obsidian://new?vault=Personal%20Vault&name=${encodeURIComponent(article!.title)}&content=${encodeURIComponent(markdown)}`;
        window.open(url);
    }, [closePopup]);

    const showPopup = useCallback((message: any) => {
        if (!message || !message.action || message.action !== SHOW_POPUP) return;
        setIsVisible(true);
    }, [setIsVisible]);

    useEffect(() => {
        chrome.runtime.onMessage.addListener(showPopup);
        return () => chrome.runtime.onMessage.removeListener(showPopup);
    }, [showPopup]);

    if (!isVisible) return null;

    return (
        <>
            <div className="relative"
                 aria-labelledby="modal-title"
                 role="dialog"
                 aria-modal="true"
                 style={{zIndex: 9999999999}}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900"
                                            id="modal-title">Save the page in Obsidian</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Here's a place for some content that
                                                I'll add at a later date.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                        onClick={createNote}
                                >
                                    Save
                                </button>
                                <button type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto"
                                        onClick={closePopup}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const rootNode = document.createElement("div");
document.body.append(rootNode);
const root = createRoot(rootNode);

root.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>
);
