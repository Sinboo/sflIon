/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('SignUpModalCtrl', function ($scope, $ionicActionSheet, appModalService, ionicToast, appService, upyun, $cordovaCamera, $ionicLoading, rfc4122) {
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
      if (!vm.user.userGroup) {ionicToast.show('请选择角色!', 'middle', false, 2000);return false;}
      if (!vm.user.avatar) {ionicToast.show('请上传头像!', 'middle', false, 2000);return false;}
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

    // upload image
    var isCordovaApp = !!window.cordova;
    if ( isCordovaApp ) {
      console.log('app');
      $scope.openFileDialog = function () {
        $ionicActionSheet.show({
          buttons: [{
            text: '<b>拍照</b> 上传'
          }, {
            text: '从 <b>相册</b> 中选'
          }],
          titleText: '图片上传',
          cancelText: '取 消',
          cancel: function () {
            // add cancel code..
          },
          buttonClicked: function (index) {
            if (index == 1) {
              $scope.readalbum();
            } else if (index == 0) {
              $scope.taskPicture();
            }
            return true;
          }
        });
      };

      $scope.readalbum = function() {
        document.addEventListener("deviceready", function () {
          $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
            var imgBase64 = "data:image/jpeg;base64," + imageData ;
            $timeout(function () {
              var imgBlob = getFileObject(imgBase64);
              $scope.appImgUpload(imgBlob);
            }, 0);
          });
        })
      };

      $scope.taskPicture = function () {
        document.addEventListener("deviceready", function () {
          $cordovaCamera.getPicture(appService.getCameraOptions()).then(function (imageData) {
            var imgBase64 = "data:image/jpeg;base64," + imageData ;
            $timeout(function () {
              var imgBlob = getFileObject(imgBase64);
              $scope.appImgUpload(imgBlob);
            }, 0);
          });
        });
      };

      $scope.appImgUpload = function (blob) {
        var uuidString = rfc4122.v4();
        var last = '{.suffix}';
        var imgUrl = '/' + uuidString + last;
        upyun.set('save-key', imgUrl);
        upyun.upload(blob, function(err, response, image){
          if (err) console.error(err);
          console.log(image)
          if (image.code === 200 && image.message === 'ok') {
            vm.user.avatar = image.absUrl;
            $scope.$apply();
            console.log(vm.user.avatar);
          }
        });
      }
    }
    else {
      console.log('web');
      //choose img
      $scope.openFileDialog = function() {
        ionic.trigger('click', {
          target: document.getElementById('file')
        });
      };

      $(document).on("change", ".uploadImage", function(e){
        e.preventDefault();
        $scope.upload();
      });

      //upload image
      $scope.upload = function() {
        var uuidString = rfc4122.v4();
        var last = '{.suffix}';
        var imgUrl = '/' + uuidString + last;
        upyun.set('save-key', imgUrl);
        upyun.upload('uploadForm', function(err, response, image){
          if (err) console.error(err);
          if (image.code === 200 && image.message === 'ok') {
            vm.user.avatar = image.absUrl;
            $scope.$apply();
            console.log(vm.user.avatar);
          }
        });
      };
    }
    
    
    upyun.on('uploading', function(progress) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner><br/>' + progress + "%",
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      if (progress === 100) {
        $ionicLoading.hide();
      }
    });
    
  });