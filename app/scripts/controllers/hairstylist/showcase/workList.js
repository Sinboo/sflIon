/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistWorkListCtrl', function ($scope, WD_URL, UID, noBackGoTo, $location, $state, $wilddogArray, ListLoadMore, appModalService, listService, $ionicPopover, PAGE_SIZE, WORK_GROUP2, SortList, userGroup) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.isHairstylist = $location.path().indexOf('hairstylist') !== -1;
      $scope.isReceptionist = $location.path().indexOf('receptionist') !== -1;
    });
    $scope.noBackGoTo = noBackGoTo;
    $scope.userGroup = userGroup();
    $scope._ = _;
    $scope.UID = UID();
    $scope.WORK_GROUP = WORK_GROUP2;

    var scrollList = listService.join5by3keyScrollList('work', 'hairstylist', 'like', 'comment', 'receptionist', 'hairstylistUid', 'createById', 'updateAtR');
    $scope.works = SortList(scrollList.list);
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
      if ($scope.isHairstylist) {
        $state.go('hairstylist.workDetail', {work: detailWork, isHairstylist: true});
      }
      else {
        $state.go('receptionist.workDetail', {work: detailWork, isReceptionist: true});
      }
    };

    $scope.openWorkGroup = function () {
      if ($scope.isHairstylist) {
        $state.go('hairstylist.workGroup', {isHairstylist: true});
      }
      else {
        $state.go('receptionist.workGroup', {isReceptionist: true});
      }
    };

    $scope.addWork = function () {
      if ($scope.isHairstylist) {
        $state.go('hairstylist.createEditWork');
      }
      else {
        $state.go('receptionist.createEditWork');
      }
    };

    $scope.chooseWorkGroup = function (group) {
      if ($scope.isHairstylist) {
        $state.go('hairstylist.works', {group: group})
      }
      else {
        $state.go('receptionist.works', {group: group})
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