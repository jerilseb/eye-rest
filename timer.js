// Create countdown of 20 sec
// Start counting down
// Once done, remove the window.
// Reset the Popup HTML counter to 20:00.

let timerElement = document.getElementById('timer');
let time = 15;

let setTime = function() {
  timerElement.innerHTML = time + ' sec';
  if (time === 0) {
    chrome.windows.getCurrent(win => {
        chrome.windows.remove(win.id);
    });
  }
  time--;
}

setTime();
let timerFunc = setInterval(setTime, 1000);