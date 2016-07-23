/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('EditProfileCtrl', function ($scope, UserProfile, noBackGoTo, upyun, rfc4122, $ionicLoading, ionicToast, listService, userGroup, UID, updateWidget, localStorageService) {
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
        var newProfile = updateWidget(userProfile)
        list[index] = newProfile;
        list.$save(index).then(function () {
          var userNew = localStorageService.cookie.get('user');
          userNew.userProfile = newProfile;
          localStorageService.cookie.set('user', userNew);
          console.log('yes');
          noBackGoTo('customer.account')
        });
      })

    };


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
          console.log($scope.image.url);
          $scope.userProfile.avatar = $scope.image.url;
        }
        $scope.$apply();
      });
    };

    // $scope.deleteImage = function () {
    //   $ionicPopup.confirm({
    //     title: '删除图片?',
    //     template: '您想要删除图片或更换图片?',
    //     buttons: [{ text: '取消' }, { text: '确认', type: 'button-positive', onTap: function(e) {return 'ok'}}]
    //   }).then(function(res) {
    //     console.log(res)
    //     if(res == 'ok') {
    //       $scope.image.url = "";
    //       $scope.image.ready = false;
    //     }
    //     else {}
    //   });
    // };

    
  });