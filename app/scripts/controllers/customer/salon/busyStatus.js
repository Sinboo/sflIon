/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonBusyStatusCtrl', function ($scope, $state, noBackGoTo, listService, JoinList, appModalService, $ionicPopover) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.viewDate = new Date();
      $scope.start = moment($scope.viewDate).startOf('day').valueOf();
      $scope.end = moment($scope.viewDate).endOf('day').valueOf();
      console.log($scope.start, $scope.end);
      $scope.filterBookedStartAt = function (val) {
        return (val.bookedStartAt > $scope.start && val.bookedStartAt < $scope.end);
      };
      initData();
    });
    $scope.goTo = noBackGoTo;
    $scope._ = _;

    var list = JoinList('allHairstylist', 'hairstylist', 'hairstylistUid', 'updateAt');
    list.$watch(function () {
      initData();
    });
    var initData = function () {
      list.$loaded().then(function (data) {
        $scope.hairstylists = data;
        angular.forEach($scope.hairstylists, function (item) {
          item.orderList = JoinList('orderOfHairstylist:' + item.hairstylistUid, 'order', 'orderId', 'updateAt', 'bookedStartAt');
        });
        console.log($scope.hairstylists);
      });
    };
    initData();

    $scope.showDetail = function (hairstylist) {
      $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist], type: 3});
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



    // var customer = {};
    // customer.name = 'sinboo';
    // customer.avatar = 'http://www.fzlkz.com/uploads/allimg/c150815/14395ITc05P-45Z5.jpg';
    // customer.uid = '1468141332757735';
    // listService.list('customer:'+"1468141332757735").add(customer)

    // var orderList = listService.list('order');
    // orderList.$loaded().then(function (data) {
    //   console.log(data)
    //   angular.forEach(data, function (order) {
    //     listService.list('customer:'+order.customerUid).$loaded().then(function (customer) {
    //       console.log(customer)
    //       order.customerAvatar = customer[0].avatar;
    //       listService.list('hairstylist:'+order.hairstylistUid).$loaded().then(function (hairstylist) {
    //         order.hairstylistAvatar = hairstylist[0].avatar;
    //         orderList.$save(order)
    //       })
    //     });
    //
    //   })
    //
    // })


  });