/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CommentCtrl', function ($scope, $state, UID, userGroup, $ionicPopover, listService, JoinList) {
    $scope._ = _;
    $scope.UID = UID();
    $scope.work = {};
    $scope.work.$id = $state.params.workId;
    $scope.choosedLike = $state.params.choosedLike ? $state.params.choosedLike : false;
    console.log($scope.work, $scope.choosedLike);

    $scope.setChoosedLike = function (bl) {
      $scope.choosedLike = bl;
    };

    $scope.comments = JoinList('comment:'+$scope.work.$id, userGroup(), 'commenerUid', 'updateAt');
    console.log($scope.comments);

    $scope.likes = JoinList('like:'+$scope.work.$id, userGroup(), 'likerUid', 'updateAt');
    console.log($scope.likes);

    $scope.like = function () {
      var likeList = listService.list('like:'+$scope.work.$id);
      likeList.$loaded().then(function (data) {
        var myLike = _.findWhere(data, {likerUid: $scope.UID});
        console.log(data, myLike)
        if (myLike) {
          var index = likeList.$indexFor(myLike.$id);
          likeList.$remove(index).then(function (ref) {
          })
        }
        else {
          var addLike = {};
          addLike.likerUid = $scope.UID;
          console.log(addLike, 'like');
          likeList.add(addLike)
        }
      })
    };
    
    $scope.submitComment = function (content) {
      var list = listService.list('comment:'+$scope.work.$id);
      list.$loaded().then(function () {
        var comment = {};
        comment.content = content;
        comment.commenerUid = $scope.UID;
        list.add(comment);
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