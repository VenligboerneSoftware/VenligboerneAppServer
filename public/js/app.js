var app = angular.module('app', ['firebase']);

const FIREBASE_HOST = 'https://test-b5dbd.firebaseio.com/';

app.config(function() {
	var config = {
		apiKey: 'AIzaSyCqnUPSUbAfeb9o5OLvTA7SZ0hu6P0BuT4', // Your Firebase API key
		authDomain: 'test-b5dbd.firebaseapp.com', // Your Firebase Auth domain ("*.firebaseapp.com")
		databaseURL: 'https://test-b5dbd.firebaseio.com/', // Your Firebase Database URL ("https://*.firebaseio.com")
		storageBucket: 'test-b5dbd.appspot.com' // Your Cloud Storage for Firebase bucket ("*.appspot.com")
	};
	firebase.initializeApp(config);
});

app.controller('appController', function(
	$scope,
	$firebaseObject,
	$firebaseAuth
) {
	var firebaseRef = firebase.database().ref();
	var toastActive = false;

	$scope.processing = false;

	$scope.loading = 4;

	$scope.auth = $firebaseAuth();

	$scope.auth
		.$signInWithPopup('facebook')
		.then(function(result) {
			console.log('Signed in as:', result.user.uid);
			//$scope.onLoad();
		})
		.catch(function(error) {
			console.error('Authentication failed:', error);
		});

	$scope.auth.$onAuthStateChanged(function(authData) {
		if (authData) {
			$scope.categories = $firebaseObject(firebaseRef.child('icons'));
			$scope.users = $firebaseObject(firebaseRef.child('users'));
			$scope.centers = $firebaseObject(firebaseRef.child('centers'));
			$scope.posts = $firebaseObject(firebaseRef.child('friendliness'));
		} else {
			$scope.categories = {};
			$scope.users = {};
			$scope.centers = {};
			$scope.posts = {};
		}
	});

	$scope.prepareEditField = function(table, instance, field) {
		$scope.cancelEdits(table);
		instance.editing[field] = true;
	};

	$scope.editField = function(instance, tableStr, field, value) {
		console.log(instance);
		instance.editing[field] = false;
		var update_package = {};
		update_package[field] = value;
		firebaseRef.child(tableStr + '/' + instance.key).update(update_package);
		if (!toastActive) {
			toastActive = true;
			Materialize.toast('Edit saved', 1000, '', function() {
				toastActive = false;
			});
		}
	};

	$scope.cancelEdits = function(table) {
		Object.keys(table).forEach(function(key) {
			if (table[key]) {
				table[key].editing = {};
				table[key].key = key;
			}
		});
	};

	$scope.guid = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return (
			s4() +
			s4() +
			'-' +
			s4() +
			'-' +
			s4() +
			'-' +
			s4() +
			'-' +
			s4() +
			s4() +
			s4()
		);
	};
});
