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

function logStorageChange(changes, _) {
  if ('isBlocking' in changes) {
    const isBlocking = changes.isBlocking.newValue;

    if (isBlocking) {
      chrome.storage.local.get(['ignoreList']).then((result) => {
        if (!matchesRules(result.ignoreList, window.location.href)) {
          document.documentElement.innerHTML = '';
        }
      });
    }
  }

  if ('ignoreList' in changes) {
    const ignoreList = changes.ignoreList.newValue;

    chrome.storage.local.get(['isBlocking']).then((result) => {
      if (result.isBlocking) {
        if (!matchesRules(ignoreList, window.location.href)) {
          document.documentElement.innerHTML = '';
        }
      }
    });
  }
}

chrome.storage.onChanged.addListener(logStorageChange);

// Check whether blocking is on when the page loads

chrome.storage.local.get(['isBlocking']).then((result) => {
    if (result.isBlocking) {
      chrome.storage.local.get(['ignoreList']).then((result) => {
        
        console.log(matchesRules(result.ignoreList, window.location.href), result.ignoreList, window.location.href);

        if (!matchesRules(result.ignoreList, window.location.href)) {
          document.documentElement.innerHTML = '';
        }
      });
    }
  });