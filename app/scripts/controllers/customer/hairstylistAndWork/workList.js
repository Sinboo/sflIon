/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkListCtrl', function ($scope, WD_URL, noBackGoTo, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover) {
    $scope.noBackGoTo = noBackGoTo;
    $scope.works = [];
    var loadUtil = new ListLoadMore('work', 'updateAt', 3);
    console.log(loadUtil)
    $scope.loadMore = function () {
      loadUtil.loadMore(function (data) {
        console.log(data)
        $scope.works = $scope.works.concat(data);
        if (data.length == 0) {
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    };

    $scope.loadMore();
    
    $scope.showDetail = function (work) {
      appModalService.show(
        'templates/customer/salon/modal/workDetailModal.html',
        'WorkDetailModalCtrl as vm',
        {workId: work.$id, slave: work}
      )
    };

    $scope.openWorkGroupModal = function () {
      appModalService.show(
        'templates/customer/salon/modal/workGroupModal.html',
        'WorkGroupModalCtrl as vm'
      )
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