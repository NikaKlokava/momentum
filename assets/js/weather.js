const LOCAL_STORAGE_CITY_KEY = "current_user_city";
const API_KEY = "c1dc057239a59ed2b788017a79717d9e";
const DEFAULT_CITY = "Minsk";

function getCity() {
  const cityFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_CITY_KEY);
  if (cityFromLocalStorage) {
    return cityFromLocalStorage;
  } else {
    setCity(DEFAULT_CITY);
    return DEFAULT_CITY;
  }
}

function setCity(city) {
  localStorage.setItem(LOCAL_STORAGE_CITY_KEY, city);
}

async function loadWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=${API_KEY}&units=metric`;
  try {
    const promise = await fetch(url);
    const data = await promise.json();
    if (promise.ok) {
      onWeatherLoadSuccess(city, data);
    } else {
      onWeatherLoadFailed(city);
    }
  } catch {
    console.log("Error!!!");
  }
}

function onWeatherLoadSuccess(city, data) {
  const temperatureEl = document.getElementById("temp");
  const weatherDescripEl = document.getElementById("weather-description");
  const windEl = document.getElementById("wind");
  const humidityEl = document.getElementById("humidity");

  temperatureEl.innerHTML = Math.round(data.main.temp) + "°C";
  weatherDescripEl.innerHTML = data.weather[0].description;
  windEl.innerHTML = Math.round(data.wind.speed);
  humidityEl.innerHTML = data.main.humidity;
  setCity(city);
}

function onWeatherLoadFailed(city) {
  const elementsIfError = document.getElementsByClassName("error");
  for (let item of elementsIfError) {
    item.classList.add("no-visible");
  }
  const weatherErrorEl = document.getElementById("weather-error");
  weatherErrorEl.innerText = `Error! City not found for '${city}' !`;
  weatherErrorEl.classList.add("visible");
}

function handleCitySubmitted() {
  const cityInput = document.getElementById("weather-city");
  const valueOfCityInput = cityInput.value;
  loadWeather(valueOfCityInput);
}

function onDOMContentLoaded() {
  const city = getCity();
  // loadWeather(city);
  const cityInput = document.getElementById("weather-city");
  cityInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      handleCitySubmitted();
    }
  });
}
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

// async function onDOMContentLoaded() {
//   myPromise2()
//     .then((response) => response.json())
//     .then((res) => {})
//     .catch((err) => {});

//   try {
//     const res = await myPromise2();
//   } catch (err) {}

//   //   let url = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=en&appid=${API_KEY}&units=metric`;
//   const response = await fetch(
//     "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits"
//   );

//   const res = response.json();
//   res.then;

//   //   console.log(res)
// }

// document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

// async function randomNum (min, max) {
//     const random = Math.floor(Math.random() * (max - min + 1)) + min;
//     try {
//         if (random % 2 == 0) {
//           return "yes";
//         } else {
//           return "no";
//         }
//       } catch (err) {
//         throw err;
//       }
// }
// const result = randomNum(3, 15);
// const resultTotal = result.then((res) => {console.log(res)})
// console.log(resultTotal)

// const promis444 = new Promise((resolve, reject) => {
//   const random = Math.floor(Math.random() * (max - min + 1)) + min;
//   try {
//     if (random % 2 == 0) {
//       resolve("yes");
//     } else {
//       resolve("no");
//     }
//   } catch (err) {
//     reject(err);
//   }
// });

// promis444.then((res) => {
//   console.log(res);
// });

// function getPromise(min, max) {
//   return new Promise((resolve, reject) => {
//     const random = Math.floor(Math.random() * (max - min + 1)) + min;
//     try {
//       if (random % 2 == 0) {
//         resolve("yes");
//       } else {
//         resolve("no");
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// async function showResult() {
//   const result = await getPromise(1, 150);
//   console.log(result);
// }
// showResult();
