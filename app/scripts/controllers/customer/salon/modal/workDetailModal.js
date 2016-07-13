/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('WorkDetailModalCtrl', function ($scope, parameters, UID, userGroup, createWidget, $wilddogArray, listService, N_VIP_PRICE, appModalService, $wilddogAuth, WD_URL) {
    var vm = this;
    vm.work = parameters;

    var uid = UID();
    console.log(uid)

    console.log(vm.work);

    // var ref = new Wilddog(WD_URL);
    // var norm = new Wilddog.util.NormalizedCollection(
    //   [ref.child('like').child(vm.work.$id), 'liker'],
    //   [ref.child(userGroup()), 'userProfile', 'liker.likerUid']
    // )
    //   .select('liker.likerUid', 'liker.updateAtR', {key: 'userProfile.$value', alias: 'userProfile'})
    //   .ref();
    // var list = $wilddogArray(norm);
    // list.$loaded().then(function (data) {
    //   console.log(data)
    //   vm.work.likes = data;
    //   angular.forEach(data, function (item) {
    //     if (item.likerUid == uid) {
    //       vm.myLike = item;
    //       vm.liked = true;
    //       console.log(vm.myLike, vm.liked)
    //     }
    //   })
    // });
    
    var commentList = listService.list('comment:'+vm.work.workId);
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

    var likeList = listService.list('like:'+vm.work.workId);
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
      console.log(vm.liked)
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
        console.log(vm.myLike, 'like');
        likeList.add(vm.myLike).then(function () {
          initLike();
        });
      }
    };
    

    vm.openCommentModal = function (workId, choosedLike) {
      appModalService.show(
        'templates/customer/salon/modal/commentModal.html',
        'CommentModalCtrl as vm',
        {workId: workId, choosedLike: choosedLike}
      ).then(function () {
        
      })

    };



    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };


    
  });