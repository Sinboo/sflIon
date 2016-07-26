/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CustomerSideMenuCtrl', function ($scope, $state, UserProfile, UID, WD_URL, localStorageService, listService, ionicToast) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.userProfile = UserProfile();
    });

    if (localStorageService.cookie.get('user')) {
      var currentPlatform = ionic.Platform.platform();
      var connection = new Wilddog(WD_URL + 'connection');
      var myConnectionsRef = new Wilddog(WD_URL + 'connection/' + UID());
      var lastOnlineRef = new Wilddog(WD_URL + 'lastOnline/' + UID());
      var connectedRef = new Wilddog(WD_URL + '.info/connected');
      connectedRef.on('value', function(snap) {
        if (snap.val() === true) {
          var connectionInfo = {};
          connectionInfo.platform = currentPlatform;
          var con = myConnectionsRef.push(connectionInfo);
          con.onDisconnect().remove();
          lastOnlineRef.onDisconnect().set(Wilddog.ServerValue.TIMESTAMP);
        }
      });

      connection.on("value", function(snap) {
        console.log("# of online users = " + _.size(snap));
      });

      var conversation = {};
      var msgNotificationList = listService.list('msgNotification:' + UID());
      msgNotificationList.$watch(function (event) {
        var msgNoti = msgNotificationList.$getRecord(event.key);
        if (msgNoti) {
          conversation = msgNoti.conversation;
          ionicToast.show(msgNoti.senderName + ':' + msgNoti.content, 'top', false, 5000);
        }
        msgNotificationList.$remove(msgNoti);
      })

    }

    $(document).on('click', '.ionic_toast', function() {
      $state.go('customer.chat', {conversation: conversation});
    });

  });