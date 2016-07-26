/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ConversationCtrl', function ($scope, $state, UserProfile, UID, listService, JoinList, $ionicPopover) {
    $scope.userProfile = UserProfile();
    $scope._ = _;


    $scope.conversations = JoinList('conversation:'+UID(), 'message', 'conversationId', 'updateAt');
    console.log($scope.conversations);

    $scope.greaterThan = function(prop, val){
      return function(item){
        return item[prop] > val;
      }
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