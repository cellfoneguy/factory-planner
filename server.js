const express = require('express');
const path = require('path');

var app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/index.html', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/page2.html', function(req, res) {
  res.sendFile(path.join(__dirname, '/page2.html'));
});

app.get('/numpad.html', function(req, res) {
  res.sendFile(path.join(__dirname, '/numpad.html'));
});

app.get('/adder.html', function(req, res) {
  res.sendFile(path.join(__dirname, '/adder.html'));
});

app.get('/planner.html', function(req, res) {
  res.sendFile(path.join(__dirname, '/planner.html'));
});


app.use(express.static("public"));
app.listen(3000);