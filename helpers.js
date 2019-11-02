let clearAndCreateAlarm = function(delayInMins, periodInMins) {
    let delayInMS = delayInMins * 60000;
    chrome.storage.local.get('date', data => {
      chrome.alarms.get('eyeRestAlarm' + data.date, alarm => {
        if (alarm) {
          chrome.alarms.clear('eyeRestAlarm' + data.date);
        }
        chrome.alarms.create('eyeRestAlarm' + data.date, {delayInMinutes: delayInMins, periodInMinutes: periodInMins});
        chrome.storage.local.set({nextAlarmTime: Date.now()+delayInMS});
      });
    });
  }
  
  let clearAlarm = function() {
    chrome.storage.local.get('date', function(data) {
      chrome.alarms.clear('eyeRestAlarm' + data.date);
    });
  }