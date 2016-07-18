/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistsModalCtrl', function ($scope, WD_URL, UID, dataSetterGetter, $wilddogArray, allHairstylist, ListLoadMore, appModalService, parameters, listService, $ionicPopover) {
    var vm = this;
    vm.price = parameters ? parameters.price : null;
    $scope.rating = 4;
    var loadUtil;


    if (vm.price !== null) {
      vm.hairstylists = [];
      loadUtil = new ListLoadMore('hairstylistUnderPrice:'+vm.price.id, 'updateAt', 3);
      $scope.loadMore = function () {
        loadUtil.loadMore(function (data) {
          console.log(data);
          vm.hairstylists = vm.hairstylists.concat(data);
          angular.forEach(vm.hairstylists, function (item) {
            listService.list('hairstylist:'+item.hairstylistUid).$loaded().then(function (hairstylist) {
              item.hairstylist = hairstylist;
              item.choosedPrice = vm.price;
            });
            listService.list('like:'+item.hairstylistUid).$loaded().then(function (likes) {
              console.log(likes);
              item.likes = likes;
              angular.forEach(likes, function (like) {
                if (like.likerUid == UID()) {
                  item.myLike = like;
                  item.liked = true;
                }
              })
            })
          });
          if (data.length == 0) {
            $scope.noMoreItemsAvailable = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      };

      $scope.loadMore();
    }
    else {
      vm.hairstylists = dataSetterGetter.get('HairstylistList') ? dataSetterGetter.get('HairstylistList') : [];
      var hList = listService.list('hairstylistOfCustomer:'+UID());
      angular.forEach(vm.hairstylists, function (item) {
        var likeFlag = false;
        listService.list('like:'+item.hairstylistUid).$loaded().then(function (likes) {
          console.log(likes);
          item.likes = likes;
          angular.forEach(likes, function (like) {
            if (like.likerUid == UID()) {
              item.myLike = like;
              item.liked = true;
              likeFlag = true;
            }
          });
          if (!likeFlag) {
            if (item.liked = true) {
              item.myLike = undefined;
              item.liked = undefined;
            }
          }
        });

        var flag = false;
        hList.$loaded().then(function (data) {
          angular.forEach(data, function (h) {
            if (h.hairstylistUid == item.hairstylistUid) {
              item.isContact = true;
              flag = true
            }
          });
          if (!flag) {
            if (item.isContact = true) {
              item.isContact = undefined;
            }
          }
        });
      });

      console.log(dataSetterGetter.get('HairstylistList'), vm.hairstylists);
      loadUtil = allHairstylist.loadUtil();
      console.log(loadUtil);
      $scope.loadMore = function () {
        loadUtil.loadMore(function (data) {
          console.log(data, loadUtil.hasNext)
          angular.forEach(data, function (item) {
            $.each(item.slave, function (k, v) {
              if (k.indexOf('-') > -1) {
                item.hairstylist = v
              }
            });
            listService.list('hairstylistOfCustomer:'+UID()).$loaded().then(function (data) {
              angular.forEach(data, function (h) {
                if (h.hairstylistUid == item.hairstylistUid) {
                  item.isContact = true;
                }
              })
            })
          });
          vm.hairstylists = vm.hairstylists.concat(data);
          dataSetterGetter.set('HairstylistList', vm.hairstylists);
          angular.forEach(vm.hairstylists, function (item) {
            listService.list('like:'+item.hairstylistUid).$loaded().then(function (likes) {
              console.log(likes);
              item.likes = likes;
              angular.forEach(likes, function (like) {
                if (like.likerUid == UID()) {
                  item.myLike = like;
                  item.liked = true;
                }
              })
            })
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        if (!loadUtil.hasNext) {
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
        }
      };
      $scope.loadMore();
    }



    vm.like = function (hairstylist) {
      var likeList = listService.list('like:'+hairstylist.hairstylistUid);
      likeList.$loaded().then(function () {
        if (hairstylist.liked == true) {
          hairstylist.liked = false;
          var index = likeList.$indexFor(hairstylist.myLike.$id);
          likeList.$remove(index).then(function (ref) {
            initLike();
          })
        }
        else {
          hairstylist.liked = true;
          hairstylist.myLike = {};
          hairstylist.myLike.likerUid = UID();
          console.log(hairstylist.myLike, 'like');
          likeList.add(hairstylist.myLike).then(function (data) {
            initLike();
          });
        }
      })
    };

    var initLike = function () {
      angular.forEach(vm.hairstylists, function (item) {
        listService.list('like:'+item.hairstylistUid).$loaded().then(function (likes) {
          console.log(likes);
          item.likes = likes;
          angular.forEach(likes, function (like) {
            if (like.likerUid == UID()) {
              item.myLike = like;
              item.liked = true;
            }
          })
        })
      })
    };

    
    vm.showDetail = function (hairstylist) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistDetailModal.html',
        'HairstylistDetailModalCtrl as vm',
        hairstylist
      ).then(function (val) {
        if (val) {
          $scope.closeModal(hairstylist);
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