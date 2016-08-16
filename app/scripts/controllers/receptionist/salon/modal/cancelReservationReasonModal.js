/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CancelReservationReasonModalCtrl', function ($scope, ionicToast, parameters, RESERVATION_CANCEL_REASON, $timeout, $cordovaCamera, appService, getFileObject, upyun, rfc4122, $ionicLoading, $ionicPopup, $ionicActionSheet, Camera, $cordovaImagePicker) {
    var vm = this;
    $scope.formData = {};
    $scope.reasons = RESERVATION_CANCEL_REASON;
    

    vm.validate = function () {
      if (!$scope.formData.reason && (!$scope.formData.otherReason || $scope.formData.otherReason.trim() == '')) {ionicToast.show('请确定订单取消原因!', 'middle', false, 2000);return false;}
      return true;
    };


    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };
    
    
  });