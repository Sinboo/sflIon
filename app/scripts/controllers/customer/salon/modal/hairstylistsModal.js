/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistsModalCtrl', function ($scope, WD_URL, $wilddogArray, ListLoadMore, appModalService, parameters, listService, $ionicPopover) {
    var vm = this;
    vm.productId = parameters;
    vm.hairstylists = [];
    $scope.rating = 4;
    var loadUtil;

    if (vm.productId) {
      loadUtil = new ListLoadMore('productServer:'+ vm.productId, 'updateAt', 10);
      $scope.loadMore = function () {
        loadUtil.loadMore(function (data) {
          console.log(data)
          vm.hairstylists = vm.hairstylists.concat(data);
          if (data.length == 0) {
            $scope.noMoreItemsAvailable = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      };

      $scope.loadMore();
    }
    else {
      loadUtil = new ListLoadMore('users:hairstylist', 'updateAt', 10);
      $scope.loadMore = function () {
        loadUtil.loadMore(function (data) {
          console.log(data)
          vm.hairstylists = vm.hairstylists.concat(data);
          if (data.length == 0) {
            $scope.noMoreItemsAvailable = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      };

      $scope.loadMore();
    }



    
    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
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