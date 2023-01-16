const DAY_PERIOD_MORNING = "morning";
const DAY_PERIOD_AFTERNOON = "afternoon";
const DAY_PERIOD_EVENING = "evening";
const DAY_PERIOD_NIGHT = "night";

let currentDayPeriod;
let initialLocale;

function initializeLocale() {
  initialLocale =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
}

function getCurrentTime() {
  let date = new Date();
  let options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return date.toLocaleString(initialLocale, options);
}

function getCurrentDate() {
  let date = new Date();
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleString(initialLocale, options);
}

function getCurrentDayPeriod() {
  const now = new Date();
  const currentHours = now.getHours();
  if (currentHours > 5 && currentHours <= 12) {
    return DAY_PERIOD_MORNING;
  }
  if (currentHours > 12 && currentHours <= 18) {
    return DAY_PERIOD_AFTERNOON;
  }
  if (currentHours > 18 && currentHours <= 22) {
    return DAY_PERIOD_EVENING;
  } else {
    return DAY_PERIOD_NIGHT;
  }
}

function handleDayPeriodHasChanged() {
  console.log(`Day period has changed! New day period is ${currentDayPeriod}!`);
}

function addDateTimeListener() {
  let formattedTime;
  let formattedDate;
  let formattedPeriod;

  initializeLocale();
  setInterval(() => {
    formattedTime = getCurrentTime();
    formattedDate = getCurrentDayPeriod();
    formattedPeriod = getCurrentDate();
    // console.log({formattedTime, formattedDate, formattedPeriod})
  }, 1000);

  if (currentDayPeriod != formattedPeriod) {
    currentDayPeriod = formattedPeriod;
    handleDayPeriodHasChanged();
  }
}

function onDOMContentLoaded() {
  addDateTimeListener();
  console.log(getCurrentTime());
  console.log(getCurrentDate());
  console.log(getCurrentDayPeriod());
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
