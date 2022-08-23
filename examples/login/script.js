import { setCookie } from "../common/cookies.js"

const form = document.querySelector("form");
form.onsubmit = (evt) => {
	evt.preventDefault();
	var data = Object.fromEntries(new FormData(evt.target));
	var valueCookie = {
		user: data.user,
		domain: "http://localhost:5000/dashboard"
	}
	setCookie("SESSION_ID", JSON.stringify(valueCookie), 1);
	window.location.href = "/"
}