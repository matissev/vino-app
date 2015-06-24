function hasClass(ele,cls) {
    return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function removeClass(element, className) {
    if (element && hasClass(element,className)) {
        var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
        element.className=element.className.replace(reg,'');
    }
}

function addClass(element, className) {
    if (element && !hasClass(element,className)) {
        element.className += '  '+className;
    }
}

loginButton = document.getElementById("login-button");
menu = document.getElementById("menu");

appContent = document.getElementById("app-content");

loginPage = document.getElementById("connexion");
homePage = document.getElementById("home");

loginButton.onclick = function(){
	addClass(loginPage, 'hidden');
	addClass(appContent, 'shown');
};