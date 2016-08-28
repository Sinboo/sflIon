/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('MaintainCustomerCtrl', function ($scope, $state, UserProfile, noBackGoTo, $location, upyun, rfc4122, $ionicLoading, ionicToast, listService, userGroup, UID, updateWidget, localStorageService, $ionicActionSheet, $cordovaCamera, $timeout, appService, getFileObject, CUSTOMER_LEVEL) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.isHairstylist = $location.path().indexOf('hairstylist') !== -1;
      $scope.isReceptionist = $location.path().indexOf('receptionist') !== -1;
    });
    var o1 = {}; var o2 = {};
    $scope.noBackGoTo = noBackGoTo;
    $scope.userGroup = userGroup();
    $scope.customerUid = $state.params.customer.uid;
    var customerProfile = $state.params.customer;
    console.log($scope.customerUid);
    $scope.customerMaintain = listService.list('customerMaintain:'+$scope.customerUid);
    console.log($scope.customerMaintain);


    $scope.customerMaintain.$loaded().then(function (data) {
      if (data.length == 0) {
        listService.list('customer:'+$scope.customerUid).$loaded().then(function (customer) {
          $scope.customerMaintain.$add(data[0]);
          angular.copy(customer[0], o1);
        })
      }
      else {
        angular.copy(data[0], o1);
        $scope.hairstylist = listService.list('hairstylist:'+ data[0].updateById);
        $scope.receptionist = listService.list('receptionist:'+ data[0].updateById);
      }
    });


    $scope.genderList = [
      { text: "男", value: "male" },
      { text: "女", value: "female" }
    ];
    
    $scope.customerLevels = CUSTOMER_LEVEL;
    
    

    $scope.mustInputErrorTips = {
      required: '请填写必填项',
      // minlength: 'This field does not match the min length',
      // maxlength: 'This field does not match the max length',
      pattern: '手机号不对'
      // number: 'This field should be a number'
    };

    $scope.validate = function (userProfile) {
      if (!userProfile.avatar) {ionicToast.show('请上传头像!', 'top', false, 2000);return false;}
      if (!userProfile.gender) {ionicToast.show('请选择性别!', 'middle', false, 2000);return false;}
      return true;
    };

    $scope.save = function (customerMaintain) {
      angular.copy(customerMaintain, o2);
      var changeParts = _.omit(o2, function(v,k) { return o1[k] === v; });
      console.log(changeParts);
      listService.list('customerMaintainDetail:'+customerMaintain.$id).add(changeParts);
      $scope.customerMaintain.save(customerMaintain).then(function () {
        if ($scope.isHairstylist) {
          $state.go('hairstylist.customerDetail', {customer: [customerProfile], type: 2})
        }
        else if ($scope.isReceptionist) {
          $state.go('receptionist.customerDetail', {customer: [customerProfile], type: 2})
        }
      });
    };

    var isCordovaApp = !!window.cordova;
    if ( isCordovaApp ) {
      console.log('app');
      $scope.openFileDialog = function (customerMaintain) {
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
              $scope.readalbum(customerMaintain);
            } else if (index == 0) {
              $scope.taskPicture(customerMaintain);
            }
            return true;
          }
        });
      };

      $scope.readalbum = function(customerMaintain) {
        document.addEventListener("deviceready", function () {
          $cordovaCamera.getPicture(appService.getLibraryOptions()).then(function (imageData) {
            var imgBase64 = "data:image/jpeg;base64," + imageData ;
            $timeout(function () {
              var imgBlob = getFileObject(imgBase64);
              $scope.appImgUpload(imgBlob, customerMaintain);
            }, 0);
          });
        })
      };

      $scope.taskPicture = function (customerMaintain) {
        document.addEventListener("deviceready", function () {
          $cordovaCamera.getPicture(appService.getCameraOptions()).then(function (imageData) {
            var imgBase64 = "data:image/jpeg;base64," + imageData ;
            $timeout(function () {
              var imgBlob = getFileObject(imgBase64);
              $scope.appImgUpload(imgBlob, customerMaintain);
            }, 0);
          });
        });
      };

      $scope.appImgUpload = function (blob, customerMaintain) {
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
            customerMaintain.realImage = $scope.image.url;
            $scope.$apply();
            console.log($scope.image.url);
          }
        });
      }
    }
    else {
      console.log('web');
      //choose img
      $scope.openFileDialog = function(customerMaintain) {
        ionic.trigger('click', {
          target: document.getElementById('file')
        });

        $(document).on("change", ".uploadImage", function(e){
          e.preventDefault();
          $scope.upload(customerMaintain);
        });
      };



      //upload image
      $scope.upload = function(customerMaintain) {
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
            customerMaintain.realImage = $scope.image.url;
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