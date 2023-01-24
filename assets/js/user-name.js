const LOCAL_STORAGE_USERNAME_KEY = "current_user_name";

function getUserName() {
  return localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
}

function setUserName(userName) {
  localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, userName);
}

function handleNameChanged(event) {
  const userName = event.target.value;
  setUserName(userName);
}

function onDOMContentLoaded() {
  const userNameEl = document.getElementById("user-name");
  userNameEl.addEventListener("input", handleNameChanged);

  const name = getUserName();
  if (name) {
    userNameEl.value = name;
  }
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
