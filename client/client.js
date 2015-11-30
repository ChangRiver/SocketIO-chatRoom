$(function() {
	var $chatroom = $('.chat'),
		$lines = $('.lines'),
		$nickname = $('.nickname'),
		$setNickname = $('.set-nickname'),
		$nicknames = $('.nicknames'),
		$messages = $('.messages'),
		$messages = $('.messages'),
		$nick = $('.nick'),
		$sendMessage = $('.send-message'),
		$to = $('.to'),
		$nicknameErr = $('.nickname-err'), toUser = null, myself = null

	//如果不传递 url 参数, socket.io 会自动探测地址	
	var socket = io.connect()

	socket.on('announcement', function(msg) {
		$lines.append($('<p>').append($('<em>').text(msg)))
	})

	socket.on('nicknames', function(nicknames) {
		$nicknames.empty().append($('<span>当前在线: </span>'));
		$.each(nicknames, function(key, val) {
			$nicknames.append($('<b>').text(val))
		})
	})

	function message(from, msg, opt_to) {
		var label;
		if(opt_to) {
			label = $('<b>').text(from + '对' + opt_to + '说: ')
		}else {
			label = $('<b>').text(from + ': ');
		}
		$lines.append($('<p>').append(label, msg))
	}

	socket.on('user:pub', message);
	socket.on('user.private', message);
	socket.on('reconnect', function() {
		$lines.remove()
	})
})