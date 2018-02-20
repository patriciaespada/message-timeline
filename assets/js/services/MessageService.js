messageTimelineApp.service('MessageService', ['$http', function ($http) {
    return {
        getAll: function (email) {
            return $http.get('/message').then(
                function(result) { 
                    return { success: true, data: result.data }; 
                }, 
                function(error) { 
                    return { success: false, message: error }; 
                }
            );
        },
        addReply: function (newReply) {
            return $http.post('/reply', newReply).then(
                function(result) { 
                    return { success: true, data: result.data }; 
                }, 
                function(error) { 
                    return { success: false, message: error }; 
                }
            );
        },
        addMessage: function (newMessage) {
            return $http.post('/message', newMessage).then(
                function(result) { 
                    return { success: true, data: result.data }; 
                }, 
                function(error) { 
                    return { success: false, message: error }; 
                }
            );
        }
    }
}]);