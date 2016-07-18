/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('AccountCtrl', function ($scope, userProfile, $state, listService) {
    $scope.type = 1;
    $scope.userProfile = userProfile;
    console.log(userProfile);
    
    $scope.editProfile = function (userProfile) {
      $state.go('customer.editProfile')
    };

    $scope.orders = listService.list('order');
    console.log($scope.orders);
    
    
    
    // $scope.hairstylist = parameters.hairstylist[0];
    // console.log($scope.hairstylist);

    // listService.list('like:'+$scope.hairstylist.uid).$loaded().then(function (likes) {
    //   $scope.hairstylist.likes = likes;
    // });
    //
    // $scope.works = JoinList('workOfHairstylsit:'+$scope.hairstylist.uid, 'work', 'workId', 'updateAt');


    // var hairstylist = listService.list('hairstylist');
    // hairstylist.$loaded().then(function (data) {
    //   console.log(data)
    //   angular.forEach(data, function (hairstylist) {
    //     listService.list('workOfHairstylsit:'+hairstylist.$id).$add({workId: '-KMZRde25Xk7z2xnXqzh'})
    //   })
    // })
    
  });