/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('CustomerMaintainsCtrl', function ($scope, $state, noBackGoTo, $location, listService, JoinList, Join3List, appModalService, $ionicPopover, CUSTOMER_LEVEL, userGroup) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.isHairstylist = $location.path().indexOf('hairstylist') !== -1;
      $scope.isReceptionist = $location.path().indexOf('receptionist') !== -1;
    });
    $scope.goTo = noBackGoTo;
    $scope._ = _;
    $scope.customerLevels = CUSTOMER_LEVEL;
    $scope.userGroup = userGroup();

    $scope.customerMaintains = JoinList('customerMaintain', 'customer', 'theKey', 'updateAt');

    $scope.customerMaintains.$loaded().then(function (data) {
      angular.forEach(data, function (item) {
        var id = _.allKeys(item.master)[0];
        console.log(id);
        item.customerMaintainDetails = Join3List('customerMaintainDetail:'+id, 'hairstylist', 'receptionist', 'createById', 'updateAt')
      });
      console.log($scope.customerMaintains)
    });

    $scope.showDetail = function (customer) {
      if ($scope.isHairstylist) {
        $state.go('hairstylist.customerDetail', {customer: [customer], type: 2});
      }
      else if ($scope.isReceptionist) {
        $state.go('receptionist.customerDetail', {customer: [customer], type: 2});
      }
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