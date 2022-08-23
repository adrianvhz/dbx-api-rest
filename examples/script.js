import { getCookie, delCookie } from "./common/index.js";

const forms = document.getElementsByClassName("form");
const SESSION_ID = JSON.parse(getCookie("SESSION_ID"))



for (let i=0; i < forms.length; i++) {
	const user = document.createElement("input");
	const domain = document.createElement("input");

	user.type = "hidden";
	user.name = "user";
	user.value = SESSION_ID.user;
	
	domain.type = "hidden";
	domain.name = "domain";
	domain.value = SESSION_ID.domain;

	forms[i].prepend(user);
	forms[i].prepend(domain);
	
	forms[i].onsubmit = (evt) => {
		evt.preventDefault();
		evt.target.submit();
	}
}



const logoutBtn = document.querySelector("#logout-btn");
logoutBtn.onclick = () => {
	delCookie("SESSION_ID")
}