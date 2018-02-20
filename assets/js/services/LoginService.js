messageTimelineApp.service('LoginService', ['UserService', function(UserService) {
    return {
        isAuthenticated: function() {
            return localStorage.isAuthenticated === "true";
        },
        login: function(email, password, callback) {
            UserService.getByEmail(email).then(
                function (response) {
                    if (response.success && response.data.length > 0) {
                        localStorage.isAuthenticated = true;
                        localStorage.setItem('user', JSON.stringify(response.data[0]));
                        callback(response);
                    } else {
                        callback({ success: false, message: 'Authentication failed.' });
                    }
                }
            );
        },
        logout: function() {
            localStorage.isAuthenticated = false;
            localStorage.user = {};
        },
        getActiveUser: function() {
            return JSON.parse(localStorage.getItem('user'));
        }
    }
}]);