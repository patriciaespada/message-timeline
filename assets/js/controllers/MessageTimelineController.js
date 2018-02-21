'use strict';

angular
  .module('messageTimelineApp')
  .controller('MessageTimelineCtrl', ['$scope', '$timeout', 'LoginService', 'MessageService', 'UserService', 
        function($scope, $timeout, LoginService, MessageService, UserService) {

    $scope.user = [];
    $scope.messages = [];
    $scope.error = '';
    $scope.showReplies = [];
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.numberOfPages = function() {
        return Math.ceil($scope.messages.length/$scope.pageSize);                
    }

    $scope.init = function() {
        $scope.user = LoginService.getActiveUser();
        $scope.getMessages();
    };

    io.socket.get('/message/subscribe', function(data, jwr) {
        io.socket.on('new_message', function(newMessage) {
            $timeout(function() {
                $scope.messages.unshift(newMessage);
            });
        });
        io.socket.on('new_reply', function(updatedMessage) {
            $timeout(function() {
                $scope.messages = $scope.messages.map(function (message) {
                    if (message.id === updatedMessage.id) {
                        return updatedMessage;
                    }
                    return message;
                });
            });
        });
    });

    $scope.logout = function() {
        LoginService.logout();
    };

    $scope.showHideReplies = function(id) {
        if (!$scope.showReplies[id]) {
            $scope.showReplies[id] = true;
        } else {
            $scope.showReplies[id] = false;
        }
    }

    $scope.getMessages = function() {
        $scope.error = '';
        MessageService.getAll().then(
            function (response) {
                if (response.success) {
                    $scope.messages = response.data;
                } else {
                    $scope.error = 'An error occured, please try again.'
                }
            }
        );
    };

    $scope.reply = function(newReply) {
        $scope.error = '';
        MessageService.addReply(newReply).then( (response) => {
            if (response.success) {
                //$scope.signup_success = 'The new user was added.';
                //$scope.getMessages();
            } else {
              $scope.error = 'An error occurred while replying to the message.';
            }
        });
    };

    $scope.addMessage = function(newMessage) {
        $scope.error = '';
        MessageService.addMessage(newMessage).then( (response) => {
            if (response.success) {
                $scope.newMessage = {};
                //$scope.getMessages();
            } else {
                $scope.error = 'An error occurred while adding new message.';
            }
        });
    };

}]);

angular
  .module('messageTimelineApp').filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
});