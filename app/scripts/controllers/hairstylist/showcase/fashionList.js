/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('FashionListCtrl', function ($scope, WD_URL, UID, noBackGoTo, $location, $state, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover, PAGE_SIZE, SortList, userGroup) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.isHairstylist = $location.path().indexOf('hairstylist') !== -1;
      $scope.isReceptionist = $location.path().indexOf('receptionist') !== -1;
    });
    $scope.noBackGoTo = noBackGoTo;
    $scope.userGroup = userGroup();
    $scope._ = _;
    $scope.UID = UID();

    var scrollList = listService.join5by2keyScrollList('fashion', 'hairstylist', 'receptionist', 'like', 'comment', 'uid', 'updateAtR');
    $scope.fashions = SortList(scrollList.list);
    scrollList.scrollRef.scroll.next(PAGE_SIZE);
    console.log($scope.fashions);

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

    $scope.showDetail = function (fashion) {
      console.log(fashion);
      if ($scope.isHairstylist) {
        $state.go('hairstylist.fashionDetail', {fashion: fashion, isHairstylist: true});
      }
      else if ($scope.isReceptionist) {
        $state.go('receptionist.fashionDetail', {fashion: fashion, isReceptionist: true});
      }
      else {
        $state.go('customer.fashionDetail', {fashion: fashion});
      }
    };

    $scope.addFashion = function () {
      if ($scope.isHairstylist) {
        $state.go('hairstylist.createEditFashion');
      }
      else {
        $state.go('receptionist.createEditFashion');
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