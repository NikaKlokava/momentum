const LOCAL_STORAGE_CITY_KEY = "current_user_city";
const API_KEY = "";

function getCity() {}

function setCity(city) {}

async function loadWeather(city) {}

function onWeatherLoadSuccess(city, data) {
  // пока не будем реализовать
  console.log("onWeatherLoadFailed", { data });
}

function onWeatherLoadFailed(city) {
  // пока не будем реализовать
  console.log("onWeatherLoadFailed", { city });
}

function handleCitySubmitted() {
  // пока не будем реализовать
  console.log("handleCitySubmitted");
}

function onDOMContentLoaded() {
  
}
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
