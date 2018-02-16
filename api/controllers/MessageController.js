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
    addMessage: function(req, res) {
        UserService.getUserByEmail(req.body.email, function(err, user) {
            if (err) {
                return res.serverError(err);
            }

            if (!user) {
                return res.notFound('Could not find the user, sorry.');
            }
            
            MessageService.addMessage(user, req.body.text, function(err, message) {
                if (err) {
                    return res.serverError(err);
                }
                sails.log('Added new message');
                return res.json(message);
            });
        });       
    }
};

