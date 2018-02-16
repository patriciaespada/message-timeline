/**
 * MessageService
 * 
 * @description :: Operations over the Message model
 */

module.exports = {
    getMessages: function(next) {
        Message.find().populate('user').exec(function(err, messages) {
            next(err, messages);
        });
    },
    addMessage: function(user, text, next) {
        Message.create({
            user: user, 
            text: text}
        ).exec(function(err, newMessage) {
            next(err, newMessage);
        });
    }
}