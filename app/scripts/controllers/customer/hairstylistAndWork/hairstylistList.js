/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistListCtrl', function ($scope, $rootScope, $state, WD_URL, UID, dataSetterGetter, $location, $wilddogArray, allHairstylist, noBackGoTo, appModalService, listService, $ionicPopover, PAGE_SIZE) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.isReceptionist = $location.path().indexOf('receptionist') !== -1;
    });
    $scope.noBackGoTo = noBackGoTo;
    $scope.rating = 4;
    $scope._ = _;
    $scope.UID = UID();

    var scrollList = listService.join3ScrollList('allHairstylist', 'hairstylist', 'like', 'hairstylistUid', 'updateAt');
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
      if (!$scope.isReceptionist) {
        $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist]});
      }
    };

    $scope.chooseHairstylist = function (hairstylist) {
      if (!$scope.isReceptionist) {
        $state.go('customer.priceList', {hairstylist: hairstylist});
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
    };

    // listService.list('hairstylist').$loaded().then(function (data) {
    //   console.log(data)
    //   angular.forEach(data, function (item) {
    //     listService.list('allHairstylist').add({hairstylistUid: _.values(item)[0].uid}).then(function () {
    //       console.log(_.values(item)[0].uid)
    //     })
    //   })
    // })
    
    
  });