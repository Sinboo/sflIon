/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('AddCustomerMaintainCtrl', function ($scope, $state, noBackGoTo, userGroup, listService, JoinList, appModalService, $ionicPopover) {
    $scope.goTo = noBackGoTo;
    $scope.userGroup = userGroup();
    $scope._ = _;
    


  });