/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkListModalCtrl', function ($scope, WD_URL, $wilddogArray, JoinListLoadMore, dataSetterGetter, workOfGroup, appModalService, parameters, listService, $ionicPopover, PAGE_SIZE) {
    var vm = this;
    vm.group = parameters;
    console.log(vm.group);

    var scrollList = listService.joinScrollList('workOfGroup:'+vm.group, 'work', 'workId', 'updateAt');
    vm.works = scrollList.list;
    console.log(vm.works);
    scrollList.scrollRef.scroll.next(PAGE_SIZE);

    $scope.loadMore = function () {
      scrollList.scrollRef.scroll.next(PAGE_SIZE);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    
    // vm.works = dataSetterGetter.get('WorkListModal'+vm.group) ? dataSetterGetter.get('WorkListModal'+vm.group) : [];
    //
    // var loadUtil = workOfGroup.loadUtil(vm.group);
    // console.log(loadUtil);
    // $scope.loadMore = function () {
    //   console.log('yes', $scope.noMoreItemsAvailable);
    //   loadUtil.loadMore(function (data) {
    //     console.log(data);
    //     vm.works = vm.works.concat(data);
    //     dataSetterGetter.set('WorkListModal'+vm.group, vm.works);
    //     $scope.$broadcast('scroll.refreshComplete');
    //     $scope.$broadcast('scroll.infiniteScrollComplete');
    //   });
    //   if (!loadUtil.hasNext) {
    //     $scope.noMoreItemsAvailable = true;
    //     $scope.$broadcast('scroll.refreshComplete');
    //     $scope.$broadcast('scroll.infiniteScrollComplete');
    //     Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
    //   }
    // };
    //
    // $scope.doRefresh = function () {
    //   $scope.noMoreItemsAvailable = false;
    //   $scope.loadMore();
    // };
    //
    // $scope.doRefresh();
    

    vm.showDetail = function (work) {
      appModalService.show(
        'templates/customer/salon/modal/workDetailModal.html',
        'WorkDetailModalCtrl as vm',
        work
      ).then(function (val) {
        if (val) {
          $scope.closeModal(work);
        }
      })
    };


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