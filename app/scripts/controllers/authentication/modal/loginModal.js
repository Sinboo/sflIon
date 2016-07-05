/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('LoginModalCtrl', function ($scope, appModalService, $wilddogAuth, WD_URL) {
    var vm = this;
    var ref = new Wilddog(WD_URL);
    $scope.authObj = $wilddogAuth(ref);

    vm.user = {};

    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };

    // vm.weixinSignIn = function () {
    //   $scope.closeModal(null);
    //   $scope.authObj.$authWithOAuthPopup("weixin").then(function(authData) {
    //     console.log("Logged in as:", authData);
    //   }).catch(function(error) {
    //     console.error("Authentication failed:", error);
    //   });
    //
    // }

    vm.openForgot = function () {
      $scope.closeModal(null);
      appModalService.show(
        'templates/authentication/modal/forgot.html',
        'ForgotModalCtrl as vm'
      ).then(
        function (value) {

        },
        function(err) {
          Materialize.toast('<i class="icon ion-ios-cart-outline"></i>' + err, 2000);
        }
      );
    };
    
  })