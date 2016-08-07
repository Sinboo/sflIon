/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkDetailCtrl', function ($scope, $state, UID, userGroup, createWidget, $wilddogArray, listService, Join3List) {
    $scope._ = _;
    $scope.UID = UID();
    $scope.work = $state.params.work;
    $scope.isHairstylist = $state.params.isHairstylist;
    console.log($scope.work, userGroup());

    $scope.hairstylist = listService.list('hairstylist:'+$scope.work.slave1.hairstylistUid);

    $scope.comments = Join3List('comment:'+$scope.work.workId, 'customer', 'hairstylist', 'commenerUid', 'updateAt');

    $scope.likes = Join3List('like:'+$scope.work.workId, 'customer', 'hairstylist', 'likerUid', 'updateAt');

    $scope.like = function () {
      var likeList = listService.list('like:'+$scope.work.workId);
      likeList.$loaded().then(function (data) {
        var myLike = _.findWhere(data, {likerUid: UID()});
        console.log(data, myLike);
        if (myLike) {
          var index = likeList.$indexFor(myLike.$id);
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

    if ($scope.isHairstylist) {
      $scope.openComment = function (workId, choosedLike) {
        $state.go('hairstylist.comment', {workId: workId, choosedLike: choosedLike});
      };
      $scope.showHairstylistDetail = function (hairstylist) {
        $state.go('hairstylist.hairstylistDetail', {hairstylist: [hairstylist], isHairstylist: true});
      };
    }
    else {
      $scope.openComment = function (workId, choosedLike) {
        $state.go('customer.comment', {workId: workId, choosedLike: choosedLike});
      };
      $scope.showHairstylistDetail = function (hairstylist) {
        $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist], isHairstylist: true});
      };
    }



    $scope.confirm = function(work) {
      var work1 = {};
      work1.workId = work.workId;
      work1.slave = work.slave1;
      $state.go('customer.createEditReservation', {value: {work: work1}});
    };


    
  });