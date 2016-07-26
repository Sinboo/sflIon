/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('SignUpModalCtrl', function ($scope, $ionicActionSheet, appModalService, ionicToast, appService) {
    var vm = this;
    vm.user = {};

    $scope.userGroupList = [
      { text: "用户", value: "customer" },
      { text: "发型师", value: "hairstylist" },
      { text: "前台", value: "receptionist" }
    ];

    $scope.mustInputErrorTips = {
      required: '请填写必填项'
    };

    vm.validate = function () {
      if (!vm.user.userGroup) {
        ionicToast.show('请选择角色!', 'middle', false, 2000);return false;
        // appService.showAlert('提示', '请选择角色', '确定')
      }
      return true;
    };
    
    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };

    $scope.setUserGroup = function (group) {
      vm.user.userGroup = group;
    };

    vm.openLogin = function () {
      $scope.closeModal(null);
      appModalService.show(
        'templates/authentication/modal/login.html',
        'LoginModalCtrl as vm'
      ).then(
        function (value) {
          if (value) {
            $scope.authObj.$authWithPassword({
              email: value.email,
              password: value.password
            }).then(function(authData) {
              localStorageService.cookie.set('user', authData);
              console.log("Logged in as:", authData);
              Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '登录成功!', 2000);
            }).catch(function(error) {
              Materialize.toast('<i class="icon ion-close-round"></i>' + error, 2000);
              console.error("Authentication failed:", error);
            });
          }
        },
        function(err) {
          Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
        }
      );
    };

    // need to implement upyun
    vm.uploadUserPhoto = function () {
      $ionicActionSheet.show({
        buttons: [{
          text: '拍照'
        }, {
          text: '从图库选择'
        }],
        buttonClicked: function (index) {
          switch (index) {
            case 0: // Take Picture
              document.addEventListener("deviceready", function () {
                $cordovaCamera.getPicture(appService.getCameraOptions()).then(function (imageData) {
                  alert(imageData);
                  $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                }, function (err) {
                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                });
              }, false);

              break;
            case 1: // Select From Gallery
              document.addEventListener("deviceready", function () {
                $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
                  $rootScope.user.photo = "data:image/jpeg;base64," + imageData;
                }, function (err) {
                  appService.showAlert('Error', err, 'Close', 'button-assertive', null);
                });
              }, false);
              break;
          }
          return true;
        }
      });
    };
    
  })