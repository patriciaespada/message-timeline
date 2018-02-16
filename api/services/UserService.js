/**
 * UserService
 * 
 * @description :: Operations over the User model
 */

module.exports = {
    getUserByEmail: function(email, next) {
        User.findOne({
            email: email
        }).exec(function(err, user) {
            next(err, user);
        });
    }
}