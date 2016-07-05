/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ForgotModalCtrl', function ($scope, appModalService) {
    var vm = this;

    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };

    vm.openLogin = function () {
      $scope.closeModal(null);
      appModalService.show(
        'templates/authentication/modal/login.html',
        'LoginModalCtrl as vm'
      ).then(
        function (value) {

        },
        function(err) {
          Materialize.toast('<i class="icon ion-ios-cart-outline"></i>' + err, 2000);
        }
      );
    };
    
  })