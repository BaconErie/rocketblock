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
  console.log(alarm);
  if (alarm.name == 'blockEnds') {
    console.log('this should work')
    chrome.storage.local.set({'isBlocking': false});
  }
})