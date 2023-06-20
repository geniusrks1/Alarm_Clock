// defines several variables by selecting various elements from the HTML document
//  using document.querySelector() method. These variables represent different parts 
// of the alarm clock user interface.


const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");


// The dropDownMenu() function is a utility function that creates dropdown menus for 
// selecting hours, minutes, and seconds. It takes a start and end value, and an HTML 
// element as parameters, and generates <option> elements within that element.

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  
  dropDownMenu(1, 12, setHours);
 
  dropDownMenu(0, 59, setMinutes);

  dropDownMenu(0, 59, setSeconds);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button


setAlarmButton.addEventListener("click", getInput);


function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


// The getCurrentTime() function retrieves the current time using the Date object and
//  formats it as a localized string. The formatted time is then assigned to the currentTime
//   element's innerHTML property, which updates the displayed time on the web page.

function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}
// The getInput() function is an event handler for the "Set Alarm" button click. 
// It retrieves the selected values for hours, minutes, seconds, and AM/PM from the 
// corresponding dropdown menus. It then calls the convertToTime() function to convert
//  the selected values into a time format.

function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}


// Converting time to 24 hour format

// The convertToTime() function takes the selected values for hours, minutes, seconds,
//  and AM/PM and constructs a time string in the format of "HH:MM:SS AM/PM". 
//  The function returns the constructed time string.
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

let ringtone = new Audio("./ringtone.mp3");

// The setAlarm() function sets an alarm by creating an interval that continuously checks
// if the current time matches the provided alarm time. If there is a match, it plays a
//  ringtone, displays an alert, and stops the interval. The function also calls the 
//  addAlaramToDom() function to add the alarm to the HTML document.


function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      ringtone.play();
      alert("alarm time");
    }
    console.log("running");
  }, 500);

// The addAlaramToDom() function creates a new alarm element in the HTML document and 
// adds it to the alarmContainer. The alarm element contains the alarm time and a delete
// button. The delete button has an event listener attached to it, which calls the 
// deleteAlarm() function when clicked.

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?

// The checkAlarams() function checks if there are any previously saved alarms in the 
// local storage. If there are, it retrieves and returns them as an array.


function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
// The saveAlarm() function takes a time parameter and saves it to the local storage by 
// retrieving the existing alarms, adding the new alarm time to the array, and updating 
// the local storage.
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage

// The fetchAlarm() function retrieves the saved alarms from the local storage and sets 
// them using the setAlarm() function. This function is called when the web page is loaded
//  to populate any previously saved alarms.

function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// The deleteAlarm() function is called when the delete button of an alarm is clicked. 
// It clears the interval associated with the alarm, removes the alarm from the 
// HTML document, and calls deleteAlarmFromLocal() to remove the alarm from the local storage.


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

// the deleteAlarmFromLocal() function takes a time parameter and removes the corresponding 
// alarm from the local storage by retrieving the existing alarms, finding the index of
//  the specified time, removing it from the array, and updating the local storage


function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
