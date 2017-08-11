// console.log('hello');
//
// // Attempt to go to the given URL, but if it doesn't exist stay at the current
// // page
// function goto(url) {
// 	// var script = document.createElement('script');
// 	// script.onload = function() {
// 	// 	alert('onload');
// 	// 	document.location = url;
// 	// };
// 	// script.onerror = function() {
// 	// 	alert('onerror');
// 	// };
// 	// // use script.onerror to handle bad urls
// 	// script.setAttribute('src', url);
// 	// document.getElementsByTagName('head')[0].appendChild(script);
//
//   document.location
// 	// var a = document.createElement('a');
// 	// a.setAttribute('href', url);
// 	// a.innerText = url;
// 	// console.log(document.body);
// 	// document.body.appendChild(a);
// 	// a.click();
// }
//
// setTimeout(function() {
// 	goto(window.location.href.split('?')[1]);
// }, 100);

var redirectToApp = function() {
	setTimeout(function appNotInstalled() {
		alert('App not installed');
	}, 100);
	window.location.replace(window.location.href.split('?')[1]);
};
window.onload = redirectToApp;
