/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonContactCtrl', function ($scope, $state, noBackGoTo, rfc4122, appModalService, listService, JoinList, UID, UserProfile, $ionicPopup, $ionicPopover) {
    $scope.goTo = noBackGoTo;
    $scope._ = _;
    $scope.userProfile = UserProfile();

    $scope.contacts = JoinList('hairstylistOfCustomer:'+UID(), 'hairstylist', 'hairstylistUid', 'updateAt');
    console.log($scope.contacts);

    $scope.openHairstylist = function () {
      $state.go('customer.hairstylists');
    };

    $scope.showDetail = function (hairstylist) {
      $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist]});
    };
    
    $scope.deleteContact = function (contact) {
      var confirmPopup = $ionicPopup.confirm({
        title: '删除联系人?',
        template: '您确定要删除此联系人吗?',
        cancelText: '取消',
        okText: '确定',
        okType: 'button-balanced'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log(contact)
          var list1 = listService.list('hairstylistOfCustomer:'+UID());
          list1.$loaded().then(function () {
            var deletingContact = list1.$indexFor(contact.$id);
            list1.$remove(deletingContact);
          });
          var list2 = listService.list('customerOfHairstylist:'+contact.hairstylistUid);
          list2.$loaded().then(function (data) {
            var customerOfHairstylist = _.findWhere(data, {customerUid: UID()});
            var key = customerOfHairstylist.$id;
            console.log(customerOfHairstylist, key)
            var deletingContact = list2.$indexFor(key);
            list2.$remove(deletingContact);
          });
        }
      });
    };

    $scope.openConversation = function (hairstylist) {
      var flag = false;
      var conversationList = listService.list('conversation:'+UID());
      var conversationList2 = listService.list('conversation:'+hairstylist.uid);
      conversationList.$loaded().then(function (data) {
        angular.forEach(data, function (item) {
          if (item.recipientId == hairstylist.uid) {
            $state.go('customer.chat', {conversation: item});
            flag = true;
          }
        });
        if (!flag) {
          var conversation = {};
          conversation.conversationId = rfc4122.v4();
          conversation.recipientId = hairstylist.uid;
          conversation.recipientName = hairstylist.name;
          conversation.recipientAvatar = hairstylist.avatar;
          conversation.recipientMobile = hairstylist.mobile;
          conversation = JSON.parse(JSON.stringify(conversation));
          var conversation2 = {};
          conversation2.conversationId = conversation.conversationId;
          conversation2.recipientId = UID();
          conversation2.recipientName = $scope.userProfile.name;
          conversation2.recipientAvatar = $scope.userProfile.avatar;
          conversation2.recipientMobile = $scope.userProfile.mobile;
          conversation2.lastLeaveAt = 0;
          conversation2 = JSON.parse(JSON.stringify(conversation2));
          conversationList2.add(conversation2).then(function () {
            conversationList.add(conversation).then(function () {
              console.log(conversation);
              $state.go('customer.chat', {conversation: conversation});
            })
          })
        }
      });
    };

    $ionicPopover.fromTemplateUrl('templates/common/pop/searchTemplate.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.searchPopover = popover;
    });

    $scope.getSearch = function (search) {
      $scope.searchFilter = search;
    };
    $scope.closeSearch = function () {
      $scope.searchPopover.hide();
      $scope.getSearch();
      $scope.searchItem = '';
    }

  });