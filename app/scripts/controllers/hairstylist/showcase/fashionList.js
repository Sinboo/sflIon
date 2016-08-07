/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('FashionListCtrl', function ($scope, WD_URL, UID, noBackGoTo, $state, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover, PAGE_SIZE) {
    $scope.noBackGoTo = noBackGoTo;
    $scope._ = _;
    $scope.UID = UID();

    var scrollList = listService.join4by2keyScrollList('work', 'hairstylist', 'like', 'comment', 'hairstylistUid', 'updateAtR');
    $scope.works = scrollList.list;
    scrollList.scrollRef.scroll.next(PAGE_SIZE);
    console.log($scope.works);

    $scope.loadMore = function () {
      scrollList.scrollRef.scroll.next(PAGE_SIZE);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

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
      console.log(work);
      var detailWork = {};
      detailWork.workId = work.$id;
      detailWork.slave1 = work.master;
      $state.go('hairstylist.workDetail', {work: detailWork, isHairstylist: true});
    };

    $scope.addWork = function () {
      $state.go('hairstylist.createEditWork');
      console.log('yes')
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