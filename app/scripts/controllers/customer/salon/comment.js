/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CommentCtrl', function ($scope, $state, UID, userGroup, $ionicPopover, listService, Join4List, upyun, appModalService, appService, $ionicScrollDelegate, $timeout) {
    $scope._ = _;
    $scope.UID = UID();
    $scope.work = {};
    $scope.comment = {};
    $scope.work.$id = $state.params.workId;
    $scope.choosedLike = $state.params.choosedLike ? $state.params.choosedLike : false;
    console.log($scope.work, $scope.choosedLike);

    $scope.setChoosedLike = function (bl) {
      $scope.choosedLike = bl;
    };

    var footerBar, scroller;
    var viewScroll = $ionicScrollDelegate.$getByHandle('commentPageScroll');
    var scrollToBottom = function () {
      $timeout(function () {
        viewScroll.scrollBottom(true);
        footerBar = document.body.querySelector('#comment .uploadImage');
        scroller = document.body.querySelector('#comment .scroll-content');
      }, 0)};

    $scope.comments = Join4List('comment:'+$scope.work.$id, 'customer', 'hairstylist', 'receptionist', 'commenerUid', 'updateAt');
    console.log($scope.comments);
    $scope.comments.$watch(function () {
      scrollToBottom();
    });

    $scope.likes = Join4List('like:'+$scope.work.$id, 'customer', 'hairstylist', 'receptionist', 'likerUid', 'updateAt');
    console.log($scope.likes);
    $scope.likes.$watch(function () {
      scrollToBottom();
    });

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
        list.add(comment).then(function () {
          $scope.comment.commentMessage = "";
        });
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
    };
    
    $scope.inputCommentImgModal = function (commentMessage) {
      appModalService.show(
        'templates/customer/salon/modal/inputCommentImgModal.html',
        'InputCommentImgModalCtrl as vm',
        commentMessage
      ).then(function (value) {
        if (value) {
          console.log(value);
          var list = listService.list('comment:'+$scope.work.$id);
          list.$loaded().then(function () {
            var comment = {};
            comment.content = value.content ? value.content : null;
            comment.imgUrl = value.imgUrl ? value.imgUrl : null;
            comment.commenerUid = $scope.UID;
            list.add(comment).then(function () {
              $scope.comment.commentMessage = "";
            });
          })
        }
      })
    };


    
  });