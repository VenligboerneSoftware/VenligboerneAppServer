window.onload = function() {
	if (typeof window.orientation !== 'undefined') {
		// mobile device
		const operatingSystem = getMobileOperatingSystem();
		let storeURL = null;
		if (operatingSystem === 'iOS') {
			// app store URL
			storeURL = 'https://itunes.apple.com/';
		} else if (operatingSystem === 'Android') {
			// play store URL
			storeURL =
				'https://play.google.com/store/apps/details?id=com.venligboerne.app';
		}

		const redirect = getParameterByName('url');
		console.log('Redirecting to', redirect);
		window.location = redirect;
		// attemptRedirect(redirect, storeURL);
	}
};

// Redirect to the URL of the first parameter, if the host recognizes that as a
// valid target. If not, use the fallback URL.
function attemptRedirect(url, fallback) {
	var script = document.createElement('script');
	script.onload = function() {
		document.location = url;
	};
	script.onerror = function() {
		if (fallback) {
			document.location = fallback;
		}
	};
	script.setAttribute('src', url);
	document.getElementsByTagName('head')[0].appendChild(script);
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if (/android/i.test(userAgent)) {
		return 'Android';
	}

	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return 'iOS';
	}

	return 'unknown';
}
