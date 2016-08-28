/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('HairstylistManageCtrl', function ($scope, $rootScope, $state, noBackGoTo, listService, JoinList, appModalService, $ionicPopover, $ionicPopup, UID, updateWidget) {
    $scope.goTo = noBackGoTo;
    $scope._ = _;

    $scope.hairstylists = listService.list('hairstylist');
    $scope.allHairstylist = listService.list('allHairstylist');
    console.log($scope.hairstylists, $scope.allHairstylist);

    $scope.manageHairstylist = function (hairstylist) {
      $state.go('receptionist.manageHairstylist', {hairstylist: hairstylist});
    };

    $scope.removeHairstylist = function (hairstylistUid) {
      console.log(hairstylistUid)
      $ionicPopup.confirm({
        title: '取消启用',
        template: '确定取消启用该发型师?',
        buttons: [{ text: '否' }, { text: '是', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        if (res) {
          $scope.allHairstylist.$loaded(function (data) {
            var hairstylist = _.findWhere(data, {hairstylistUid: hairstylistUid});
            var index = $scope.allHairstylist.$indexFor(hairstylist.$id);
            $scope.allHairstylist.$remove(index).then(function () {
              console.log('delete', hairstylistUid);
            });
          })
        }
      })
    };

    $scope.addHairstylist = function (hairstylistUid) {
      console.log(hairstylistUid)
      $ionicPopup.confirm({
        title: '确定启用',
        template: '确定启用该发型师?',
        buttons: [{ text: '否' }, { text: '是', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        if (res) {
          $scope.allHairstylist.$loaded(function (data) {
            $scope.allHairstylist.add({hairstylistUid: hairstylistUid}).then(function () {
              console.log('add', hairstylistUid);
            });
          })
        }
      })
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
    };


  });