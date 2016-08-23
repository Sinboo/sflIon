/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('PriceListCtrl', function ($scope, $state, appModalService) {
    $scope.isReceptionist = $state.params.isReceptionist;

    if($state.params.hairstylist) {
      $scope.choosePrice = function (group) {
        appModalService.show(
          'templates/customer/salon/modal/choosePriceModal.html',
          'ChoosePriceModalCtrl as vm',
          {group: group, hairstylist: $state.params.hairstylist}
        ).then(function (value) {
          console.log(value);
          if (value) {
            if (!$scope.isReceptionist) {
              $state.go('customer.createEditReservation', {reservation: {hairstylist: $state.params.hairstylist, price: value}});
            }
            else {
              $state.go('receptionist.createEditReservation', {reservation: {hairstylist: $state.params.hairstylist, price: value}});
            }
          }
        })
      }
    }
    else {
      $scope.choosePrice = function (group) {
        appModalService.show(
          'templates/customer/salon/modal/choosePriceModal.html',
          'ChoosePriceModalCtrl as vm',
          {group: group}
        ).then(function (value) {
          if (value) {
            $state.go('customer.hairstylists', {price: value});
          }
        })
      };
    }
    
  });