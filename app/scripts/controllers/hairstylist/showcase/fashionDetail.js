/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('FashionDetailCtrl', function ($scope, $state, UID, userGroup, createWidget, $wilddogArray, listService, Join3List) {
    $scope._ = _;
    $scope.UID = UID();
    $scope.fashion = $state.params.fashion;
    $scope.isHairstylist = $state.params.isHairstylist;
    console.log($scope.fashion);

    $scope.userProfile = listService.list($scope.fashion.master.userGroup + ':' + $scope.fashion.master.uid);

    $scope.comments = Join3List('comment:'+$scope.fashion.$id, 'customer', 'hairstylist', 'commenerUid', 'updateAt');

    $scope.likes = Join3List('like:'+$scope.fashion.$id, 'customer', 'hairstylist', 'likerUid', 'updateAt');

    $scope.like = function () {
      var likeList = listService.list('like:'+$scope.fashion.$id);
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
      $scope.openComment = function (choosedLike) {
        $state.go('hairstylist.comment', {workId: $scope.fashion.$id, choosedLike: choosedLike});
      };
      $scope.showUserDetail = function (userProfile) {
        var params = {};
        params[$scope.fashion.master.userGroup] = [userProfile];
        params.isHairstylist = true;
        $state.go('hairstylist.' + $scope.fashion.master.userGroup + 'Detail', params);
      };
    }
    else {
      $scope.openComment = function (choosedLike) {
        $state.go('customer.comment', {workId: $scope.fashion.$id, choosedLike: choosedLike});
      };
      $scope.showUserDetail = function (userProfile) {
        var params = {};
        params[$scope.fashion.master.userGroup] = [userProfile];
        $state.go('customer.' + $scope.fashion.master.userGroup + 'Detail', params);
      };
    }



    
  });