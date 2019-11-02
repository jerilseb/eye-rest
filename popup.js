let counterElement = document.getElementById('counter');
let switchButton = document.getElementById('switch');
let switchClasses = switchButton.classList;
let countdownInterval;
let count;

let secToMin = function(timeInSec) {
  let sec = timeInSec%60;
  let min = (timeInSec-sec)/60;
  if (sec < 10) {
    sec = '0' + sec;
  }
  return min + ':' + sec;
}

// This will get the next alarm time from storage,
// calculate that time minus the current time,
// convert to seconds, then set the popup to that time.
let updateCountdown = function() {
  chrome.storage.local.get('nextAlarmTime', ({ nextAlarmTime }) => {
    // This sort of prevents the race condition by choosing between
    // 0 and the actual count. We basically want to prevent the popup
    // from ever displaying a negative number.
    count = Math.max(0, Math.ceil((nextAlarmTime - Date.now())/1000));
    counterElement.innerHTML = secToMin(count);
  });
};

// Check if isPaused. If not,
// Call the update countdown function immediately
// Then update the countdown every 0.1s
chrome.storage.local.get('isPaused', ({ isPaused }) => {
  if (!isPaused) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 100);
    setNotPausedDisplay();
  } else {
    chrome.storage.local.get('pausedCount', ({ pausedCount }) => {
      counterElement.innerHTML = secToMin(pausedCount);
    });
    setPausedDisplay();
  }
});

let setNotPausedDisplay = function() {
  switchClasses.add('is-not-paused');
  switchClasses.remove('is-paused');
  switchButton.innerHTML = 'Pause';
};

let setPausedDisplay = function() {
  switchClasses.add('is-paused');
  switchClasses.remove('is-not-paused');
  switchButton.innerHTML = 'Resume';
};

// If the switch is set on, continue counting down.
// If the switch is set to off, clear the existing alarm.
switchButton.addEventListener('click', event => {
  if (!switchClasses.contains('is-not-paused')) {
    // If isPaused = false, create the new alarm here.
    setNotPausedDisplay();
    chrome.storage.local.set({ isPaused: false });
    chrome.storage.local.get(['pausedCount','countdownMaxInMin'], ({ pausedCount, countdownMaxInMin }) => {
      clearAndCreateAlarm(pausedCount/60, countdownMaxInMin);
    });
    countdownInterval = setInterval(updateCountdown, 100);
  } else {
    // If isPaused = true, store the existing count to pass back to
    // background.js, clear the existing alarm by using the date
    // in storage.
    setPausedDisplay();
    chrome.storage.local.set({ isPaused: true, pausedCount: count });
    clearInterval(countdownInterval);
    clearAlarm();
  }
});