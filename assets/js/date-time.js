const DAY_PERIOD_MORNING = "morning";
const DAY_PERIOD_AFTERNOON = "afternoon";
const DAY_PERIOD_EVENING = "evening";
const DAY_PERIOD_NIGHT = "night";
const MAX_IMAGE_COUNT = 20;

let currentDayPeriod;
let initialLocale;

let currentImageIndex = randomImageIndex(1, MAX_IMAGE_COUNT);

function initializeLocale() {
  initialLocale =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
}

function getCurrentTime() {
  const date = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  return date.toLocaleString(initialLocale, options);
}

function getCurrentDate() {
  const date = new Date();
  const options = {
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
  }
  return DAY_PERIOD_NIGHT;
}

function handleDayPeriodHasChanged() {
  const dayPeriod = document.getElementById("day-period");

  dayPeriod.textContent = currentDayPeriod;
  updateBackgroundImage();
}

function addDateTimeListener() {
  initializeLocale();

  const date = document.getElementById("date");
  const time = document.getElementById("time");

  const tick = () => {
    time.innerHTML = getCurrentTime();
    date.innerHTML = getCurrentDate();
    const formattedPeriod = getCurrentDayPeriod();
    if (currentDayPeriod != formattedPeriod) {
      currentDayPeriod = formattedPeriod;
      handleDayPeriodHasChanged();
    }
  };

  tick();
  setInterval(tick, 900);
}

function randomImageIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateBackgroundImage() {
  const body = document.getElementById("body");

  const prefix = currentImageIndex < 10 ? "0" : "";
  const imgUrl = `https://raw.githubusercontent.com/NikaKlokava/stage1-tasks/assets/images/${currentDayPeriod}/${prefix}${currentImageIndex}.jpg`;

  const img = new Image();
  img.src = imgUrl;

  img.onload = () => {
    body.style.backgroundImage = `url(${img.getAttribute("src")})`;
  };
}

function handlePrevArrowClick() {
  currentImageIndex =
    currentImageIndex == 1 ? MAX_IMAGE_COUNT : currentImageIndex - 1;

  updateBackgroundImage();
}

function handleNextArrowClick() {
  currentImageIndex =
    currentImageIndex === MAX_IMAGE_COUNT ? 1 : currentImageIndex + 1;

  updateBackgroundImage();
}

function addArrowHandlers() {
  const previousArrowEl = document.getElementById("previous-arrow");
  const nextArrowEl = document.getElementById("next-arrow");
  previousArrowEl.onclick = handlePrevArrowClick;
  nextArrowEl.onclick = handleNextArrowClick;
}

function onDOMContentLoaded() {
  addDateTimeListener();
  addArrowHandlers();
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
