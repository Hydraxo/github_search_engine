"use strict";

const formTextfield = document.querySelector(".body-form_textfield");
const formSubmitButton = document.querySelector(".body-form_submit");
const userNotFound = document.querySelector(".body-result_user_not_found");
const clearAllData = document.querySelector(".body-form_clearAll");
const displayResultMain = document.querySelector(".body-section_main");
const displayResultUsername = document.querySelector(".body-section_username_result");
const displayResultImage = document.querySelector(".body-section_image_result");
const displayResultLogin = document.querySelector(".body-section_login_result");
const displayResultFollowers = document.querySelector(".body-section_followers_result");
const followersSeeDetailsButton = document.querySelector(".body-section_followers_button");
const displayResultDetailsFollowers = document.querySelector(".body-section_followers");
const followersGoBack = document.querySelector(".body-section_followers_back");
const showFollowersData = document.querySelector(".body-section_followers_content");
const goBackToFirstResultButton = document.querySelector(".body-section_main_back_to_first_result");
const goBackToPreviousFollower = document.querySelector(".body-section_main_back_other_followers");

let saveSearchInput = { textfield: "" };
let saveFollowersDataLogin = [];
let saveFollowersDataLoginGoToStart = { loginName: "" };
let saveFollowersDataLoginGoBack = [];

formTextfield.addEventListener("keyup", manageData);
formSubmitButton.addEventListener("click", handleSearchButtonTimeout);
clearAllData.addEventListener("click", handleClearAll);
followersSeeDetailsButton.addEventListener("click", handleFollowersButton);
followersGoBack.addEventListener("click", handleFollowersGoBack);
goBackToFirstResultButton.addEventListener("click", handleGoBackToFirstResult);
goBackToPreviousFollower.addEventListener("click", handleGoBackPreviousFollower)

function handleSearchButtonTimeout(e) {
  e.preventDefault();
  setTimeout(handleSearchButton, 200)
}

function handleSearchButton() {
  saveFollowersDataLoginGoBack.push(saveSearchInput.textfield);
  // console.log(saveFollowersDataLoginGoBack);
  if (saveFollowersDataLoginGoBack.length <= 2) {
    goBackToFirstResultButton.style.display = "none";
    goBackToPreviousFollower.style.display = "none";
  }
  clearFollowersArray();
  if (formTextfield.value === "") {
    alert("Please type in the user you're looking for");
  } else {
    fetchDataFromPage();
  }
}

function handleClearAll(e) {
  e.preventDefault();
  displayResultMain.style.display = "none";
  userNotFound.style.display = "none";
  formTextfield.value = "";
  goBackToFirstResultButton.style.display = "none";
  goBackToPreviousFollower.style.display = "none";
  clearFollowersArray();
  hideAll();
}

function hideAll() {
  displayResultMain.style.display = "none";
  userNotFound.style.display = "none";
  displayResultDetailsFollowers.style.display = "none";
}

function showSeachResultElements() {
  displayResultMain.style.display = "block";
  formTextfield.value = "";
}

function noResultToDisplay() {
  userNotFound.style.display = "block";
}

function manageData(e) {
  saveFollowersDataLoginGoBack.length = 0;
  const searchFieldHandler = e.target.name;
  const searchFieldValue = e.target.value;
  saveSearchInput[searchFieldHandler] = searchFieldValue;
  saveFollowersDataLoginGoToStart.loginName = saveSearchInput.textfield;
}

function fetchDataFromPage() {
  fetch("https://api.github.com/users/" + saveSearchInput.textfield)
    .then(function (mainResponse) {
      if (mainResponse.status === 404) {
        hideAll();
        noResultToDisplay();
      }
      else {
        hideAll();
        showSeachResultElements();
        return mainResponse.json();
      }
    })
    .then(function (mainData) {
      displayResultUsername.innerHTML = mainData.name;
      displayResultLogin.innerHTML = mainData.login;
      displayResultImage.src = mainData.avatar_url;
      displayResultFollowers.innerHTML = mainData.followers + "&nbsp";

      if (mainData.followers >= 30) { followersSeeDetailsButton.innerHTML = "Show First 30 Results"; }
      if (mainData.followers < 30) { followersSeeDetailsButton.innerHTML = "Show Details"; }
      if (mainData.name === null) { displayResultUsername.innerHTML = "This user doesn't have a username" };

      return fetch("https://api.github.com/users/" + saveSearchInput.textfield + "/followers")
    })
    .then(function (followersResponse) {
      return followersResponse.json();
    })
    .then(function (followersData) {
      if (followersData === null) {
        console.log("No data found");
      } else {
        let i;
        for (i = 0; i < followersData.length; i++) {
          saveFollowersDataLogin.push(followersData[i].login);
        }
        // console.log(saveFollowersDataLogin);
        createFollowersElements();
      }
    })
    .catch(function () {
      console.log("Error - No followers found");
    });
}

function createFollowersElements() {
  if (showFollowersData.children.length > 0) {
    showFollowersData.innerHTML = "";
  }

  saveFollowersDataLogin.forEach(follower => {
    const followersCreateItem = document.createElement("li");
    const followersCreateContent = document.createTextNode(follower)

    followersCreateItem.setAttribute("class", "body-section_followers_li_links");
    // Listen to all the elements from the list. 
    followersCreateItem.addEventListener("click", goToFollowersProfile);
    followersCreateItem.appendChild(followersCreateContent);
    showFollowersData.appendChild(followersCreateItem);
  });
}

function handleFollowersButton() {
  hideAll();
  displayResultDetailsFollowers.style.display = "block";
}

function handleFollowersGoBack() {
  hideAll();
  showSeachResultElements();
}

function clearFollowersArray() {
  saveFollowersDataLogin.length = 0;
}

function goToFollowersProfile(e) {
  // Get the value of the clicked element, work on the event "click". Depending where the user clicks we check the target and get the value of the innerHTML. 
  saveSearchInput.textfield = e.target.innerHTML;
  formTextfield.value = e.target.innerHTML
  handleSearchButton();
  displayNewBackButton();
}

function displayNewBackButton() {
  goBackToFirstResultButton.style.display = "flex";
  goBackToPreviousFollower.style.display = "flex";
}

function handleGoBackToFirstResult(e) {
  e.preventDefault();
  saveSearchInput.textfield = saveFollowersDataLoginGoToStart.loginName;
  formTextfield.value = saveFollowersDataLoginGoToStart.loginName;
  handleSearchButton();
}

function handleGoBackPreviousFollower(e) {
  e.preventDefault();
  saveFollowersDataLoginGoBack.pop();
  const arrayPosition = saveFollowersDataLoginGoBack[saveFollowersDataLoginGoBack.length - 1];
  saveSearchInput.textfield = arrayPosition;
  formTextfield.value = arrayPosition;
  handleSearchButton();
  saveFollowersDataLoginGoBack.pop();
}