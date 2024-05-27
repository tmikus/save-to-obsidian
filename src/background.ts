import {SHOW_POPUP} from "./actions";

const MENU_ID = "save-to-obsidian";

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  contexts: ["all"],
  id: MENU_ID,
  title: "Save to Obsidian",
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return
  await chrome.tabs.sendMessage(tab.id, {
    action: SHOW_POPUP
  })
})
