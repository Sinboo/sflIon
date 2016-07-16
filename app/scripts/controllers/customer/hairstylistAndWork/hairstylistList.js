/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistListCtrl', function ($scope, $state, WD_URL, dataSetterGetter, $wilddogArray, allHairstylist, noBackGoTo, appModalService, listService, $ionicPopover) {
    $scope.noBackGoTo = noBackGoTo;
    $scope.rating = 4;
    $scope.hairstylists = dataSetterGetter.get('HairstylistList') ? dataSetterGetter.get('HairstylistList') : [];

    var loadUtil = allHairstylist.loadUtil();
    console.log(loadUtil);
    $scope.loadMore = function () {
      loadUtil.loadMore(function (data) {
        console.log(data, loadUtil.hasNext)
        angular.forEach(data, function (item) {
          $.each(item.slave, function (k, v) {
            if (k.indexOf('-') > -1) {
              item.hairstylist = v
            }
          })
        });
        $scope.hairstylists = $scope.hairstylists.concat(data);
        dataSetterGetter.set('HairstylistList', $scope.hairstylists);
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
    
    $scope.showDetail = function (hairstylist) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistDetailModal.html',
        'HairstylistDetailModalCtrl as vm',
        {hairstylist: [hairstylist]}
      ).then(function (val) {
        console.log(val)
        if (val) {
          appModalService.show(
            'templates/customer/salon/modal/priceListModal.html',
            'PriceListModalCtrl as vm',
            hairstylist
          ).then(function (val) {
            console.log(val);
            $state.go('createEditReservation', {reservation: {hairstylist: hairstylist, price: val}})
          })
        }
      })
    };

    $scope.chooseHairstylist = function (hairstylist) {
      console.log(hairstylist)
      appModalService.show(
        'templates/customer/salon/modal/priceListModal.html',
        'PriceListModalCtrl as vm',
        hairstylist
      ).then(function (val) {
        console.log(val);
        if (val) {
          $state.go('createEditReservation', {reservation: {hairstylist: hairstylist, price: val}})
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