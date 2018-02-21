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
}]);