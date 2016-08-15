/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('ReceptionistCreateEditReservationCtrl', function ($scope, $rootScope, $state, $timeout, noBackGoTo, appModalService, listService, UID, UserProfile, RESERVATION_TIME_LIST, $filter, ionicToast, $interval, JoinList) {
    $scope.viewDate = new Date();
    $scope.reservation = $state.params.reservation;
    $scope.reservationTimeList = RESERVATION_TIME_LIST;
    $scope.goTo = noBackGoTo;
    console.log($scope.reservation);

    var resetResTime = function () {
      angular.forEach($scope.reservationTimeList, function (timeList) {
        angular.forEach(timeList, function (timeLable) {
          timeLable.booked = false;
          timeLable.order = undefined;
        })
      });
    };
    resetResTime();

    $scope.checkOrder = function (date, data) {
      console.log($filter('date')(Date.parse(moment(date).endOf('day')._d), "yyyy-MM-dd "), data);
      angular.forEach(data, function (item) {
        item.slave.expectEndAt = item.slave.bookedStartAt + 3600000;
        angular.forEach($scope.reservationTimeList, function (timeList) {
          angular.forEach(timeList, function (timeLable) {
            var timeLableStamp = moment($filter('date')(Date.parse(moment(date).endOf('day')._d), "yyyy-MM-dd ") + timeLable.text).valueOf();
            if ((item.slave.bookedStartAt <= timeLableStamp && timeLableStamp <= item.slave.expectEndAt) ) {
              timeLable.booked = true;
              timeLable.order = item.slave;
            }
          })
        })
      });
    };

    $scope.orderList = JoinList('orderOfHairstylist:'+$scope.reservation.hairstylistUid, 'order', 'orderId', 'updateAt');
    $scope.orderList.$watch(function () {
      initData();
    });
    var initData = function () {
      console.log($rootScope['orderOfHairstylistLoadedFlag-' + $scope.reservation.hairstylistUid]);
      if (!$rootScope['orderOfHairstylistLoadedFlag-' + $scope.reservation.hairstylistUid]) {
        $scope.orderList.$loaded().then(function (data) {
          $scope.checkOrder($scope.viewDate, data);
          $rootScope['orderOfHairstylistLoadedFlag-' + $scope.reservation.hairstylistUid] = true;
        })
      }
      else {
        $scope.checkOrder($scope.viewDate, $scope.orderList);
      }
    };
    initData();

    if ($state.params && $state.params.reservation && $state.params.reservation.work) {
      $scope.reservation.work = $state.params.reservation.work;
      listService.list('hairstylist:'+$state.params.reservation.work.slave.hairstylistUid).$loaded().then(function (data) {
        $scope.reservation.hairstylist = data[0];
        $scope.reservation.hairstylist.rating = 4;
      })
    }
    if ($state.params && $state.params.reservation && $state.params.reservation.hairstylist && $state.params.reservation.price) {
      $scope.reservation.price = $state.params.reservation.price;
      $scope.reservation.hairstylist = $state.params.reservation.hairstylist || $state.params.reservation.hairstylist.hairstylist;
      $scope.reservation.hairstylist.rating = 4;
    }

    if ($state.params && $state.params.value && $state.params.value.choosedPrice) {
      $scope.reservation.work = undefined;
      $scope.reservation.price = undefined;
      $scope.reservation.hairstylist = undefined;
      $scope.reservation.price = $state.params.value.choosedPrice;
      $scope.reservation.hairstylist = $state.params.value.hairstylist;
      $scope.reservation.hairstylist.rating = 4;
    }

    if ($state.params && $state.params.value && $state.params.value.work) {
      $scope.reservation.work = undefined;
      $scope.reservation.price = undefined;
      $scope.reservation.hairstylist = undefined;
      $scope.reservation.work = $state.params.value.work;
      listService.list('hairstylist:'+$state.params.value.work.slave.hairstylistUid).$loaded().then(function (data) {
        $scope.reservation.hairstylist = data[0];
        $scope.reservation.hairstylist.rating = 4;
      })
    }

    $scope.saveReservation = function (reservation) {
      console.log(reservation);
      var list = listService.list('order');
      list.$loaded().then(function () {
        var order = list.$getRecord(reservation.$id);
        order.bookedStartAt = moment($filter('date')(Date.parse(moment($scope.viewDate._d).endOf('day')._d), "yyyy-MM-dd ") + reservation.bookedStartAt).valueOf();
        list.$save(order).then(function (ref) {
          console.log(ref.key())
          Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '修改成功!', 2000);
          $state.go('receptionist.salonReservation');
        });
      })
    };

    $scope.mustInputErrorTips = {
      required: '请填写必填项'
    };
    $scope.validate = function () {
      // if (!$scope.reservation.price && !$scope.reservation.work && !$scope.reservation.hairstylist) {ionicToast.show('请优先选发型或价格!', 'middle', false, 2000);return false;}
      if (!$scope.reservation.bookedStartAt) {ionicToast.show('请选择预订时间!', 'middle', false, 2000);return false;}
      return true;

    };



    $scope.decrementDate = function () {
      $scope.reservation.bookedStartAt = undefined;
      resetResTime();
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').subtract(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').subtract(1, 'days');
      $scope.setValid($scope.viewDate._d);
      $scope.checkOrder($scope.viewDate._d, $scope.orderList);
    };

    $scope.incrementDate = function () {
      $scope.reservation.bookedStartAt = undefined;
      resetResTime();
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').add(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').add(1, 'day');
      $scope.setValid($scope.viewDate._d);
      $scope.checkOrder($scope.viewDate._d, $scope.orderList);
    };

    $scope.setValid = function(date) {
      $scope.range = moment().range(date, moment(date).endOf('day'));

      angular.forEach($scope.reservationTimeList, function (timeList) {
        angular.forEach(timeList, function (timeLable) {
          var future = moment($filter('date')(Date.parse(moment(date).endOf('day')._d), "yyyy-MM-dd ") + timeLable.text).valueOf();
          timeLable.valid = future - Date.now() > 0;
        })
      });
      $interval(function () {
        angular.forEach($scope.reservationTimeList, function (timeList) {
          angular.forEach(timeList, function (timeLable) {
            var future = moment($filter('date')(Date.parse(moment(date).endOf('day')._d), "yyyy-MM-dd ") + timeLable.text).valueOf();
            timeLable.valid = future - Date.now() > 0;
          })
        });
      }, 600000);
    };
    $scope.setValid($scope.viewDate);





    // $scope.moveItem = function(item, fromIndex, toIndex) {
    //   $scope.orderList.splice(fromIndex, 1);
    //   $scope.orderList.splice(toIndex, 0, item);
    //   console.log($scope.orderList)
    // };


  });