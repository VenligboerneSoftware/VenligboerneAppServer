var app = angular.module("app", ["firebase"]);

const FIREBASE_HOST = "https://test-b5dbd.firebaseio.com/";

app.controller("appController", function ($scope, $firebaseObject, $firebaseAuth) {

    var toastActive = false;

    $scope.processing = false;

    $scope.loading = 4;

    var firebaseRef = new Firebase(FIREBASE_HOST);

    /* LOADING */

    $scope.auth = $firebaseAuth(firebaseRef);


    $scope.auth.$onAuth(function (authData) {
        if (authData) {
            $scope.categories = $firebaseObject(firebaseRef.child('icons'));
            $scope.users = $firebaseObject(firebaseRef.child('users'));
            $scope.centers = $firebaseObject(firebaseRef.child('centers'));
            $scope.posts = $firebaseObject(firebaseRef.child('friendliness'));

            $scope.categories.$loaded().then(function () {
                $scope.loading--;
                if (!$scope.loading) {
                    $scope.onLoad();
                }
            });
            $scope.users.$loaded().then(function () {
                $scope.loading--;
                if (!$scope.loading) {
                    $scope.onLoad();
                }
            });
            $scope.centers.$loaded().then(function () {
                $scope.loading--;
                if (!$scope.loading) {
                    $scope.onLoad();
                }
            });
            $scope.posts.$loaded().then(function () {
                $scope.loading--;
                if (!$scope.loading) {
                    $scope.onLoad();
                }
            });

        } else {
            $scope.categories = {};
            $scope.users = {};
            $scope.centers = {};
            $scope.posts = {};
        }
    });

    /* LOAD DATA */

    $scope.loadUsers = function () {
        $scope.users = {};
        $scope.loading++;
        firebaseRef.child('users').on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                var value = {
                    //name: data.val().name,
                    //flagged: data.val().flagged,
                    //flagMessage: data.val().flagMessage,
                    facebookUID: data.val().facebookUID,
                    pushToken: data.val().pushToken
                };
                $scope.users[data.key()] = value;
            });
            if ($scope.loading > 0) {
                $scope.loading--;
            }
        }, function (err) {
            Materialize.toast(err.message, 5000);
            if ($scope.loading > 0) {
                $scope.loading--;
            }
        });
    }

    $scope.loadPosts = function () {
        $scope.posts = {};
        $scope.loading++;
        firebaseRef.child('friendliness').on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                var value = {
                    description: data.val().description,
                    formatted_address: data.val().formatted_address,
                    icon: data.val().icon,
                    index: data.val().index,
                    latitude: data.val().latitude,
                    longitude: data.val().longitude,
                    owner: data.val().owner,
                    title: data.val().title
                };
                $scope.posts[data.key()] = value;
            });
            if ($scope.loading > 0) {
                $scope.loading--;
            }
        }, function (err) {
            Materialize.toast(err.message, 5000);
            if ($scope.loading > 0) {
                $scope.loading--;
            }
        });
        console.log($scope.posts)
    }

    $scope.loadCenters = function () {
        $scope.centers = {};
        $scope.loading++;
        firebaseRef.child('centers').on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                var value = {
                    address: data.val().address,
                    events: data.val().events,
                    image: data.val().image,
                    latitude: data.val().latitude,
                    longitude: data.val().longitude,
                    phone: data.val().phone,
                    subscrubs: data.val().subscrubs,
                    title: data.val().title
                };
                $scope.centers[data.key()] = value;
            });
            if ($scope.loading > 0) {
                $scope.loading--;
            }
        }, function (err) {
            Materialize.toast(err.message, 5000);
            if ($scope.loading > 0) {
                $scope.loading--;
            }
        });
    }


    firebaseRef.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });


    $scope.onLoad = function () {
            $scope.loadUsers();
            //$scope.loadCategories();
            $scope.loadPosts();
            console.log($scope.posts)
            $scope.loadCenters();
    }

    $scope.onLoad();

    /* ADMIN - PATIENTS */

    $scope.addPatient = function () {
        if (!$scope.patient) {
            Materialize.toast("Required fields cannot be left blank.", 3000);
            return;
        }

        $scope.processing = true;

        firebaseRef.child('patients').child($scope.guid()).set({
            fname: $scope.patient.fname,
            lname: $scope.patient.lname,
            phone: $scope.patient.phone,
            email: $scope.patient.email,
            gender: $scope.patient.gender,
            country: $scope.patient.country,
            cancer: $scope.patient.cancer,
            diagnosis_date: $scope.patient.diagnosis,
            resource_date: $scope.patient.resources,
            followup_date: $scope.patient.followup,
            needed_resources: $scope.patient.neededRes,
            referred_to: $scope.patient.referredTo
        }, function (err) {
            $scope.processing = false;
            if (err) {
                Materialize.toast(err.message, 5000);
            } else {
                Materialize.toast("Patient added", 3000);
                window.location.replace("/admin");
            }
        });
    }

    $scope.prepareEditPatient = function (patients, patient, patient_key) {
        $scope.cancelEdits(patients);
        patient.editing[patient_key] = true;
    }

    $scope.editPatient = function (patient, patient_key, patient_value) {
        patient.editing[patient_key] = false;
        if (!$scope.roles.admin) {
            Materialize.toast('Permission denied', 3000);
            return;
        }
        var update_package = {};
        update_package[patient_key] = patient_value;
        firebaseRef.child('patients/' + patient.uid).update(update_package);
        if (!toastActive) {
            toastActive = true;
            Materialize.toast('Patient saved', 1000, '', function () {
                toastActive = false;
            });
        }
    }

    $scope.getPatientInfo = function (patient) {
        $scope.selectedPatient = patient;
        $('#showPatientModal').openModal();
    }

    $scope.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

});