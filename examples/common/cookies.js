export function setCookie(name, value) {
	var expires = "";
	
	var date = new Date();
	date.setMinutes(date.getMinutes() + 30);
	expires = "; expires=" + date.toUTCString();

	document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function delCookie(name) {
    document.cookie = name + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 GMT" + "; path=/";
    window.location.href = "/login"
}