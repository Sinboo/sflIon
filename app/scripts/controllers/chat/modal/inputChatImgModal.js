/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('InputChatImgModalCtrl', function ($scope, parameters) {
    var vm = this;
    vm.imgUrl = parameters;


    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };
    
    
  });