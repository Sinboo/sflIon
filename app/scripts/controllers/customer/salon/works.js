/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorksCtrl', function ($scope, $state, UID, WD_URL, $wilddogArray, JoinListLoadMore, dataSetterGetter, workOfGroup, appModalService, listService, $ionicPopover, PAGE_SIZE) {
    $scope._ = _;
    $scope.UID = UID();
    console.log(UID())
    $scope.group = $state.params.group;
    console.log($scope.group);

    var scrollList = listService.join4ScrollList('workOfGroup:'+$scope.group, 'work', 'like', 'comment', 'workId', 'updateAt');
    $scope.works = scrollList.list;
    console.log($scope.works);
    scrollList.scrollRef.scroll.next(PAGE_SIZE);

    $scope.loadMore = function () {
      scrollList.scrollRef.scroll.next(PAGE_SIZE);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.like = function (item) {
      var myLike = _.findWhere(_.values(item.slave2), {likerUid: UID()});
      var likeList = listService.list('like:'+item.workId);
      likeList.$loaded().then(function (data) {
        if (myLike) {
          var key = _.invert(item.slave2)[myLike];
          var index = likeList.$indexFor(key);
          likeList.$remove(index);
        }
        else {
          var addLike = {};
          addLike.likerUid = UID();
          console.log(addLike, 'like');
          likeList.add(addLike);
        }
      })
    };

    $scope.showDetail = function (work) {
      $state.go('customer.workDetail', {work: work});
    };
    
    $scope.confirm = function (work) {
      var work1 = {};
      work1.workId = work.workId;
      work1.slave = work.slave1;
      $state.go('customer.createEditReservation', {value: {work: work1}});
    }

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