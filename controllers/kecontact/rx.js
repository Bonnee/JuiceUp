const dgram = require('dgram');
const EventEmitter = require('events');

module.exports = class RX extends EventEmitter {
	constructor() {
		super();
		this._socket = dgram.createSocket('udp4');

		this._socket.on('error', (err) => {
			return err;
		});

		this._socket.on('message', (message, rinfo) => {
			this._parseMessage(message).then((parsedMessage) => {
				if (parsedMessage) {
					this.emit('message', {
						address: rinfo.address,
						data: parsedMessage
					});

					this.emit(rinfo.address, {
						data: parsedMessage
					});
				}
			}).catch((err) => {
				this.emit('error', err);
			});
		});
	}

	init(port) {
		this._socket.bind(port);
	}

	close() {
		this._socket.close();
	}

	_parseMessage(message) {
		return new Promise((resolve, reject) => {
			let msg = message.toString().trim();

			try {
				if (msg.length == 0)
					return;

				if (msg.startsWith('TCH')) {
					msg = '{ "' + msg.split(':')[0] + '":"' + msg.split(':')[1] + '" }';
					if (JSON.parse(msg)['TCH-OK '] == 'done') {
						//console.log("TCH-OK: done")
						resolve();
					} else {
						console.err("Error", msg)
						reject(new Error("TCH Error"));
					}
				}

				if (msg[0] == '"')
					msg = '{' + msg + '}';

				resolve(JSON.parse(msg));
			} catch (err) {
				console.log('here is the wrong data', msg);
				reject(new Error('wrong data'));
			}
		});
	}
}