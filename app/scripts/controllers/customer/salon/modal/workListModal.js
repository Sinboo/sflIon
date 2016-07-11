/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkListModalCtrl', function ($scope, WD_URL, $wilddogArray, ListLoadMore, appModalService, parameters, listService, $ionicPopover) {
    var vm = this;
    vm.group = parameters;
    vm.works = [];
    console.log(vm.group)

    var loadUtil = new ListLoadMore('work:'+vm.group, 'updateAt', 3);
    $scope.loadMore = function () {
      loadUtil.loadMore(function (data) {
        console.log(data)
        vm.works = vm.works.concat(data);
        angular.forEach(vm.products, function (item) {
          listService.list('productServer:' + item.$id).$loaded().then(function (data) {
            item.productServer = data;
          })
        });
        if (data.length == 0) {
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    };

    $scope.loadMore();
    
    vm.showDetail = function (work) {
      appModalService.show(
        'templates/customer/salon/modal/workDetailModal.html',
        'WorkDetailModalCtrl as vm',
        work
      ).then(function (val) {
        console.log(val);
        if (val) {
          $scope.closeModal(work);
        }
      })
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