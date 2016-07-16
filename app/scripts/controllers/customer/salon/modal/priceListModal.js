/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('PriceListModalCtrl', function ($scope, appModalService, parameters, $wilddogAuth, WD_URL) {
    var vm = this;
    vm.hairstylist = parameters;
    console.log(vm.hairstylist);

    if(vm.hairstylist) {
      vm.choosePrice = function (group) {
        appModalService.show(
          'templates/customer/salon/modal/choosePriceModal.html',
          'ChoosePriceModalCtrl as vm',
          {group: group, hairstylist: vm.hairstylist}
        ).then(function (value) {
          console.log(value);
          if (value) {
            $scope.closeModal(value);
          }
        })
      }
    }
    else {
      vm.choosePrice = function (group) {
        appModalService.show(
          'templates/customer/salon/modal/choosePriceModal.html',
          'ChoosePriceModalCtrl as vm',
          {group: group}
        ).then(function (value) {
          if (value) {
            appModalService.show(
              'templates/customer/salon/modal/hairstylistsModal.html',
              'HairstylistsModalCtrl as vm',
              {price: value}
            ).then(function (val) {
              $scope.closeModal(val);
            })
          }
          else {
            $scope.closeModal(null);
          }
        })
      };
    }

    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };


    
  });