var express = require('express');
var admin = require('firebase-admin');
var pinify = require('./pinify.js');
var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// var serviceAccount = require('test-de97f53719d3.json');
// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: 'https://test-b5dbd.firebaseio.com/'
// });
// var db = admin.database();

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/centers', function(req, res) {
	res.render('centers');
});

app.get('/languageOptions', function(req, res) {
	res.render('languageOptions');
});

app.get('/language', function(req, res) {
	res.render('language');
});

app.get('/categories', function(req, res) {
	res.render('categories');
});

app.get('/jimp', function(req, res) {
	pinify(req.query.input, function(buffer) {
		res.send(buffer);
	});
});

app.get('/app', function(req, res) {
	res.render('app');
});

app.get('/eula', function(req, res) {
	res.render('eula');
});

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
