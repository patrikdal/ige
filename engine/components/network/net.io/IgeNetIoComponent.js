var IgeNetIoComponent = IgeEventingClass.extend({
	classId: 'IgeNetIoComponent',
	componentId: 'network',

	init: function (entity, options) {
		this._entity = entity;
		this._options = options;

		// Setup the network commands storage
		this._networkCommands = {};
		this._networkCommandsIndex = [];
		this._networkCommandsLookup = {};

		// Set some defaults
		this._port = 8000;

		/* CEXCLUDE */
		if (ige.isServer) {
			this.implement(IgeNetIoServer);
			this._netio = require('../../../' + modulePath + 'net.io-server').Server;
			this._acceptConnections = false;
		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			this.implement(IgeNetIoClient);
		}

		this.log('Network component initiated!');
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeNetIoComponent; }