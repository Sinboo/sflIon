/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CustomerSideMenuCtrl', function ($scope, $state, UserProfile) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.userProfile = UserProfile();
    });
  });