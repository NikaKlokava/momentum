const url = "https://type.fit/api/quotes"
let dataQuotes = [];
let currentQuoterIndex = 0;

async function loadQuotes() {
  try {
    const promise = await fetch(url);
    if (promise.ok) {
      const data = await promise.json();
      onQuotesLoadSuccess(data);
    } else {
      onQuotesLoadFailed();
    }
  } catch (err) {
    onQuotesLoadFailed(err);
    console.log("Error while loading quoter", err);
  }
}

function onQuotesLoadSuccess(data) {
  dataQuotes = data;
  currentQuoterIndex = getRandomQuoterIndex(0, dataQuotes.length - 1);

  updateQuote();
}

function updateQuote() {
  const quoterTextEl = document.getElementById("quote-text");
  const quoterAutorEl = document.getElementById("quote-autor");

  quoterTextEl.innerHTML = `"${dataQuotes[currentQuoterIndex].text}"`;
  quoterAutorEl.innerHTML = dataQuotes[currentQuoterIndex].author;
}

function onQuotesLoadFailed() {
  console.error("Error happened", err);
}

function getRandomQuoterIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleRefreshPress() {
  currentQuoterIndex = getRandomQuoterIndex(0, dataQuotes.length - 1);
  updateQuote();
}

function onDOMContentLoaded() {
  loadQuotes();

  const buttonRefreshEl = document.getElementById("quote-reload");
  buttonRefreshEl.onclick = handleRefreshPress;
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
