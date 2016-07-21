/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('AccountCtrl', function ($scope, UserProfile, $state, listService) {
    $scope.type = 1;
    $scope.userProfile = UserProfile();
    

    $scope.editProfile = function () {
      $state.go('customer.editProfile')
    };

    $scope.orders = listService.list('order');
    console.log($scope.orders);
    
  });