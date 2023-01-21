let audio;
let tracks = [];
let currentIndex = 0;

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
  } catch {
    console.log("Error!!!");
  }
}

function onTracksLoadSuccess(data) {
  const trackList = document.getElementById("player-tracks");
  tracks = data;
  for (let item of tracks) {
    const tagP = document.createElement("p");
    tagP.className = "track-item";
    tagP.innerHTML = item.title;
    trackList.append(tagP);
  }
  loadTrack();
}

function onTracksLoadFailed() {
  console.error("onTracksLoadFailed");
}

function loadTrack() {
  const src = tracks[currentIndex].src;
  const url = `https://raw.githubusercontent.com/NikaKlokava/momentum-audio/main/${src}`;
  audio = new Audio(url);
}

function startTrack() {
  const currentTrackName = document.getElementById("current-track");
  const currentTitle = tracks[currentIndex].title;
  currentTrackName.innerHTML = currentTitle;
  audio.play();
}

function handlePlayPausePress() {
  const iconPlayPause = document.getElementById("play");
  const pause = iconPlayPause.classList.toggle("active");
  if (pause) {
    audio.play();
  } else {
    audio.pause();
  }
}

function handlePlayPauseTrackPress(index) {
  if (index == currentIndex) {
    audio.pause();
  } else {
    currentIndex = index;
    loadTrack();
    startTrack();
  }
}

function handlePrevPress() {
  currentIndex = currentIndex == 0 ? tracks.length - 1 : currentIndex - 1;
  loadTrack();
  startTrack();
}

function handleNextPress() {
  currentIndex = currentIndex == tracks.length - 1 ? 0 : currentIndex + 1;
  loadTrack();
  startTrack();
}

async function onDOMContentLoaded() {
  await loadTrackList();
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
