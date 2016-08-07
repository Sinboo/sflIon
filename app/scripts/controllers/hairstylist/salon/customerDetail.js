/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('CustomerDetailCtrl', function ($scope, $state, JoinList, Join3List, dataSetterGetter, listService, CUSTOMER_LEVEL) {
    $scope.type = $state.params.type ? $state.params.type : 1;
    $scope.customer = $state.params.customer[0];
    $scope.price = $state.params.choosedPrice;
    console.log($scope.customer);
    $scope._ = _;
    $scope.customerLevels = CUSTOMER_LEVEL;


    $scope.orderList = JoinList('orderOfCustomer:'+$scope.customer.uid, 'order', 'orderId', 'updateAt');
    console.log($scope.orderList);

    listService.list('customerMaintain:'+$scope.customer.uid).$loaded().then(function (data) {
      $scope.customerMaintainDetails = Join3List('customerMaintainDetail:'+data[0].$id, 'hairstylist', 'receptionist', 'createById', 'updateAt');
      console.log($scope.customerMaintainDetails);
    });
    

    // $scope.likes = listService.list('like:'+$scope.customer.uid);


    $scope.maintainCustomer = function(customer) {
      $state.go('hairstylist.maintainCustomer', {customer: customer})
    };
    
  });