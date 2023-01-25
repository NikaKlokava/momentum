let audio; // store audio object for using it in several funcs
let tracks = [];
let currentIndex = 0; // used for saving current track which is loaded OR should be loaded
let isPaused = true; // current audio playing state

const DEFAULT_VOLUME = 1;

const PLAY_ICON_URL = "../svg/play.svg";
const PAUSE_ICON_URL = "../svg/pause.svg";

async function loadTrackList() {
  const url =
    "https://raw.githubusercontent.com/NikaKlokava/momentum-audio/main/index.json";
  try {
    const promise = await fetch(url);
    if (promise.ok) {
      const data = await promise.json();
      onTracksLoadSuccess(data);
    } else {
      onTracksLoadFailed();
    }
  } catch (err) {
    onTracksLoadFailed(err);
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

function onTracksLoadFailed() {
  console.error("onTracksLoadFailed");
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds - mins * 60 || 0;
  const zero = (value) => (value < 10 ? "0" : "");
  return `${zero(mins)}${mins}:${zero(secs)}${secs}`;
}

function loadTrack() {
  const src = tracks[currentIndex].src;
  const url = `https://raw.githubusercontent.com/NikaKlokava/momentum-audio/main/${src}`;
  // to fix ussue with dooble audio playing
  if (!isPaused) {
    pauseTrack();
  }

  const prevVolume = audio ? audio.volume : DEFAULT_VOLUME;
  audio = new Audio(url);
  audio.volume = prevVolume;

  const volumeRangeInputEl = document.querySelector(".volume-progress");
  volumeRangeInputEl.value = DEFAULT_VOLUME;
  volumeRangeInputEl.addEventListener("input", (e) => {
    audio.volume = e.path[0].value;
  });

  const trackTimeDuration = document.getElementById("current-time");
  const currentTimeElem = document.getElementById("start-time");
  audio.ondurationchange = () => {
    const duration = Math.round(audio.duration);
    trackTimeDuration.innerHTML = formatTime(duration);
    currentTimeElem.innerHTML = formatTime(0);
  };

  const progressEl = document.getElementById("track-progress");
  progressEl.value = 0;
  progressEl.addEventListener("input", (e) => {
    const progress = e.path[0].value;
    audio.currentTime = audio.duration * progress;
  });

  audio.addEventListener("timeupdate", (event) => {
    const duration = event.path[0].duration;
    const time = Math.round(event.path[0].currentTime);

    progressEl.value = time / duration;
    currentTimeElem.innerHTML = formatTime(time);
  });

  audio.onended = () => handleNextPress();

  const trackItems = document.getElementsByClassName("track-item");
  for (let item of trackItems) {
    if (item.innerHTML == tracks[currentIndex].title) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  }
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

function startTrack() {
  audio.play();
  isPaused = false;

  const currentTrackName = document.getElementById("current-track");
  const currentTitle = tracks[currentIndex].title;
  currentTrackName.innerHTML = currentTitle;

  const iconPlayPause = document.getElementById("play");
  iconPlayPause.classList.add("active");

  changeTrackIcon(currentIndex, PAUSE_ICON_URL);
}

function pauseTrack() {
  audio.pause();
  isPaused = true;

  const iconPlayPause = document.getElementById("play");
  iconPlayPause.classList.remove("active");

  changeTrackIcon(currentIndex, PLAY_ICON_URL);
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
    changeTrackIcon(currentIndex, PLAY_ICON_URL);
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

function changeTrackIcon(trackIndex, url) {
  const trackItemElems = document.getElementsByClassName("track-item");
  const currentTrack = trackItemElems[trackIndex];
  currentTrack.style.setProperty("--backgroundImage", `url(${url})`);
}

function handlePrevPress() {
  changeTrackIcon(currentIndex, PLAY_ICON_URL);
  const isFirstTrackLoaded = currentIndex === 0;
  currentIndex = isFirstTrackLoaded ? tracks.length - 1 : currentIndex - 1;
  loadTrack();
  startTrack();
}

function handleNextPress() {
  changeTrackIcon(currentIndex, PLAY_ICON_URL);
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
