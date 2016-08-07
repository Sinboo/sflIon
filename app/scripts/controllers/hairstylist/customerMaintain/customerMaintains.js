/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('CustomerMaintainsCtrl', function ($scope, $state, noBackGoTo, listService, JoinList, Join3List, appModalService, $ionicPopover, CUSTOMER_LEVEL) {
    $scope.goTo = noBackGoTo;
    $scope._ = _;
    $scope.customerLevels = CUSTOMER_LEVEL;


    $scope.customerMaintains = JoinList('customerMaintain', 'customer', 'theKey', 'updateAt');

    $scope.customerMaintains.$loaded().then(function (data) {
      angular.forEach(data, function (item) {
        var id = _.allKeys(item.master)[0];
        console.log(id);
        item.customerMaintainDetails = Join3List('customerMaintainDetail:'+id, 'hairstylist', 'receptionist', 'createById', 'updateAt')
      });
      console.log($scope.customerMaintains)
    });

    // var initData = function () {
    //   list.$loaded().then(function (data) {
    //     $scope.customerMaintains = data;
    //     angular.forEach($scope.customerMaintains, function (item) {
    //       var id = _.allKeys(item)[0];
    //       console.log(id);
    //       item.customerMaintainDetails = listService.list('customerMaintainDetail:'+id);
    //     });
    //     console.log($scope.customerMaintains);
    //   });
    // };
    // initData();

    $scope.showDetail = function (customer) {
      $state.go('hairstylist.customerDetail', {customer: [customer], type: 2});
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


  });