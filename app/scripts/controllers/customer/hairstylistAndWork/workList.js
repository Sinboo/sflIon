/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkListCtrl', function ($scope, WD_URL, UID, noBackGoTo, $state, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover, PAGE_SIZE) {
    $scope.noBackGoTo = noBackGoTo;
    $scope._ = _;
    $scope.UID = UID();

    var scrollList = listService.join4by2keyScrollList('work', 'hairstylist', 'like', 'comment', 'hairstylistUid', 'updateAt');
    $scope.works = scrollList.list;
    scrollList.scrollRef.scroll.next(PAGE_SIZE);
    console.log($scope.works);

    // scrollList.ref.once('value', function(snap) {
    //   $scope.rawdata = snap.val();
    //   console.log($scope.rawdata);
    //   $scope.noMoreItemsAvailable = false;
    //   $scope.$apply();
    // });

    $scope.loadMore = function () {
      scrollList.scrollRef.scroll.next(PAGE_SIZE);
      // console.log(Object.keys($scope.rawdata).length);
      // if ($scope.works.length == Object.keys($scope.rawdata).length) {
      //   $scope.noMoreItemsAvailable = true;
      //   Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
      // }
      // $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    // $scope.doRefresh = function () {
    //   $scope.noMoreItemsAvailable = false;
    //   $scope.loadMore();
    // };
    //

    // $scope.works = [];
    // var loadUtil = new ListLoadMore('work', 'updateAt', 3);
    // console.log(loadUtil)
    // $scope.loadMore = function () {
    //   loadUtil.loadMore(function (data) {
    //     console.log(data)
    //     $scope.works = $scope.works.concat(data);
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
    // $scope.doRefresh();

    $scope.like = function (item) {
      var myLike = _.findWhere(_.values(item.slave2), {likerUid: UID()});
      var likeList = listService.list('like:'+item.$id);
      likeList.$loaded().then(function () {
        if (myLike) {
          var key = _.invert(item.slave2)[myLike];
          var index = likeList.$indexFor(key);
          likeList.$remove(index).then(function (ref) {
          })
        }
        else {
          var addLike = {};
          addLike.likerUid = UID();
          console.log(addLike, 'like');
          likeList.add(addLike)
        }
      })
    };

    $scope.showDetail = function (work) {
      appModalService.show(
        'templates/customer/salon/modal/workDetailModal.html',
        'WorkDetailModalCtrl as vm',
        {workId: work.$id, slave: work.master}
      ).then(function (val) {
        console.log(val);
        if (val) {
          $state.go('createEditReservation', {reservation: {work: val}})
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