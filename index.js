var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3000;

var chokidar = require('chokidar');

var watcher = chokidar.watch('log.txt', {
    ignored: /[\/\\]./,
    persistent: true
});

//var log = console.log.bind(console);

watcher.on('change', function(path) {
    console.log('File', path, 'has been changed');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    watcher.on('change', function(path) {
        console.log('File', path, 'has been changed');
    });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    // socket.on('disconnect', function() {
    //     console.log('user disconnected');
    // });
});

http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});