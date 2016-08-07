/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('CreateEditFashionCtrl', function ($scope, $state, noBackGoTo, $ionicActionSheet, upyun, $ionicLoading, rfc4122, $timeout, $ionicPopup, $cordovaCamera, appService, getFileObject, appModalService, listService, ionicToast, UID, userGroup) {
    $scope.carouselImgs = {};
    $scope.goTo = noBackGoTo;
    console.log($state.params);
    $scope.fashion = {};

    $scope.submitFashion = function () {
      var fashion = {};
      angular.copy($scope.fashion, fashion);
      fashion.coverImg = $scope.coverImg;
      fashion.carouselImgs = $scope.carouselImgs;
      fashion.uid = UID();
      fashion.userGroup = userGroup();
      fashion = JSON.parse(JSON.stringify(fashion));
      console.log(fashion);
      listService.list('fashion').add(fashion).then(function (ref) {
        Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '潮流提交成功!', 2000);
        $scope.goTo('hairstylist.fashionList')
      })
    };
    
    $scope.validate = function () {
      if (!$scope.carouselImgs) {ionicToast.show('请上传作品封面图!', 'top', false, 2000);return false;}
      if (_.size(JSON.parse(JSON.stringify($scope.carouselImgs))) == 0) {ionicToast.show('请至少上传一张轮播图!', 'middle', false, 2000);return false;}
      return true;
    };

    $scope.mustInputErrorTips = {
      required: '请填写必填项'
    };

    
    //upload image
    var isCordovaApp = !!window.cordova;
    if ( isCordovaApp ) {
      console.log('app');
      $scope.openFileDialog = function (string) {
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
              $scope.readalbum(string);
            } else if (index == 0) {
              $scope.taskPicture(string);
            }
            return true;
          }
        });
      };

      $scope.readalbum = function(string) {
        document.addEventListener("deviceready", function () {
          $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
            var imgBase64 = "data:image/jpeg;base64," + imageData ;
            $timeout(function () {
              var imgBlob = getFileObject(imgBase64);
              $scope.appImgUpload(imgBlob, string);
            }, 0);
          });
        })
      };

      $scope.taskPicture = function (string) {
        document.addEventListener("deviceready", function () {
          $cordovaCamera.getPicture(appService.getCameraOptions()).then(function (imageData) {
            var imgBase64 = "data:image/jpeg;base64," + imageData ;
            $timeout(function () {
              var imgBlob = getFileObject(imgBase64);
              $scope.appImgUpload(imgBlob, string);
            }, 0);
          });
        });
      };

      $scope.appImgUpload = function (blob, string) {
        var uuidString = rfc4122.v4();
        var last = '{.suffix}';
        var imgUrl = '/' + uuidString + last;
        upyun.set('save-key', imgUrl);
        upyun.upload(blob, function(err, response, image){
          if (err) console.error(err);
          console.log(image)
          if (image.code === 200 && image.message === 'ok') {
            if (string == 'cover') {
              $scope.coverImg = image.absUrl;
              $scope.$apply();
              console.log($scope.coverImg);
            }
            else {
              if (string == 'one') {
                $scope.carouselImgs.one = image.absUrl;
              }
              else if (string == 'two') {
                $scope.carouselImgs.two = image.absUrl;
              }
              else if (string == 'three') {
                $scope.carouselImgs.three = image.absUrl;
              }
              else if (string == 'four') {
                $scope.carouselImgs.four = image.absUrl;
              }
              $scope.$apply();
              console.log($scope.carouselImgs);
            }
          }
        });
      }
    }
    else {
      console.log('web');
      //choose img
      $scope.openFileDialog = function(string) {
        $scope.newString = string;
        ionic.trigger('click', {
          target: document.getElementById('file')
        });

        $(document).on("change", ".uploadImage", function(e){
          e.preventDefault();
          $timeout(function () {
            $scope.upload(string);
          })
        });
      };



      //upload image
      $scope.upload = function(string) {
        if ($scope.newString !== string) return;
        var uuidString = rfc4122.v4();
        var last = '{.suffix}';
        var imgUrl = '/' + uuidString + last;
        upyun.set('save-key', imgUrl);
        upyun.upload('uploadForm', function(err, response, image){
          if (err) console.error(err);
          if (image.code === 200 && image.message === 'ok') {
            if (string == 'cover') {
              $scope.coverImg = image.absUrl;
              $scope.$apply();
              console.log($scope.coverImg);
            }
            else {
              if (string == 'one') {
                $scope.carouselImgs.one = image.absUrl;
              }
              else if (string == 'two') {
                $scope.carouselImgs.two = image.absUrl;
              }
              else if (string == 'three') {
                $scope.carouselImgs.three = image.absUrl;
              }
              else if (string == 'four') {
                $scope.carouselImgs.four = image.absUrl;
              }
              console.log(string);
              $scope.$apply();
              console.log($scope.carouselImgs);
            }
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

    $scope.deleteImage = function (string) {
      $ionicPopup.confirm({
        title: '删除图片?',
        template: '您想要删除图片或更换图片?',
        buttons: [{ text: '取消' }, { text: '确认', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        console.log(res)
        if(res == 'ok') {
          if (string == 'cover') {
            $scope.coverImg = undefined;
          }
          else {
            if (string == 'one') {
              $scope.carouselImgs.one = undefined;
            }
            else if (string == 'two') {
              $scope.carouselImgs.two = undefined;
            }
            else if (string == 'three') {
              $scope.carouselImgs.three = undefined;
            }
            else if (string == 'four') {
              $scope.carouselImgs.four = undefined;
            }
          }
        }
      });
    };

  });