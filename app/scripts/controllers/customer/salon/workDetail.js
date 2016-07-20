/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkDetailCtrl', function ($scope, $state, UID, userGroup, createWidget, $wilddogArray, listService, JoinList, appModalService) {
    $scope._ = _;
    $scope.UID = UID();
    $scope.work = $state.params.work;
    console.log($scope.work, userGroup());

    $scope.hairstylist = listService.list('hairstylist:'+$scope.work.slave1.hairstylistUid);

    $scope.comments = JoinList('comment:'+$scope.work.workId, userGroup(), 'commenerUid', 'updateAt');

    $scope.likes = JoinList('like:'+$scope.work.workId, userGroup(), 'likerUid', 'updateAt');

    $scope.like = function () {
      var likeList = listService.list('like:'+$scope.work.workId);
      likeList.$loaded().then(function (data) {
        var myLike = _.findWhere(data, {likerUid: UID()});
        console.log(data, myLike)
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

    $scope.openComment = function (workId, choosedLike) {
      $state.go('customer.comment', {workId: workId, choosedLike: choosedLike});
    };


    $scope.confirm = function(work) {
      var work1 = {};
      work1.workId = work.workId;
      work1.slave = work.slave1;
      $state.go('customer.createEditReservation', {value: {work: work1}});
    };


    
  });