let audio; // store audio object for using it in several funcs
let tracks = [];
let currentIndex = 0; // used for saving current track which is loaded OR should be loaded
let isPaused = true; // current audio playing state
const volumeRangeInputEl = document.querySelector(".volume-progress");

async function loadTrackList() {
  const url =
    "https://raw.githubusercontent.com/NikaKlokava/momentum-audio/main/index.json";
  try {
    const promise = await fetch(url);
    const data = await promise.json();
    if (promise.ok) {
      onTracksLoadSuccess(data);
    } else {
      onTracksLoadFailed();
    }
  } catch (err) {
    console.log("Error!!!", err);
  }
}

function onTracksLoadSuccess(data) {
  const trackList = document.getElementById("player-tracks");
  tracks = data;

  for (let i = 0; i < tracks.length; i++) {
    const tagP = document.createElement("p");
    tagP.className = "track-item";
    tagP.innerHTML = tracks[i].title;
    tagP.onclick = () => {
      handleTrackInPlaylistPress(i);
    };
    trackList.append(tagP);
  }

  loadTrack();
}

function onTracksLoadFailed(err) {
  console.error("onTracksLoadFailed"); //  to do
}

function loadTrack() {
  const src = tracks[currentIndex].src;
  const url = `https://raw.githubusercontent.com/NikaKlokava/momentum-audio/main/${src}`;
  // to fix ussue with dooble audio playing
  if (!isPaused) {
    pauseTrack();
  }

  audio = new Audio(url);
  changeVolumeLevel();

  const trackTimeDuration = document.getElementById("current-time");
  setTimeout(() => {
    const duration = Math.round(audio.duration);
    if (duration < 60) {
      trackTimeDuration.innerHTML = `0:${duration}`;
    } else {
      trackTimeDuration.innerHTML = `1:${duration - 60}`;
    }
  }, 500);

  const inputRangeElem = document.querySelector(".track-progress-duration");
  audio.addEventListener("timeupdate", (event) => {
    const duration = Math.round(audio.duration);
    let time = Math.floor(event.timeStamp / 1000);
    if (!isPaused) {
      getCurrentTimeDuration(time);
      inputRangeElem.style.width = `${(time * 100) / duration}%`;
    } else {
      console.log("here");
    }
  });
}

function changeVolumeLevel() {
  const volumeRangeInputEl = document.querySelector(".volume-progress");
  audio.volume = 0.5;
  volumeRangeInputEl.value = audio.volume;

  volumeRangeInputEl.addEventListener("input", () => {
    let volumeValue = volumeRangeInputEl.value;
    audio.volume = volumeValue;
  });
}

function handleVolumeNoIconPress() {
  const volumeRangeInputEl = document.querySelector(".volume-progress");
  audio.volume = 0;
  volumeRangeInputEl.value = audio.volume;
}

function handleVolumeYesIconPress() {
  const volumeRangeInputEl = document.querySelector(".volume-progress");
  audio.volume = 1;
  volumeRangeInputEl.value = audio.volume;
}

function getCurrentTimeDuration(time) {
  const timeOfTrackNow = document.getElementById("start-time");
  time =
    time < 10
      ? (timeOfTrackNow.innerHTML = `0:0${time}`)
      : time < 60
      ? (timeOfTrackNow.innerHTML = `0:${time}`)
      : time >= 60 && time < 70
      ? (timeOfTrackNow.innerHTML = `1:0${time - 60}`)
      : (timeOfTrackNow.innerHTML = `1:${time - 60}`);
}

function startTrack() {
  audio.play();
  isPaused = false;

  const currentTrackName = document.getElementById("current-track");
  const currentTitle = tracks[currentIndex].title;
  currentTrackName.innerHTML = currentTitle;

  const iconPlayPause = document.getElementById("play");
  iconPlayPause.classList.add("active");
}

function pauseTrack() {
  audio.pause();
  isPaused = true;

  const iconPlayPause = document.getElementById("play");
  iconPlayPause.classList.remove("active");
}

function handlePlayPausePress() {
  if (isPaused) {
    startTrack();
  } else {
    pauseTrack();
  }
}

function handleTrackInPlaylistPress(index) {
  const isCurrentTrackNotLoaded = currentIndex !== index;
  if (isCurrentTrackNotLoaded) {
    // if it is other track
    currentIndex = index;
    loadTrack();
    startTrack();
  } else if (isPaused) {
    startTrack();
  } else {
    pauseTrack();
  }
}

function handlePrevPress() {
  const isFirstTrackLoaded = currentIndex === 0;
  currentIndex = isFirstTrackLoaded ? tracks.length - 1 : currentIndex - 1;
  loadTrack();
  startTrack();
}

function handleNextPress() {
  const isLastTrackLoaded = currentIndex == tracks.length - 1;
  currentIndex = isLastTrackLoaded ? 0 : currentIndex + 1;
  loadTrack();
  startTrack();
}

function onDOMContentLoaded() {
  loadTrackList();

  const iconPlayPause = document.getElementById("play");
  iconPlayPause.onclick = handlePlayPausePress;

  const prevButtonEl = document.getElementById("previous-button");
  prevButtonEl.onclick = handlePrevPress;

  const nextButtonEl = document.getElementById("next-button");
  nextButtonEl.onclick = handleNextPress;

  const volumeNoIconEl = document.querySelector(".volume-ico1");
  volumeNoIconEl.onclick = handleVolumeNoIconPress;

  const volumeYesIconEl = document.querySelector(".volume-ico2");
  volumeYesIconEl.onclick = handleVolumeYesIconPress;
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
