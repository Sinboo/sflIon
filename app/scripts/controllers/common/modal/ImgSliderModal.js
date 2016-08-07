/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ImgSliderModalCtrl', function ($scope, ionicToast, parameters, $ionicSlideBoxDelegate, $timeout, $cordovaCamera, appService, getFileObject, upyun, rfc4122, $ionicLoading, $ionicPopup, $ionicActionSheet, Camera, $cordovaImagePicker) {
    var vm = this;
    $scope.images = parameters.images;
    $scope.index = parameters.index;
    $timeout(function() {
      var startHandle = _.find($ionicSlideBoxDelegate._instances, function (s) {
        return s.$$delegateHandle === "imgSliderModal";
      });
      startHandle.slide($scope.index, 0);
    });

    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };
    
    
  });