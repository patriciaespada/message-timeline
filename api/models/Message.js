/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		user: {
			model: 'User',
			required: true
		},
		text: {
			type: 'string',
			required: true
		},
		replies: {
			collection: 'Reply',
			via: 'message'
		}
	},

	afterCreate: function(message, cb) {
		MessageService.getMessage(message.id, function(err, message) {
			if (!err) {
				sails.sockets.broadcast('message-timeline', 'new_message', message);
				cb();
			}
		});
	}
};

