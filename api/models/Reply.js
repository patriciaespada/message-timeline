/**
 * Reply.js
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
        message: {
            model: 'Message'
        }
    },

    afterCreate: function(reply, cb) {
        MessageService.getMessage(reply.message, function(err, message) {
            if (!err) {
                sails.sockets.broadcast('message-timeline', 'new_reply', message);
                cb();
            }
        });
    }
};

