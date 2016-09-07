/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('EditProfileCtrl', function ($scope, UserProfile, noBackGoTo, upyun, rfc4122, $ionicLoading, ionicToast, listService, userGroup, UID, updateWidget, localStorageService, $ionicActionSheet, $cordovaCamera, $timeout, appService, getFileObject) {
    $scope.noBackGoTo = noBackGoTo;
    $scope.type = 1;
    $scope.userProfile = UserProfile();
    $scope.userProfile.birthday = $scope.userProfile.birthday ? new Date($scope.userProfile.birthday) : undefined;
    console.log($scope.userProfile);

    $scope.genderList = [
      { text: "男", value: "male" },
      { text: "女", value: "female" }
    ];

    $scope.mustInputErrorTips = {
      required: '请填写必填项',
      // minlength: 'This field does not match the min length',
      // maxlength: 'This field does not match the max length',
      pattern: '手机号不对'
      // number: 'This field should be a number'
    };

    $scope.goBackTo = function () {
      console.log(userGroup() + '.account');
      noBackGoTo(userGroup() + '.account')
    };

    $scope.validate = function () {
      if (!$scope.userProfile.avatar) {ionicToast.show('请上传头像!', 'top', false, 2000);return false;}
      if (!$scope.userProfile.gender) {ionicToast.show('请选择性别!', 'middle', false, 2000);return false;}
      return true;
    };

    $scope.save = function () {
      var list = listService.list(userGroup() + ':' + UID());
      list.$loaded().then(function (data) {
        var index = list.$indexFor($scope.userProfile.$id);
        var userProfile = {};
        angular.copy($scope.userProfile, userProfile);
        userProfile.birthday = Date.parse(userProfile.birthday);
        var newProfile = updateWidget(userProfile);
        list[index] = newProfile;
        list.$save(index).then(function () {
          var userNew = localStorageService.cookie.get('user');
          userNew.userProfile = newProfile;
          localStorageService.cookie.set('user', userNew);
          Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '编辑保存成功!', 2000);
          noBackGoTo(userGroup() + '.account')
        });
      })

    };

    var isCordovaApp = !!window.cordova;
    if ( isCordovaApp ) {
      console.log('app');
      $scope.openFileDialog = function () {
        var hideSheet = $ionicActionSheet.show({
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
            $scope.image = {};
            $scope.image.ready = true;
            $scope.image.url = image.absUrl;
            $scope.userProfile.avatar = $scope.image.url;
            $scope.$apply();
            console.log($scope.image.url);
          }
        });
      }
    }
    else {
      console.log('web');
      //choose img
      $scope.openFileDialog = function() {
        // ionic.trigger('click', {
        //   target: document.getElementById('file')
        // });
        angular.element('#file').trigger('click');
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
            $scope.image = {};
            $scope.image.ready = true;
            $scope.image.url = image.absUrl;
            $scope.userProfile.avatar = $scope.image.url;
            $scope.$apply();
            console.log($scope.image.url);
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