/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkGroupCtrl', function ($scope, $state) {

    $scope.chooseWorkGroup = function (group) {
      $state.go('customer.works', {group: group})
    };
    
  });