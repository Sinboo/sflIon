/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistsCtrl', function ($scope, $state, WD_URL, UID, dataSetterGetter, $wilddogArray, allHairstylist, ListLoadMore, appModalService, listService, $ionicPopover, PAGE_SIZE) {
    $scope._ = _;
    $scope.UID = UID();
    $scope.rating = 4;
    $scope.price = $state.params.price ? $state.params.price : null;
    console.log($state.params)
    var scrollList;

    if ($scope.price !== null) {
      scrollList = listService.join3ScrollList('hairstylistUnderPrice:'+$scope.price.id, 'hairstylist', 'like', 'hairstylistUid', 'updateAt');
    }
    else {
      scrollList = listService.join4ScrollList('allHairstylist', 'hairstylist', 'like', 'customerOfHairstylist', 'hairstylistUid', 'updateAt');
    }
    $scope.hairstylists = scrollList.list;
    console.log($scope.hairstylists);
    scrollList.scrollRef.scroll.next(PAGE_SIZE);
    
    $scope.loadMore = function () {
      scrollList.scrollRef.scroll.next(PAGE_SIZE);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.like = function (item) {
      var myLike = _.findWhere(_.values(item.slave2), {likerUid: UID()});
      var likeList = listService.list('like:'+item.hairstylistUid);
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

    $scope.showDetail = function (hairstylist) {
      $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist], choosedPrice: $scope.price});
    };
    
    $scope.confirm = function(hairstylist) {
      if ($scope.price) {
        $state.go('customer.createEditReservation', {value: {hairstylist: hairstylist, choosedPrice: $scope.price}});
      }
      else {
        listService.list('hairstylistOfCustomer:'+UID()).$add({hairstylistUid: hairstylist.uid});
        listService.list('customerOfHairstylist:'+hairstylist.uid).$add({customerUid: UID()});
        $state.go('customer.salonContact');
      }
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