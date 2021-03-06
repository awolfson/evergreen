evergreen.controller('LoginCtrl',
  ['$scope', 'Auth', '$location', '$window', 'errorService', 'flashService',
  function($scope, Auth, $location, $window, errorService, flashService) {

    // always try to grab current user
    Auth.currentUser().then(function(user) {
      $scope.currentUser = user;
      $scope.creds = {};
      $scope.creds["email"] = $scope.currentUser.email;
    }, function(error) {
      $scope.currentUser = '';
    });

    $scope.login = function(creds) {
      var config = { headers: { 'X-HTTP-Method-Override': 'POST' } }
      Auth.login(creds, config)
        .then(function(user) {
          $scope.creds = {};
          $window.location.reload();
          $location.path( "/home" );
        }, function() {
          $scope.creds = {};
          $window.location.reload();
          $location.path( "/login" );
        });
    };

    $scope.logout = function() {
      var config = { headers: { 'X-HTTP-Method-Override': 'DELETE' } }
      Auth.logout(config).then(function() {        
        $window.location.reload();
        $location.path( "/home" );
      }, function() {
        flashService.logout(false);
      });
    };

    $scope.register = function(creds) {
      var config = { headers: { 'X-HTTP-Method-Override': 'POST' } }
      Auth.register(creds, config)
        .then(function(user) {
          loginInfo = {};
          loginInfo.email = creds.email;
          loginInfo.password = creds.password;
          $scope.login(loginInfo);
        }, function(response) {
          $scope.invalid = errorService.getInvalidsLogin(response);
        });
    };

    $scope.editInfo = function(creds) {
      var config = { headers: { 'X-HTTP-Method-Override': 'PATCH' } }
      Auth.register(creds, config)
        .then(function(user) {
          flashService.updateFlash('User information', 'update', true);
          $location.path(" /home ");
        }, function(response) {
          $scope.invalid = errorService.getInvalidsLogin(response);
          flashService.updateFlash('User information', 'update', false);
        });
    };

    // error functions

    $scope.errorClass = function(key) {
      if ($scope.invalid) {
        return $scope.invalid[key] ? 'has-error' : '';
      } else {
        return '';
      };
    };

    $scope.errorMessages = function(key) {
      if ($scope.invalid && $scope.invalid[key]) {
        return $scope.invalid[key]["messages"][0];
      };
    };

    // grab user information
    $scope.loggedIn = function() {
      return !!($scope.currentUser);
    };

    $scope.userType = function() {
      if ($scope.loggedIn) {
        return $scope.currentUser.user_type;
      } else {
        return 'anon';
      };
    };

    $scope.username = function() {
      if ($scope.loggedIn) {
        return $scope.currentUser.username;
      } else {
        return '';
      };
    };

    $scope.userID = function() {
      if ($scope.loggedIn) {
        return $scope.currentUser.id;
      } else {
        return 0;
      };
    };

    $scope.requireAdmin = function() {
      return ($scope.userType() === "admin");
    };

    $scope.requireCurator = function() {
      return ($scope.userType() === "admin") || ($scope.userType() === "curator");
    };

  }]);