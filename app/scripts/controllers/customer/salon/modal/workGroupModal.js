/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkGroupModalCtrl', function ($scope, appModalService, $wilddogAuth, WD_URL) {
    var vm = this;

    vm.chooseWorkGroup = function (group) {
      appModalService.show(
        'templates/customer/salon/modal/workListModal.html',
        'WorkListModalCtrl as vm',
        group
      ).then(function (val) {
        if (val) {
          $scope.closeModal(val);
        }
        else {
          $scope.closeModal(null);
        }
      })
    };
    
    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };


    
  });