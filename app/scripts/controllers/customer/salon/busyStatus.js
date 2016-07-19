/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonBusyStatusCtrl', function ($scope, $state, noBackGoTo, listService, JoinList, appModalService, $ionicPopover) {
    $scope.goTo = noBackGoTo;

    var list = listService.list('hairstylist');
    var initData = function () {
      list.$loaded().then(function (data) {
        $scope.hairstylists = data;
        angular.forEach($scope.hairstylists, function (item) {
          $.each(item, function (k, v) {
            if (k.indexOf('-') > -1) {
              item.hairstylist = v
            }
          });
          item.orderList = JoinList('orderOfHairstylist:'+item.$id, 'order', 'orderId', 'updateAt');
        });
        console.log($scope.hairstylists);
      });
    };
    initData();

    $scope.showDetail = function (hairstylist) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistDetailModal.html',
        'HairstylistDetailModalCtrl as vm',
        {hairstylist: [hairstylist]}
      ).then(function (val) {
        console.log(val)
        if (val) {
          appModalService.show(
            'templates/customer/salon/modal/priceListModal.html',
            'PriceListModalCtrl as vm',
            hairstylist
          ).then(function (val) {
            console.log(val);
            $state.go('createEditReservation', {reservation: {hairstylist: hairstylist, price: val}})
          })
        }
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