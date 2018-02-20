/**
 * MessageService
 * 
 * @description :: Operations over the Message model
 */

module.exports = {
    getMessage: function(id, next) {
        Message
        .findOne(id)
        .populate('user')
        .populate('replies')
        .then(function(message) {
            var replyUsers = User.find({
                id: _.pluck(message.replies, 'user')
                //_.pluck: Retrieves the value of a 'user' property from all elements in the post.comments collection.
            }).then(function(replyUsers) {
                return replyUsers;
            });
            return [message, replyUsers];
        })
        .spread(function(message, replyUsers) {
            replyUsers = _.indexBy(replyUsers, 'id');
            //_.indexBy: Creates an object composed of keys generated from the results of running each element of the collection through the given callback. The corresponding value of each key is the last element responsible for generating the key
            message.replies = _.map(message.replies, function(reply) {
                reply.user = replyUsers[reply.user];
              return reply;
            });
            next(null, message);
        })
        .catch(function(err) {
            next(err, null);
        });        
    },
    getMessages: function(next) {
        Message
        .find()
        .sort('createdAt DESC')
        .populate('user')
        .populate('replies')
        .then(function(messages) {
            var replies = _.map(messages, function(message) {
                return message.replies;
            }).reduce(function(previous, current) {
                return previous.concat(current);
            });
            
            var replyUsers = User.find({
                id: _.pluck(replies, 'user')
                //_.pluck: Retrieves the value of a 'user' property from all elements in the post.comments collection.
            }).then(function(replyUsers) {
                return replyUsers;
            });
            return [messages, replyUsers];
        })
        .spread(function(messages, repliesUsers) {
            repliesUsers = _.indexBy(repliesUsers, 'id');
            //_.indexBy: Creates an object composed of keys generated from the results of running each element of the collection through the given callback. The corresponding value of each key is the last element responsible for generating the key
            var newMessages = _.map(messages, function(message) {
                message.replies = _.map(message.replies, function(reply) {
                    reply.user = repliesUsers[reply.user];
                    return reply;
                });
                return message;
            });
            next(null, newMessages);
        })
        .catch(function(err) {
            next(err, null);
        });
    }
}