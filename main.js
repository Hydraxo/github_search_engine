"use strict";

const formTextfield = document.querySelector(".body-form_textfield");
const formSubmitButton = document.querySelector(".body-form_submit");
const userNotFound = document.querySelector(".body-result_user_not_found");
const clearAll = document.querySelector(".body-form_clearAll");
const displayResultMain = document.querySelector(".body-section_main");
const displayResultUsername = document.querySelector(".body-section_username_result");
const displayResultImage = document.querySelector(".body-section_image_result");
const displayResultLogin = document.querySelector(".body-section_login_result");

let saveSearchInput = { textfield: "" };

formTextfield.addEventListener("keyup", manageData);
formSubmitButton.addEventListener("click", handleSearchButton);
clearAll.addEventListener("click", clearAll);

function clearAll (e){
  e.preventDefault();
  displayResultMain.style.display = "none";
  userNotFound.style.display = "none";
  formTextfield.value = "";
}

function hideAll () {
  displayResultMain.style.display = "none";
  userNotFound.style.display = "none";
}

function showSeachResultElements() {
  displayResultMain.style.display = "block";
  formTextfield.value = "";
}

function noResultToDisplay() {
  userNotFound.style.display = "block";
}

function manageData(e) {
  const searchFieldHandler = e.target.name;
  const searchFieldValue = e.target.value;
  saveSearchInput[searchFieldHandler] = searchFieldValue;
}

function handleSearchButton(e) {
  e.preventDefault();
  if (formTextfield.value === "") {
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

