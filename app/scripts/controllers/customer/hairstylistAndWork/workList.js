/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkListCtrl', function ($scope, WD_URL, noBackGoTo, $state, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover) {
    $scope.noBackGoTo = noBackGoTo;
    $scope.works = [];
    var loadUtil = new ListLoadMore('work', 'updateAt', 3);
    console.log(loadUtil)
    $scope.loadMore = function () {
      loadUtil.loadMore(function (data) {
        console.log(data)
        $scope.works = $scope.works.concat(data);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
      if (!loadUtil.hasNext) {
        $scope.noMoreItemsAvailable = true;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
      }
    };

    $scope.doRefresh = function () {
      $scope.noMoreItemsAvailable = false;
      $scope.loadMore();
    };
    $scope.doRefresh();

    $scope.showDetail = function (work) {
      appModalService.show(
        'templates/customer/salon/modal/workDetailModal.html',
        'WorkDetailModalCtrl as vm',
        {workId: work.$id, slave: work}
      ).then(function (val) {
        console.log(val);
        if (val) {
          $state.go('createEditReservation', {reservation: val})
        }
      })
    };

    $scope.openWorkGroupModal = function () {
      appModalService.show(
        'templates/customer/salon/modal/workGroupModal.html',
        'WorkGroupModalCtrl as vm'
      ).then(function (value) {
        console.log(value);
        if (value) {
          $state.go('createEditReservation', {reservation: {work: value}})
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
    }
    
    
  });