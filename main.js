"use strict";

const searchFieldListener = document.querySelector(".body-form_textfield");
const searchButtonListener = document.querySelector(".body-form_submit");
const showResult = document.querySelector(".body-section_main");
const userNotFound = document.querySelector(".body-result_user_not_found");
const clearAllListener = document.querySelector(".body-form_clearAll");

let displayResultUsername = document.querySelector(".body-section_username_result");
let displayResultImage = document.querySelector(".body-section_image_result");
let displayResultLogin = document.querySelector(".body-section_login_result");
let saveSearchInput = { textfield: "" };

searchFieldListener.addEventListener("keyup", manageData);
searchButtonListener.addEventListener("click", activateSearchButton);
clearAllListener.addEventListener("click", clearAll);

function clearAll (e){
  e.preventDefault();
  showResult.style.display = "none";
  userNotFound.style.display = "none";
  searchFieldListener.value = "";
}

function hideAll () {
  showResult.style.display = "none";
  userNotFound.style.display = "none";
}

function showSeachResultElements() {
  showResult.style.display = "block";
  searchFieldListener.value = "";
}

function noResultToDisplay() {
  userNotFound.style.display = "block";
}

function manageData(e) {
  const searchFieldHandler = e.target.name;
  const searchFieldValue = e.target.value;
  saveSearchInput[searchFieldHandler] = searchFieldValue;
}

function activateSearchButton(e) {
  e.preventDefault();
  if (searchFieldListener.value === "") {
    alert("Please type in the user you're looking for");
  } else {
    fetchDataFromPage();
  }
}

function fetchDataFromPage() {
  fetch("https://api.github.com/users/" + saveSearchInput.textfield)
    .then(function (response) {
      if (response.status === 404) { 
        hideAll();
        noResultToDisplay(); 
      }
      else {
        hideAll()
        showSeachResultElements();
        return response.json();
      }
    })
    .then(function (data) {
      displayResultUsername.innerHTML = data.name;
      displayResultLogin.innerHTML = data.login;
      displayResultImage.src = data.avatar_url;
    })
}

