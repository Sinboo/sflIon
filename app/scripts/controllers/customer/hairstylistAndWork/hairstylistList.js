/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistListCtrl', function ($scope, WD_URL, $wilddogArray, JoinListLoadMore, noBackGoTo, appModalService, listService, $ionicPopover) {
    $scope.noBackGoTo = noBackGoTo;
    $scope.hairstylists = [];
    $scope.rating = 4;

    var loadUtil = new JoinListLoadMore('allHairstylist', 'hairstylist', 'hairstylistUid', 'updateAt', 2);
    console.log(loadUtil)
    $scope.loadMore = function () {
      loadUtil.loadMore(function (data) {
        console.log(data)
        angular.forEach(data, function (item) {
          $.each(item.slave, function (k, v) {
            if (k.indexOf('-') > -1) {
              item.hairstylist = v
            }
          })
        });
        $scope.hairstylists = $scope.hairstylists.concat(data);
        if (data.length == 0) {
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    };

    $scope.loadMore();

    
    $scope.showDetail = function (hairstylist) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistDetailModal.html',
        'HairstylistDetailModalCtrl as vm',
        {hairstylist: [hairstylist]}
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