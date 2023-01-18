const DAY_PERIOD_MORNING = "morning";
const DAY_PERIOD_AFTERNOON = "afternoon";
const DAY_PERIOD_EVENING = "evening";
const DAY_PERIOD_NIGHT = "night";

let currentDayPeriod;
let initialLocale;

let currentImageIndex = 1;
const maxImageCount = 20;

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
    return (currentDayPeriod = DAY_PERIOD_MORNING);
  }
  if (currentHours > 12 && currentHours <= 18) {
    return (currentDayPeriod = DAY_PERIOD_AFTERNOON);
  }
  if (currentHours > 18 && currentHours <= 22) {
    return (currentDayPeriod = DAY_PERIOD_EVENING);
  }
  return (currentDayPeriod = DAY_PERIOD_NIGHT);
}

function handleDayPeriodHasChanged() {
  currentImageIndex = 1;
  updateBackgroundImage();
  const dayPeriod = document.getElementById("day-period");
  dayPeriod.textContent = DAY_PERIOD_NIGHT;
}

function addDateTimeListener() {
  initializeLocale();
  setInterval(() => {
    getCurrentTime();
    getCurrentDate();
    const formattedPeriod = getCurrentDayPeriod();

    if (currentDayPeriod != formattedPeriod) {
      currentDayPeriod = formattedPeriod;
      handleDayPeriodHasChanged();
    }
  }, 500);
}

function randomImageIndex(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
  if (randomValue >= 1 && randomValue < 10) {
    return (currentImageIndex = "0" + randomValue);
  }
  return (currentImageIndex = randomValue);
}

function updateBackgroundImage() {
  const body = document.getElementById("body");
  const imgUrl = `https://raw.githubusercontent.com/NikaKlokava/stage1-tasks/assets/images/${currentDayPeriod}/${currentImageIndex}.jpg`;
  const img = new Image();
  img.src = imgUrl;
  let imageAttrLink = img.getAttribute("src");
  img.onload = () => {
    body.style.backgroundImage = `url(${imageAttrLink})`;
  };

  // (async function () {
  //   let blob = await fetch(imgUrl).then((r) => r.blob());
  //   let dataUrl = await new Promise((resolve) => {
  //     let reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.readAsDataURL(blob);
  //   });
  //   body.style.backgroundImage = `url(${dataUrl})`
  // })();
}

function handlePrevArrowClick() {
  if (currentImageIndex == 1) {
    currentImageIndex = maxImageCount;
  } else if (currentImageIndex >= 2) {
    currentImageIndex--;
  }
  currentImageIndex =
    currentImageIndex >= 1 && currentImageIndex < 10
      ? "0" + currentImageIndex
      : currentImageIndex;

  updateBackgroundImage();
}

function handleNextArrowClick() {
  if (currentImageIndex === maxImageCount) {
    currentImageIndex = 1;
  } else if (currentImageIndex >= 1) {
    currentImageIndex++;
  }

  currentImageIndex =
    currentImageIndex >= 1 && currentImageIndex < 10
      ? "0" + currentImageIndex
      : currentImageIndex;

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
  getCurrentDayPeriod();
  randomImageIndex(currentImageIndex, maxImageCount);
  updateBackgroundImage();
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
