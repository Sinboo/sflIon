/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('HairstylistSalonContactCtrl', function ($scope, $state, noBackGoTo, rfc4122, appModalService, listService, JoinList, UID, UserProfile, $ionicPopup, $ionicPopover) {
    $scope.goTo = noBackGoTo;
    $scope._ = _;
    $scope.userProfile = UserProfile();

    $scope.contacts = JoinList('customerOfHairstylist:'+UID(), 'customer', 'customerUid', 'updateAt');
    console.log($scope.contacts);

    $scope.showDetail = function (customer) {
      $state.go('hairstylist.customerDetail', {customer: [customer]});
    };

    $scope.maintainContact = function (customer) {
      $state.go('hairstylist.maintainCustomer', {customer: customer});
    };

    $scope.openConversation = function (customer) {
      var flag = false;
      var conversationList = listService.list('conversation:'+UID());
      var conversationList2 = listService.list('conversation:'+customer.uid);
      conversationList.$loaded().then(function (data) {
        angular.forEach(data, function (item) {
          if (item.recipientId == customer.uid) {
            $state.go('hairstylist.chat', {conversation: item});
            flag = true;
          }
        });
        if (!flag) {
          var conversation = {};
          conversation.conversationId = rfc4122.v4();
          conversation.recipientId = customer.uid;
          conversation.recipientName = customer.name;
          conversation.recipientAvatar = customer.avatar;
          conversation.recipientMobile = customer.mobile;
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
              $state.go('hairstylist.chat', {conversation: conversation});
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