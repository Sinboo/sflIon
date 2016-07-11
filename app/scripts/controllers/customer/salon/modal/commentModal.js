/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CommentModalCtrl', function ($scope, parameters, UID, userGroup, $ionicPopover, listService) {
    var vm = this;
    var uid = UID();
    vm.work = {};
    vm.work.$id = parameters.workId;
    vm.choosedLike = parameters.choosedLike;
    console.log(vm.work);

    var commentList = listService.list('comment:'+vm.work.$id);
    var initComment = function () {
      commentList.$loaded(function (data) {
        console.log(data)
        vm.work.comments = data;
        angular.forEach(vm.work.comments, function (item) {
          listService.list(userGroup()+':'+item.commenerUid).$loaded(function (userProfile) {
            item.userProfile = userProfile[0];
          })
        })
      });
    };
    initComment();

    var likeList = listService.list('like:'+vm.work.$id);
    var initLike = function () {
      likeList.$loaded(function (data) {
        console.log(data)
        vm.work.likes = data;
        angular.forEach(vm.work.likes, function (item) {
          if (item.likerUid == uid) {
            vm.myLike = item;
            vm.liked = true;
            console.log(vm.myLike, vm.liked)
          }
          listService.list(userGroup()+':'+item.likerUid).$loaded(function (userProfile) {
            item.userProfile = userProfile[0];
          })
        })
      });
    };
    initLike();

    vm.like = function () {
      if (vm.liked == true) {
        vm.liked = false;
        likeList.$remove(vm.myLike).then(function () {
          initLike();
        });
      }
      else {
        vm.liked = true;
        vm.myLike = {};
        vm.myLike.likerUid = UID();
        likeList.add(vm.myLike).then(function () {
          initLike();
        });
      }
    };
    
    vm.submitComment = function (content) {
      var comment = {};
      comment.content = content;
      comment.commenerUid = UID();
      commentList.add(comment).then(function () {
        initComment();
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