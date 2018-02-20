'use strict';

var messageTimelineApp = angular.module('messageTimelineApp', ['ngRoute', 'ui.bootstrap', 'angularMoment']);

messageTimelineApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: '/templates/messageTimeline.html',
        controller: 'MessageTimelineCtrl'
    })
    .when('/login', {
        templateUrl: '/templates/login.html',
        controller: 'LoginCtrl'
    })
    .otherwise({
        redirectTo: '/login',
        caseInsensitiveMatch: true
    });
}])
.run(['$rootScope', '$location', 'LoginService', function ($rootScope, $location, LoginService) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if (!LoginService.isAuthenticated()) {
            $location.path('/login');
        } else {
            $location.path('/');
        }
    });
}])

messageTimelineApp.controller('LoginCtrl', ['$scope', '$location', 'LoginService', '$uibModal', function($scope, $location, LoginService, $uibModal) {
    $scope.login = function(user) {
        LoginService.login(user.email, user.password, (response) => {
            if (response.success) {
                $scope.signin_error = '';
                $location.path('/');
            } else {
              $scope.signin_error = response.message;
            }
        });
    };

    $scope.openRegisterModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: 'registerNewUserModal.html',
            controller: 'RegisterNewUserModelCtrl'
          }).result.catch(function(res) {
            if (!(res === 'cancel' || res === 'escape key press')) {
              throw res;
            }
          });
      };
}]);

messageTimelineApp.controller('MessageTimelineCtrl', ['$scope', '$timeout', 'LoginService', 'MessageService', 'UserService', function($scope, $timeout, LoginService, MessageService, UserService) {

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

messageTimelineApp.controller('RegisterNewUserModelCtrl', ['$scope', '$rootScope', 'UserService', '$uibModalInstance', function($scope, $rootScope, UserService, $uibModalInstance) {
    $scope.register = function(newUser) {
        UserService.register(newUser).then( (response) => {
            $scope.signup_success = '';
            $scope.signup_error = '';

            if (response.success) {
                $scope.signup_success = 'The new user was added.';
            } else {
              $scope.signup_error = response.message.invalidAttributes;
            }
        });
    };

    $scope.closeRegisterModal = function() {
        $scope.signup_success = '';
        $scope.signup_error = '';
        $uibModalInstance.dismiss('cancel');
    };
}]);

messageTimelineApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});