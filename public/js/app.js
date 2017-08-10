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
	var storageRef = firebase.storage().ref();
	$scope.auth = $firebaseAuth();
	$scope.loggedIn = false;

	var toastActive = false;
	$scope.processing = false;
	$scope.loading = 4;
	$scope.downloadURL = [];

	$scope.auth.$onAuthStateChanged(function(authData) {
		if (authData) {
			$scope.categories = $firebaseObject(firebaseRef.child('categories'));
			$scope.users = $firebaseObject(firebaseRef.child('users'));
			$scope.centers = $firebaseObject(firebaseRef.child('centers'));
			$scope.posts = $firebaseObject(firebaseRef.child('posts'));
		} else {
			$scope.categories = {};
			$scope.users = {};
			$scope.centers = {};
			$scope.posts = {};

			$scope.auth
				.$signInWithPopup('facebook')
				.then(function(result) {
					console.log('Signed in as:', result.user.uid);
				})
				.catch(function(error) {
					console.error('Authentication failed:', error);
				});
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

	$scope.changeUserPermissions = function(user, users, permissions) {
		$scope.cancelEdits(users);
		console.log('Ban User', user);
		var update_package = {};
		update_package['permissions'] = permissions;
		firebaseRef.child('users/' + user.key).update(update_package);
	};

	$scope.file_changed = function(element, instance, field, bucket, tableStr) {
		$scope.$apply(function(scope) {
			var photofile = element.files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				var blob = new Blob([e.target.result], { type: 'image/jpeg' });

				Materialize.toast('Uploading...', 500, '', function() {
					toastActive = false;
				});

				var storageUrl = bucket + '/';
				var storageRef = firebase.storage().ref(storageUrl + photofile.name);
				console.warn(photofile); // Watch Screenshot
				var uploadTask = storageRef.put(blob);

				uploadTask.on(
					'state_changed',
					function progress(snapshot) {
						var percentage =
							snapshot.bytesTransferred / snapshot.totalBytes * 100;
						// use the percentage as you wish, to show progress of an upload for example
					}, // use the function below for error handling
					function(error) {
						switch (error.code) {
							case 'storage/unauthorized':
								// User doesn't have permission to access the object
								break;

							case 'storage/canceled':
								// User canceled the upload
								break;

							case 'storage/unknown':
								// Unknown error occurred, inspect error.serverResponse
								break;
						}
					},
					function complete() {
						//This function executes after a successful upload
						$scope.downloadURL.push(uploadTask.snapshot.downloadURL);
						if (field != '') {
							$scope.editField(instance, tableStr, field, downloadURL);
							instance.editing[field] = false;
						}
					}
				);
			};
			reader.readAsArrayBuffer(photofile);
		});
	};

	$scope.removeField = function(tableStr, table, instance) {
		$scope.cancelEdits(table);
		firebaseRef.child(tableStr + '/' + instance.key).remove();
	};

	$scope.removePost = function(tableStr, posts, instance) {
		$scope.cancelEdits(posts);
		if (instance.applications) {
			Object.keys(instance.applications).forEach(function(key) {
				firebaseRef.child('applications' + '/' + key).remove();
			});
		}
		firebaseRef.child('posts' + '/' + instance.key).remove();
	};

	$scope.addCenter = function() {
		console.log('add center');
		if (!$scope.center || !$scope.downloadURL) {
			Materialize.toast('Required fields cannot be left blank.', 3000);
			return;
		}

		$scope.processing = true;

		firebaseRef.child('centers').child($scope.guid()).set({
			address: $scope.center.address,
			image: $scope.downloadURL[0],
			latitude: $scope.center.latitude,
			longitude: $scope.center.longitude,
			phone: $scope.center.phone,
			title: $scope.center.title
		}, function(err) {
			$scope.processing = false;
			if (err) {
				Materialize.toast(err.message, 5000);
			} else {
				$scope.downloadURL = [];
				window.location.replace('/');
			}
		});
	};

	$scope.addCategory = function() {
		console.log('Add Category');
		if (!$scope.category || !$scope.downloadURL[0] || !$scope.downloadURL[1]) {
			Materialize.toast('Required fields cannot be left blank.', 3000);
			return;
		}

		$scope.processing = true;
		let iconName = $scope.category.title.toLowerCase().replace(' ', '_');
		firebaseRef.child('categories').child(iconName).set({
			title: $scope.category.title,
			icon: iconName,
			iconURL: $scope.downloadURL[0],
			pinURL: $scope.downloadURL[1]
		}, function(err) {
			$scope.processing = false;
			if (err) {
				Materialize.toast(err.message, 5000);
			} else {
				$scope.downloadURL = [];
				window.location.replace('/');
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
