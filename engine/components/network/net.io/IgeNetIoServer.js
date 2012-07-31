var IgeNetIoServer = {
	/**
	 * Starts the network for the server.
	 * @param {*} data The port to listen on.
	 * @param {Function=} callback A callback method to call once the
	 * network has started.
	 */
	start: function (data, callback) {
		var self = this;

		if (typeof(data) !== 'undefined') {
			this._port = data;
		}

		// Start net.io
		this.log('Starting net.io listener on port ' + this._port);
		this._io = new this._netio(this._port, callback);

		// Setup listeners
		this._io.on('connection', function () { self._onClientConnect.apply(self, arguments); });

		return this._entity;
	},

	/**
	 * Sets a network command and optional callback. When a network command
	 * is received by the server, the callback set up for that command will
	 * automatically be called and passed the data from the incoming network
	 * packet.
	 * @param {String} commandName The name of the command to define.
	 * @param {Function=} callback A function to call when the defined network
	 * command is received by the network.
	 * @return {*}
	 */
	define: function (commandName, callback) {
		if (commandName !== undefined) {
			this._networkCommands[commandName] = callback;

			// Record reverse lookups
			var index = this._networkCommandsIndex.length;
			this._networkCommandsIndex[index] = commandName;
			this._networkCommandsLookup[commandName] = index;

			return this._entity;
		} else {
			this.log('Cannot define a network command without a commandName parameter!', 'error');
		}
	},

	/**
	 * Gets / sets the current flag that determines if client connections
	 * should be allowed to connect (true) or dropped instantly (false).
	 * @param {Boolean} val Set to true to allow connections or false
	 * to drop any incoming connections.
	 * @return {*}
	 */
	acceptConnections: function (val) {
		if (typeof(val) !== 'undefined') {
			this._acceptConnections = val;
			if (val) {
				this.log('Server now accepting connections!');
			} else {
				this.log('Server no longer accepting connections!');
			}

			return this._entity;
		}

		return this._acceptConnections;
	},

	/**
	 * Sends a message over the network.
	 * @param {String} commandName
	 * @param {Object} data
	 * @param {*=} client If specified, sets the recipient socket or a array of sockets to send to.
	 */
	send: function (commandName, data, client) {
		var commandIndex = this._networkCommandsLookup[commandName];

		if (commandIndex !== undefined) {
			if (client !== undefined) { client = client.id; }
			this._io.send([commandIndex, data], client);
		} else {
			this.log('Cannot send network packet with command "' + commandName + '" because the command has not been defined!', 'error');
		}
	},

	/**
	 * Determines if the origin of a request should be allowed or denied.
	 * @param origin
	 * @return {Boolean}
	 * @private
	 */
	_originIsAllowed: function (origin) {
		// put logic here to detect whether the specified origin is allowed.
		return true;
	},

	/**
	 * Called when the server receives a client connection request. Sets
	 * up event listeners on the socket and sends the client the initial
	 * networking data required to allow network commands to operate
	 * correctly over the connection.
	 * @param {Object} socket The client socket object.
	 * @private
	 */
	_onClientConnect: function (socket) {
		var self = this;

		if (this._acceptConnections) {
			this.log('Accepted connection with id ' + socket.id);

			socket.on('message', function (data) {
				self._onClientMessage.apply(self, [data, socket]);
			});

			socket.on('disconnect', function (data) {
				self._onClientDisconnect.apply(self, [data, socket]);
			});

			// Send an init message to the client
			socket.send({
				cmd: 'init',
				ncmds: this._networkCommandsLookup
			});
		} else {
			this.log('Rejecting connection with id ' + socket.id + ' - we are not accepting connections at the moment!');
			socket.disconnect();
		}
	},

	/**
	 * Called when the server receives a network message from a client.
	 * @param {Object} data The data sent by the client.
	 * @param {Object} socket The client socket object.
	 * @private
	 */
	_onClientMessage: function (data, socket) {
		var commandName = this._networkCommandsIndex[data[0]];

		if (this._networkCommands[commandName]) {
			this._networkCommands[commandName](data[1], socket);
		}
		this.emit(commandName, data[1], socket);
	},

	/**
	 * Called when a client disconnects from the server.
	 * @param {Object} data Any data sent along with the disconnect.
	 * @param {Object} socket The client socket object.
	 * @private
	 */
	_onClientDisconnect: function (data, socket) {
		this.log('Client disconnected with id ' + socket.id);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeNetIoServer; }