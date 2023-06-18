chrome.storage.onChanged.addListener((changes, _) => {
  // Get the end time, then set an alarm to turn off blocking later

  if ('isBlocking' in changes && changes.isBlocking.newValue == true) {
    chrome.storage.local.get(['endBlockTime']).then((result) => {
      const endBlockTime = result.endBlockTime;

      chrome.alarms.create('blockEnds', {
        when: endBlockTime
      });
    });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name == 'blockEnds') {
    chrome.storage.local.set({'isBlocking': false});
  }
})

// Inject content script into all tabs on install, since tabs open before install don't have content.js yet
chrome.runtime.onInstalled.addListener(() => {
  // Get all tabs, then inject content.js
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
      });
    }
  });
});