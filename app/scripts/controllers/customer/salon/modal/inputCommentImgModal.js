/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('InputCommentImgModalCtrl', function ($scope, parameters, upyun, rfc4122, $ionicLoading, $ionicPopup) {
    var vm = this;
    $scope.comment = {};
    $scope.comment.content = parameters;


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
          $scope.comment.imgUrl = $scope.image.url;
        }
        $scope.$apply();
      });
    };

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


    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };
    
    
  });