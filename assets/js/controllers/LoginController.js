'use strict';

angular
  .module('messageTimelineApp')
  .controller('LoginCtrl', ['$scope', '$location', 'LoginService', '$uibModal', 
        function($scope, $location, LoginService, $uibModal) {

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

angular
  .module('messageTimelineApp')
  .controller('RegisterNewUserModelCtrl', ['$scope', '$rootScope', 'UserService', '$uibModalInstance', 
        function($scope, $rootScope, UserService, $uibModalInstance) {

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