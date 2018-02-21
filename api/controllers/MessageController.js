/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getMessages: function(req, res) {
        MessageService.getMessages(function(err, messages) {
            if (err) {
                return res.serverError(err);
            }
            sails.log('Found %s messages', messages.length);
            return res.json(messages);
        });
    },
    subscribe: function(req, res) {
        if( ! req.isSocket) {
          return res.badRequest();
        }
    
        sails.sockets.join(req.socket, 'message-timeline');
    
        return res.ok();
    }
};

