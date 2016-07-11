/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistDetailModalCtrl', function ($scope, parameters, listService, N_VIP_PRICE, appModalService, $wilddogAuth, WD_URL) {
    var vm = this;
    vm.hairstylist = parameters.hairstylist[0];

    console.log(vm.hairstylist)
    



    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };


    
  });