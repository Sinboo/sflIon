/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('SquareListCtrl', function ($scope, WD_URL, UID, noBackGoTo, $state, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover, PAGE_SIZE, SortList) {
    $scope.noBackGoTo = noBackGoTo;
    $scope._ = _;
    $scope.UID = UID();

    var scrollList = listService.join5by2keyScrollList('square', 'hairstylist', 'customer', 'like', 'comment', 'uid', 'updateAtR');
    $scope.squares = SortList(scrollList.list);
    scrollList.scrollRef.scroll.next(PAGE_SIZE);
    console.log($scope.squares);

    $scope.loadMore = function () {
      scrollList.scrollRef.scroll.next(PAGE_SIZE);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.like = function (item) {
      var myLike = _.findWhere(_.values(item.slave3), {likerUid: UID()});
      var likeList = listService.list('like:'+item.$id);
      likeList.$loaded().then(function () {
        if (myLike) {
          var key = _.invert(item.slave3)[myLike];
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

    $scope.showDetail = function (square) {
      console.log(square);
      $state.go('hairstylist.squareDetail', {square: square, isHairstylist: true});
    };

    $scope.addSquare = function () {
      $state.go('hairstylist.createEditSquare');
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