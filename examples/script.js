import { getCookie, delCookie } from "./common/index.js";

const form = document.querySelector("form");
const user = document.createElement("input");
const domain = document.createElement("input");

const SESSION_ID = JSON.parse(getCookie("SESSION_ID"))

user.type = "hidden";
user.name = "user";
user.value = SESSION_ID.user;

domain.type = "hidden";
domain.name = "domain";
domain.value = SESSION_ID.domain;

form.prepend(domain);
form.prepend(user);

form.onsubmit = (evt) => {
    evt.preventDefault();
    evt.target.submit();
}

const logoutBtn = document.querySelector("#logout-btn");
logoutBtn.onclick = () => {
    delCookie("SESSION_ID")
}