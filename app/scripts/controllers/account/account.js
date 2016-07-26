/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('AccountCtrl', function ($scope, UserProfile, $state, listService, userGroup) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.userProfile = UserProfile();
      $scope.userGroup = userGroup()
    });

    $scope.type = 1;
    

    $scope.editProfile = function () {
      $state.go($scope.userGroup + '.editProfile')
    };

    $scope.orders = listService.list('order');
    console.log($scope.orders);
    
  });