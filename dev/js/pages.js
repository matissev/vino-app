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
nav = document.getElementById("nav");
date = document.getElementById("date");

zoneLink = document.getElementById("zone-link");
backLink = document.getElementById("back-link");

dayLink = document.getElementById("day");
weekLink = document.getElementById("week");
monthLink = document.getElementById("month");

appContent = document.getElementById("app-content");

loginPage = document.getElementById("connexion");
homePage = document.getElementById("home-page");
aside = document.getElementById("aside");
dayPage = document.getElementById("day-page");
weekPage = document.getElementById("week-page");
monthPage = document.getElementById("month-page");

loginButton.onclick = function(){
	addClass(loginPage, 'hidden');
	addClass(appContent, 'shown');
};

zoneLink.onclick = function(){
	addClass(homePage, 'hidden');
	addClass(aside, 'shown');
	addClass(nav, 'shown');
	addClass(zoneLink, 'hidden');
	addClass(backLink, 'shown');
};

backLink.onclick = function(){
	removeClass(homePage, 'hidden');
	removeClass(nav, 'shown');
	removeClass(aside, 'shown');
	removeClass(zoneLink, 'hidden');
	removeClass(backLink, 'shown');
};

dayLink.onclick = function(){
	addClass(dayLink, 'selected');
	removeClass(weekLink, 'selected');
	removeClass(monthLink, 'selected');

	addClass(date, 'day');
	removeClass(date, 'month');
	removeClass(date, 'week');

	removeClass(dayPage, 'shown');
	removeClass(weekPage, 'hidden-from-left');
	addClass(weekPage, 'hidden-from-right');
	removeClass(monthPage, 'shown');
};

weekLink.onclick = function(){
	addClass(weekLink, 'selected');
	removeClass(dayLink, 'selected');
	removeClass(monthLink, 'selected');

	addClass(date, 'week');
	removeClass(date, 'month');
	removeClass(date, 'day');

	addClass(dayPage, 'shown');
	removeClass(weekPage, 'hidden-from-right');
	removeClass(weekPage, 'hidden-from-left');
	removeClass(monthPage, 'shown');
};

monthLink.onclick = function(){
	addClass(monthLink, 'selected');
	removeClass(dayLink, 'selected');
	removeClass(weekLink, 'selected');

	addClass(date, 'month');
	removeClass(date, 'week');
	removeClass(date, 'day');

	addClass(dayPage, 'shown');
	removeClass(weekPage, 'hidden-from-right');
	addClass(weekPage, 'hidden-from-left');
	addClass(monthPage, 'shown');
};