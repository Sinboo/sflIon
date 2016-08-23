/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('CreateEditReservationCtrl', function ($scope, $rootScope, $state, noBackGoTo, appModalService, listService, UID, UserProfile, RESERVATION_TIME_LIST, $filter, ionicToast, $interval, JoinList) {
    $scope.viewDate = new Date();
    $scope.reservationTimeList = RESERVATION_TIME_LIST;
    $scope.goTo = noBackGoTo;
    console.log($state.params);
    $scope.editFlag = $state.params.editFlag;
    $scope.reservation = {};

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
        if (item.slave && item.slave.bookedStartAt) {
          item.slave.expectEndAt = parseInt(item.slave.bookedStartAt) + 3600000;
          angular.forEach($scope.reservationTimeList, function (timeList) {
            angular.forEach(timeList, function (timeLable) {
              var timeLableStamp = moment($filter('date')(Date.parse(moment(date).endOf('day')._d), "yyyy-MM-dd ") + timeLable.text).valueOf();
              if ((item.slave.bookedStartAt <= timeLableStamp && timeLableStamp <= item.slave.expectEndAt) ) {
                timeLable.booked = true;
                timeLable.order = item.slave;
              }
            })
          })
        }
      });
    };

    var getOrderList = function () {
      $scope.orderList = JoinList('orderOfHairstylist:'+ ($scope.reservation.hairstylistUid || $scope.reservation.hairstylist.uid), 'order', 'orderId', 'updateAt');
      $scope.orderList.$watch(function () {
        initData();
      });
    };

    var initData = function () {
      console.log($rootScope['orderOfHairstylistLoadedFlagCustomer-' + ($scope.reservation.hairstylistUid || $scope.reservation.hairstylist.uid)]);
      if (!$rootScope['orderOfHairstylistLoadedFlagCustomer-' + ($scope.reservation.hairstylistUid || $scope.reservation.hairstylist.uid)]) {
        $scope.orderList.$loaded().then(function (data) {
          $scope.checkOrder($scope.viewDate, data);
          $rootScope['orderOfHairstylistLoadedFlagCustomer-' + ($scope.reservation.hairstylistUid || $scope.reservation.hairstylist.uid)] = true;
        });
        $scope.checkOrder($scope.viewDate, $scope.orderList);
      }
      else {
        $scope.checkOrder($scope.viewDate, $scope.orderList);
      }
    };

    if (!$scope.editFlag) {
      var userProfile = UserProfile();
      $scope.reservation.customerName = userProfile.name;
      $scope.reservation.customerMobile = userProfile.mobile;
      $scope.reservation.customerAvatar = userProfile.avatar;

      if ($state.params && $state.params.reservation && $state.params.reservation.work) {
        $scope.reservation.work = $state.params.reservation.work;
        listService.list('hairstylist:'+$state.params.reservation.work.slave.hairstylistUid).$loaded().then(function (data) {
          $scope.reservation.hairstylist = data[0];
          $scope.reservation.hairstylist.rating = 4;
          getOrderList();
          initData()
        })
      }
      if ($state.params && $state.params.reservation && $state.params.reservation.hairstylist && $state.params.reservation.price) {
        $scope.reservation.price = $state.params.reservation.price;
        $scope.reservation.hairstylist = $state.params.reservation.hairstylist || $state.params.reservation.hairstylist.hairstylist;
        $scope.reservation.hairstylist.rating = 4;
        getOrderList();
        initData()
      }

      if ($state.params && $state.params.value && $state.params.value.choosedPrice) {
        $scope.reservation.work = undefined;
        $scope.reservation.price = undefined;
        $scope.reservation.hairstylist = undefined;
        $scope.reservation.price = $state.params.value.choosedPrice;
        $scope.reservation.hairstylist = $state.params.value.hairstylist;
        $scope.reservation.hairstylist.rating = 4;
        getOrderList();
        initData()
      }

      if ($state.params && $state.params.value && $state.params.value.work) {
        $scope.reservation.work = undefined;
        $scope.reservation.price = undefined;
        $scope.reservation.hairstylist = undefined;
        $scope.reservation.work = $state.params.value.work;
        listService.list('hairstylist:'+$state.params.value.work.slave.hairstylistUid).$loaded().then(function (data) {
          $scope.reservation.hairstylist = data[0];
          $scope.reservation.hairstylist.rating = 4;
          getOrderList();
          initData()
        })
      }
    }
    else {
      $scope.reservation = $state.params.reservation.slave;
      getOrderList();
      initData();
    }


    $scope.saveReservation = function (reservation) {
      console.log(reservation);
      if (!$scope.editFlag) {
        var postData = {};
        postData.bookedStartAt = moment($filter('date')(Date.parse(moment($scope.viewDate._d).endOf('day')._d), "yyyy-MM-dd ") + reservation.bookedStartAt).valueOf();
        postData.hairstylistUid = reservation.hairstylist ? reservation.hairstylist.uid : null;
        postData.hairstylistName = reservation.hairstylist ? reservation.hairstylist.name : null;
        postData.hairstylistMobile = reservation.hairstylist ? reservation.hairstylist.mobile : null;
        postData.hairstylistAvatar = reservation.hairstylist ? reservation.hairstylist.avatar : null;
        postData.customerUid = UID();
        postData.customerName = reservation.customerName;
        postData.customerMobile = reservation.customerMobile;
        postData.customerAvatar = reservation.customerAvatar;
        postData.workId = reservation.work ? reservation.work.workId : null;
        postData.workName = reservation.work ? reservation.work.slave.name : null;
        postData.workGroup = reservation.work ? reservation.work.slave.workGroup : null;
        postData.priceId = reservation.price ? reservation.price.id : null;
        postData.priceName = reservation.price ? reservation.price.name : null;
        postData.orderPrice = reservation.work ? reservation.work.price : reservation.price.number;
        postData.notes = reservation.notes;
        postData.type = 'booked';
        postData = JSON.parse(JSON.stringify(postData));
        console.log(postData);
        listService.list('order').add(postData).then(function (ref) {
          listService.list('orderOfCustomer:'+UID()).$add({orderId: ref.key()});
          listService.list('orderOfHairstylist:'+postData.hairstylistUid).$add({orderId: ref.key()});
          Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '预订成功!', 2000);
          $state.go('customer.salonReservation');
        });
      }
      else {
        var list = listService.list('order');
        list.$loaded().then(function () {
          var index = list.$indexFor($state.params.reservation.orderId);
          list[index].bookedStartAt = !isNaN(reservation.bookedStartAt) ? reservation.bookedStartAt : moment($filter('date')(Date.parse(moment($scope.viewDate._d).endOf('day')._d), "yyyy-MM-dd ") + reservation.bookedStartAt).valueOf();
          list[index].customerUid = UID();
          list[index].customerName = reservation.customerName;
          list[index].customerMobile = reservation.customerMobile;
          list[index].customerAvatar = reservation.customerAvatar;
          list[index].notes = reservation.notes;
          list[index].type = 'booked';
          list[index] = JSON.parse(JSON.stringify(list[index]));
          list.$save(index).then(function (ref) {
            console.log('yes', ref.key());
            Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '修改成功!', 2000);
            $state.go('customer.salonReservation');
          });
        })
      }
    };


    $scope.mustInputErrorTips = {
      required: '请填写必填项',
    };
    $scope.validate = function () {
      if (!$scope.editFlag && !$scope.reservation.price && !$scope.reservation.work && !$scope.reservation.hairstylist) {ionicToast.show('请优先选发型或价格!', 'middle', false, 2000);return false;}
      if (!$scope.editFlag && !$scope.reservation.bookedStartAt) {ionicToast.show('请选择预订时间!', 'middle', false, 2000);return false;}
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
    

  });