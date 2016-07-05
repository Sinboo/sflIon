/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('AuthenticationCtrl', function ($scope, $state, $interval, $wilddogAuth, listService, WD_URL, $ionicLoading, localStorageService, appModalService, $ionicActionSheet) {
    var ref = new Wilddog(WD_URL);
    $scope.authObj = $wilddogAuth(ref);


    $scope.openLogin = function () {
      appModalService.show(
        'templates/authentication/modal/login.html',
        'LoginModalCtrl as vm'
      ).then(
        function (value) {
          if (value) {
            $scope.authObj.$authWithPassword({
              email: value.email,
              password: value.password
            }).then(function(authData) {
              localStorageService.cookie.set('user', authData);
              console.log("Logged in as:", authData);
              Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '登录成功!', 2000);
              $state.go('customer.salonReservation')
            }).catch(function(error) {
              Materialize.toast('<i class="icon ion-close-round"></i>' + error, 2000);
              console.error("Authentication failed:", error);
            });
          }
        },
        function(err) {
          Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
        }
      );
    };

    $scope.openRegister = function () {
      appModalService.show(
        'templates/authentication/modal/signup.html',
        'SignUpModalCtrl as vm'
      ).then(
        function (value) {
          console.log(value)
          if (value) {
            $scope.authObj.$createUser({
              email: value.email,
              password: value.password
            }).then(function(userData) {
              return $scope.authObj.$authWithPassword({
                email: value.email,
                password: value.password
              });
            }).then(function(authData) {
              var userProfile = {};
              userProfile.uid = authData.uid.split(':')[1];
              userProfile.name = value.name;
              userProfile.avatar = null;
              listService.list('users:hairstylist').add(userProfile);
              console.log("Logged in as:", authData);
              localStorageService.cookie.set('user', authData);
              Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '注册并登录成功!', 2000);
              $state.go('customer.salonReservation')

            }).catch(function(error) {
              console.error("Error: ", error);
              Materialize.toast('<i class="icon ion-close-round"></i>' + error, 2000);
            });
          }
        },
        function(err) {
          Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
        }
      );
    };
    
    
    


    
    

  });