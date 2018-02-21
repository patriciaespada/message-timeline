messageTimelineApp.service('UserService', ['$http', function ($http) {
    return {
        getByEmail: function (email) {
            return $http.get(`/user?where={"email":"${email}"}`).then(
                function(result) { 
                    return { success: true, data: result.data }; 
                }, 
                function(error) { 
                    return { success: false, message: error }; 
                }
            );
        },
        getById: function (id) {
            return $http.get(`/user?where={"id":"${id}"}`).then(
                function(result) { 
                    return { success: true, data: result.data }; 
                }, 
                function(error) { 
                    return { success: false, message: error }; 
                }
            );
        },
        register: function (newUser) {
            return $http.post('/user', newUser).then(
                function(result) { 
                    return { success: true, data: result.data }; 
                }, 
                function(error) { 
                    return { success: false, message: error.data }; 
                }
            );
        }
    }
}]);