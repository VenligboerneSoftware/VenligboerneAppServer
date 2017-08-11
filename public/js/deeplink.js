console.log('hello');

// Attempt to go to the given URL, but if it doesn't exist stay at the current
// page
function goto(url) {
	var script = document.createElement('script');
	script.onload = function() {
		document.location = url;
	};
	// use script.onerror to handle bad urls
	script.setAttribute('src', url);
	document.getElementsByTagName('head')[0].appendChild(script);
}

goto('exp://yr-9f2.venligboerneapp.venligboerneappnew.exp.direct:80/+');
