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

let saveSearchInput = { textfield: "" };
let saveFollowersDataLogin = [];

formTextfield.addEventListener("keyup", manageData);
formSubmitButton.addEventListener("click", handleSearchButton);
clearAllData.addEventListener("click", handleClearAll);
followersSeeDetailsButton.addEventListener("click", handleFollowersButton);
followersGoBack.addEventListener("click", handleFollowersGoBack);

function handleClearAll(e) {
  e.preventDefault();
  displayResultMain.style.display = "none";
  userNotFound.style.display = "none";
  formTextfield.value = "";
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
  const searchFieldHandler = e.target.name;
  const searchFieldValue = e.target.value;
  saveSearchInput[searchFieldHandler] = searchFieldValue;
}

function handleSearchButton(e) {
  
  e.preventDefault();
  clearFollowersArray();
  if (formTextfield.value === "") {
    alert("Please type in the user you're looking for");
  } else {
    fetchDataFromPage();
  }
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
          for (i=0; i<followersData.length; i++) {
          saveFollowersDataLogin.push (followersData[i].login);
          }
          console.log(saveFollowersDataLogin);
          if (saveFollowersDataLogin.length >= 30){
            followersSeeDetailsButton.innerHTML = "Show First 30 Results";
          } 
          if (saveFollowersDataLogin.length < 30){
            followersSeeDetailsButton.innerHTML = "Show Details";
          } 
          createFollowersElements();
        }
    })
    .catch(function() {
      console.log("Error - No followers found");
  });
}

function createFollowersElements() {
  if(showFollowersData.children.length > 0){
  showFollowersData.innerHTML = "";
  }

  saveFollowersDataLogin.forEach(follower=> {
    const followersCreateItem = document.createElement("li");
    const followersCreateContent = document.createTextNode(follower)
    followersCreateItem.appendChild(followersCreateContent);
    showFollowersData.appendChild(followersCreateItem);
  });
}

function handleFollowersButton() {
  hideAll();
  displayResultDetailsFollowers.style.display = "block";
}

function handleFollowersGoBack (){
  hideAll();
  showSeachResultElements();
}

function clearFollowersArray() {
  saveFollowersDataLogin.length = 0;

}