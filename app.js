var express = require('express');
var admin = require('firebase-admin');
var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

var serviceAccount = require('test-de97f53719d3.json');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://test-b5dbd.firebaseio.com/'
});
var db = admin.database();

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
