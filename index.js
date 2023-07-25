const presentTime = document.querySelector("#present-time");
const set_Hours = document.querySelector("#hours");
const set_Minutes = document.querySelector("#minutes");
const set_Seconds = document.querySelector("#seconds");
const set_AmPm = document.querySelector("#am-pm");
const set_AlarmButton = document.querySelector("#subBtn");
const alarmHolder = document.querySelector("#alarms-holder");

// for time selection adding Hours, Minutes, Seconds in DropDown Menu 
window.addEventListener("DOMContentLoaded", (event) => {
  
  dropDownMenu(1, 12, set_Hours);
 
  dropDownMenu(0, 59, set_Minutes);

  dropDownMenu(0, 59, set_Seconds);

  setInterval(getPresentTime, 1000);
  fetchAlarm();
});

// Event Listener to set alarm
set_AlarmButton.addEventListener("click", getInput);


function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


function getPresentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  presentTime.innerHTML = time;

  return time;
}


function getInput(e) {
  e.preventDefault();
  const hourValue = set_Hours.value;
  const minuteValue = set_Minutes.value;
  const secondValue = set_Seconds.value;
  const amPmValue = set_AmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setRequiredAlarm(alarmTime);
}

// Converting time into 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}


function setRequiredAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getPresentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Display alrm set by user 
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "marg-btm", "dis-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="button delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmHolder.prepend(alarm);
}

// to check alarm is saved in local storage
function checkAlaram() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlaram();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlaram();

  alarms.forEach((time) => {
    setRequiredAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlaram();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}