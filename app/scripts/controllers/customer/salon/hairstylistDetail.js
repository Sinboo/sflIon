/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistDetailCtrl', function ($scope, $state, JoinList, dataSetterGetter, listService) {
    $scope.type = 1;
    $scope.hairstylist = $state.params.hairstylist[0];
    $scope.price = $state.params.choosedPrice;
    console.log($scope.hairstylist);

    $scope.likes = listService.list('like:'+$scope.hairstylist.uid);

    $scope.works = JoinList('workOfHairstylsit:'+$scope.hairstylist.uid, 'work', 'workId', 'updateAt');

    $scope.confirm = function(hairstylist) {
      if ($scope.price) {
        $state.go('customer.createEditReservation', {value: {hairstylist: hairstylist, choosedPrice: $scope.price}});
      }
      else {
        $state.go('customer.priceList', {hairstylist: hairstylist});
      }
    };
    
  });