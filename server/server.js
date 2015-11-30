var http = require('http');
var fs = require('fs')

var connect = require('connect')
var app = connect.createServer(
	connect.static()
).listen(8000);

var sio = require('socket.io');
var io = sio.listen(app),
	nicknames = {}, onlines = {};
io.sockets.on('connection', function(socket) {
	socket.on('user:pub',function(msg) {
		socket.broadcast.emit('user:pub', socket.nickname, msg)
	})
	socket.on('user:private',function(msg, to){
		if(onlines[to]){
			onlines[to].emit('user.private', socket.nickname, msg, to)
		}
	})
	socket.on('nickname',function(nick, fn) {
		if(nicknames[nick]) {
			fn(true)
		}else {
			fn(false)
			nicknames[nick] = socket.nickname = nick;
			onlines[nick] = socket;
			socket.broadcast.emit('announcement', nick+'已连接');
			io.sockets.emit('nicknames', nicknames)
		}
	})

	socket.on('disconnect', function() {

		if(!socket.nickname) {
			return;
		}

		delete nicknames[socket.nickname];
		delete onlines[socket.nickname]
		//广播“我”已经离开聊天室了，并更新在线列表
		socket.broadcast.emit('announcement', socket.nickname + '断开链接了')
		socket.broadcast.emit('nicknames', nicknames)
	})
})
