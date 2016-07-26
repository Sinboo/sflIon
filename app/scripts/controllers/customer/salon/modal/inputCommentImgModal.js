/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('InputCommentImgModalCtrl', function ($scope, ionicToast, parameters, $timeout, $cordovaCamera, appService, getFileObject, upyun, rfc4122, $ionicLoading, $ionicPopup, $ionicActionSheet, Camera, $cordovaImagePicker) {
    var vm = this;
    $scope.comment = {};
    $scope.comment.content = parameters;

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
            $scope.image = {};
            $scope.image.ready = true;
            $scope.image.url = image.absUrl;
            $scope.comment.imgUrl = $scope.image.url;
            $scope.$apply();
            console.log($scope.image.url, $scope.comment.imgUrl);
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
            $scope.image = {};
            $scope.image.ready = true;
            $scope.image.url = image.absUrl;
            $scope.comment.imgUrl = $scope.image.url;
            $scope.$apply();
            console.log($scope.image.url, $scope.comment.imgUrl);
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


    $scope.deleteImage = function () {
      $ionicPopup.confirm({
        title: '删除图片?',
        template: '您想要删除图片或更换图片?',
        buttons: [{ text: '取消' }, { text: '确认', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        console.log(res)
        if(res == 'ok') {
          $scope.image.url = "";
          $scope.comment.imgUrl = undefined;
          $scope.image.ready = false;
        }
        else {}
      });
    };

    vm.validate = function () {
      if (!$scope.comment.imgUrl && (!$scope.comment.content || $scope.comment.content.trim() == '')) {ionicToast.show('请至少填写评论文字或者上传评论图片!', 'middle', false, 2000);return false;}
      return true;
    };


    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };
    
    
  });