/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ProductPreviewModalCtrl', function ($scope, appModalService, parameters) {
    var vm = this;
    vm.product = parameters;
    console.log(vm.product)

    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };
    
    
  })