/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistListCtrl', function ($scope, $state, WD_URL, UID, dataSetterGetter, $wilddogArray, allHairstylist, noBackGoTo, appModalService, listService, $ionicPopover, PAGE_SIZE) {
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



    // $scope.hairstylists = dataSetterGetter.get('HairstylistList') ? dataSetterGetter.get('HairstylistList') : [];
    // angular.forEach($scope.hairstylists, function (item) {
    //   var likeFlag = false;
    //   listService.list('like:' + item.hairstylistUid).$loaded().then(function (likes) {
    //     console.log(likes);
    //     item.likes = likes;
    //     angular.forEach(likes, function (like) {
    //       if (like.likerUid == UID()) {
    //         item.myLike = like;
    //         item.liked = true;
    //         likeFlag = true;
    //       }
    //     });
    //     if (!likeFlag) {
    //       if (item.liked = true) {
    //         item.myLike = undefined;
    //         item.liked = undefined;
    //       }
    //     }
    //   });
    // });
    //
    // var loadUtil = allHairstylist.loadUtil();
    // console.log(loadUtil);
    // $scope.loadMore = function () {
    //   loadUtil.loadMore(function (data) {
    //     console.log(data, loadUtil.hasNext)
    //     angular.forEach(data, function (item) {
    //       $.each(item.slave, function (k, v) {
    //         if (k.indexOf('-') > -1) {
    //           item.hairstylist = v
    //         }
    //       })
    //     });
    //     $scope.hairstylists = $scope.hairstylists.concat(data);
    //     dataSetterGetter.set('HairstylistList', $scope.hairstylists);
    //     angular.forEach($scope.hairstylists, function (item) {
    //       listService.list('like:'+item.hairstylistUid).$loaded().then(function (likes) {
    //         item.likes = likes;
    //         angular.forEach(likes, function (like) {
    //           if (like.likerUid == UID()) {
    //             item.myLike = like;
    //             item.liked = true;
    //           }
    //         })
    //       })
    //     });
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

    //
    // $scope.like = function (hairstylist) {
    //   var likeList = listService.list('like:'+hairstylist.hairstylistUid);
    //   likeList.$loaded().then(function () {
    //     if (hairstylist.liked == true) {
    //       hairstylist.liked = false;
    //       var index = likeList.$indexFor(hairstylist.myLike.$id);
    //       likeList.$remove(index).then(function (ref) {
    //         initLike();
    //       })
    //     }
    //     else {
    //       hairstylist.liked = true;
    //       hairstylist.myLike = {};
    //       hairstylist.myLike.likerUid = UID();
    //       console.log(hairstylist.myLike, 'like');
    //       likeList.add(hairstylist.myLike).then(function (data) {
    //         initLike();
    //       });
    //     }
    //   })
    // };
    //
    // var initLike = function () {
    //   angular.forEach($scope.hairstylists, function (item) {
    //     listService.list('like:'+item.hairstylistUid).$loaded().then(function (likes) {
    //       console.log(likes);
    //       item.likes = likes;
    //       angular.forEach(likes, function (like) {
    //         if (like.likerUid == UID()) {
    //           item.myLike = like;
    //           item.liked = true;
    //         }
    //       })
    //     })
    //   })
    // };
    
    $scope.showDetail = function (hairstylist) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistDetailModal.html',
        'HairstylistDetailModalCtrl as vm',
        {hairstylist: [hairstylist]}
      ).then(function (val) {
        console.log(val)
        if (val) {
          appModalService.show(
            'templates/customer/salon/modal/priceListModal.html',
            'PriceListModalCtrl as vm',
            hairstylist
          ).then(function (val) {
            console.log(val);
            $state.go('createEditReservation', {reservation: {hairstylist: hairstylist, price: val}})
          })
        }
      })
    };

    $scope.chooseHairstylist = function (hairstylist) {
      console.log(hairstylist)
      appModalService.show(
        'templates/customer/salon/modal/priceListModal.html',
        'PriceListModalCtrl as vm',
        hairstylist
      ).then(function (val) {
        console.log(val);
        if (val) {
          $state.go('createEditReservation', {reservation: {hairstylist: hairstylist, price: val}})
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