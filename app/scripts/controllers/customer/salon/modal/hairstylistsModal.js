/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistsModalCtrl', function ($scope, WD_URL, UID, dataSetterGetter, $wilddogArray, allHairstylist, ListLoadMore, appModalService, parameters, listService, $ionicPopover, PAGE_SIZE) {
    var vm = this;
    $scope._ = _;
    $scope.UID = UID();
    vm.price = parameters ? parameters.price : null;
    vm.isReceptionist = parameters ? parameters.isReceptionist : null;
    $scope.rating = 4;
    var scrollList;

    if (vm.price && vm.price !== null) {
      scrollList = listService.join3ScrollList('hairstylistUnderPrice:'+vm.price.id, 'hairstylist', 'like', 'hairstylistUid', 'updateAt');
    }
    else {
      scrollList = listService.join4ScrollList('allHairstylist', 'hairstylist', 'like', 'customerOfHairstylist', 'hairstylistUid', 'updateAt');
    }
    vm.hairstylists = scrollList.list;
    console.log(vm.hairstylists);
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

    vm.showDetail = function (hairstylist) {
      if (!vm.isReceptionist) {
        appModalService.show(
          'templates/customer/salon/modal/hairstylistDetailModal.html',
          'HairstylistDetailModalCtrl as vm',
          {hairstylist: [hairstylist]}
        ).then(function (val) {
          if (val) {
            $scope.closeModal({hairstylist: hairstylist, choosedPrice: vm.price});
          }
        })
      }
    };


    
    vm.confirm = function(hairstylist) {
      $scope.closeModal({hairstylist: hairstylist, choosedPrice: vm.price});
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