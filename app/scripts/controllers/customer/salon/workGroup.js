/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkGroupCtrl', function ($scope, $state) {

    $scope.chooseWorkGroup = function (group) {
      if ($state.params.isHairstylist) {
        $state.go('hairstylist.works', {group: group})
      }
      else if ($state.params.isReceptionist) {
        $state.go('receptionist.works', {group: group})
      }
      else {
        $state.go('customer.works', {group: group})
      }
    };
    
  });