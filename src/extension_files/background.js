/*
When to check if tabs are distracting:
- On block start (check all tabs)
- When a tab's URL changes (check one tab)
- When a new tab is created (check one tab, also make sure to listen for URL changes)
*/

function matchWildcard(rule, input) {
  const ruleList = rule.split('*');

  let toProcess = input;

  for (const block of ruleList) {
    if (toProcess.includes(block)) {
      toProcess = toProcess.substring(toProcess.indexOf(block) + block.length - 1);
    } else {
      return false;
    }
  }

  return true;
}

function matchesRules(rules, href) {

  for (const rule of rules) {
    if (rule.includes('*') && matchWildcard(rule, href)) {
      return true;

    } else if ( (rule.includes('http://') || rule.includes('https://')) && rule == href) {
      return true;

    } else if (new URL(href).hostname == rule) {
      return true;
    }
  }

  return false;
}



chrome.storage.onChanged.addListener((changes, _) => {
  // Get the end time, then set an alarm to turn off blocking later

  if ('isBlocking' in changes && changes.isBlocking.newValue == true) {
    // Run on block start code

    chrome.storage.local.get(['endBlockTime']).then((result) => {
      const endBlockTime = result.endBlockTime;

      chrome.alarms.create('blockEnds', {
        when: endBlockTime
      });
    });

    
    // Loop through all tabs and check if any of them don't match whitelist
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        if (!matchesRules(tab.url)) {
          chrome.tab.update({tabId: tab.id, updateProperties: {url: 'about:blank'}});
        }
      }
    });

  }
});

chrome.alarms.onAlarm.addListener((alarm) => {

    if (alarm.name == 'blockEnds') {
      chrome.storage.local.set({'isBlocking': false});
    }

});


chrome.tabs.onUpdate.addListener((_, __, tab) => {

  chrome.storage.local.get(['isBlocking']).then((result) => {
    if (result.isBlocking && !matchesRules(tab.url)) {
      chrome.tab.update({tabId: tab.id, updateProperties: {url: 'about:blank'}});
    }
  })

});


chrome.tabs.onCreated.addListener((_, __, tab) => {

  chrome.storage.local.get(['isBlocking']).then((result) => {
    if (result.isBlocking && !matchesRules(tab.url)) {
      chrome.tab.update({tabId: tab.id, updateProperties: {url: 'about:blank'}});
    }
  })
  
});