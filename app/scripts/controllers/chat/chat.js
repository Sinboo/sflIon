/**
 * Created by wxb on 16/7/24.
 */
'use strict';
angular.module('sflIon')
  .controller('ChatCtrl', function ($scope, $state, listService, $ionicScrollDelegate, UID, UserProfile, upyun, rfc4122, $ionicLoading, $ionicActionSheet, $cordovaCamera, $timeout, appService, getFileObject, appModalService){
    $scope.UID = UID();
    $scope.userProfile = UserProfile();
    $scope.conversation = $state.params.conversation;
    console.log($scope.conversation);

    var list = listService.list('conversation:'+UID());
    $scope.$on("$ionicView.enter", function(event, data){
      list.$loaded().then(function (data) {
        angular.forEach(data, function (item) {
          if (item.conversationId == $scope.conversation.conversationId) {
            item.isInRoom = true;
            list.$save(item);
          }
        })
      })
    });

    $scope.$on("$ionicView.leave", function(event, data){
      list.$loaded().then(function (data) {
        angular.forEach(data, function (item) {
          if (item.conversationId == $scope.conversation.conversationId) {
            item.lastLeaveAt = new Date().getTime();
            item.isInRoom = false;
            list.$save(item);
          }
        })
      })
    });

    var footerBar, scroller;
    var viewScroll = $ionicScrollDelegate.$getByHandle('chatScroll');
    appService.Loading('show');

    $scope.messages = listService.list('message:'+$scope.conversation.conversationId);
    $scope.messages.$ref().on('value', function () {
      $timeout(function () {
        appService.Loading();
      }, 250);

      $timeout(function () {
        viewScroll.scrollBottom(true);
        footerBar = document.body.querySelector('#chat .uploadImage');
        scroller = document.body.querySelector('#chat .scroll-content');
      }, 0);
    });

    var recipientId = $scope.conversation.recipientId || $scope.conversation.master.recipientId;
    var msgNotificationList = listService.list('msgNotification:' + recipientId);

    $scope.conversationList = listService.list('conversation:'+recipientId);
    $scope.conversationList.$watch(function (event) {
      $scope.leavedConversation = $scope.conversationList.$getRecord(event.key);
      if ($scope.leavedConversation.recipientId == UID()) {
        $scope.recipientLeavedAt = $scope.leavedConversation.lastLeaveAt;
        $scope.isInRoom = $scope.leavedConversation.isInRoom;
      }
    });

    $scope.sendChat = function (text) {
      if (text) {
        $scope.newMessage = {};
        $scope.newMessage.text = text;
        $scope.newMessage.sendToUid = $scope.conversation.recipientId || $scope.conversation.master.recipientId;
        $scope.messages.add($scope.newMessage).then(function (ref) {
          var sentMsg = $scope.messages.$getRecord(ref.key());
          console.log($scope.isInRoom);
          if (!$scope.isInRoom && sentMsg.createAt > $scope.recipientLeavedAt) {
            var msgNoti = {};
            msgNoti.content = $scope.newMessage.text;
            msgNoti.senderName = $scope.userProfile.name;
            msgNoti.sendAt = sentMsg.createAt;
            msgNoti.conversation = $scope.leavedConversation;
            msgNotificationList.$add(msgNoti).then(function () {
              $scope.newMessage = {};
            })
          }
        });
        $scope.input = "";
      }
    };

    //mac cmd + enter, win ctrl + enter to next line, enter to submit
    var map = ionic.Platform.platform().indexOf('mac') !== -1 ? {13: false, 93: false} : {13: false, 17: false};
    $scope.keydown = function(e, input) {
      if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[13] && map[93]) {
          $scope.input = input + '\n';
        }
        else if (e.keyCode == 13) {
          $scope.sendChat(input)
        }
      }
    };
    $scope.keyup = function(e) {
      for (var key in map) {
        map[key] = false;
      }
    };


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
        $scope.newMessage = {};
        appService.Loading('show');
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
            console.log($scope.image.url);
            $scope.newMessage.imgUrl = $scope.image.url;
            $scope.newMessage.sendToUid = $scope.conversation.recipientId || $scope.conversation.master.recipientId;
            $timeout(function () {
              appService.Loading();
              appModalService.show(
                'templates/chat/modal/inputChatImgModal.html',
                'InputChatImgModalCtrl as vm',
                $scope.newMessage.imgUrl
              ).then(function (value) {
                if (value) {
                  $scope.messages.add($scope.newMessage).then(function (ref) {
                    $scope.newMessage = {};
                    if (!$scope.isInRoom) {
                      var msgNoti = {};
                      msgNoti.content = '发来一张图片,请到其对话页面查看';
                      msgNoti.senderName = $scope.userProfile.name;
                      msgNoti.sendAt = new Date().getTime();
                      msgNoti.conversation = $scope.leavedConversation;
                      msgNotificationList.$add(msgNoti)
                    }
                  });
                }
              });
            }, 0);
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
        e.stopPropagation();
        e.preventDefault();
        $scope.upload();
      });

      //upload image
      $scope.upload = function() {
        console.log('yes')
        $scope.newMessage = {};
        appService.Loading('show');
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
            $scope.newMessage.imgUrl = $scope.image.url;
            $scope.newMessage.sendToUid = $scope.conversation.recipientId || $scope.conversation.master.recipientId;
            $timeout(function () {
              appService.Loading();
              appModalService.show(
                'templates/chat/modal/inputChatImgModal.html',
                'InputChatImgModalCtrl as vm',
                $scope.newMessage.imgUrl
              ).then(function (value) {
                if (value) {
                  $scope.messages.add($scope.newMessage).then(function (ref) {
                    $scope.newMessage = {};
                    if (!$scope.isInRoom) {
                      var msgNoti = {};
                      msgNoti.content = '发来一张图片,请点击查看';
                      msgNoti.senderName = $scope.userProfile.name;
                      msgNoti.sendAt = new Date().getTime();
                      msgNoti.conversation = $scope.leavedConversation;
                      msgNotificationList.$add(msgNoti)
                    }
                  });
                }
              });
            }, 0);
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