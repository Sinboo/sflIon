/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('CreateEditReservationCtrl', function ($scope, $state, noBackGoTo, appModalService, listService, UID, UserProfile, RESERVATION_TIME_LIST, $filter, ionicToast, $interval) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.viewDate = new Date();
      setValid($scope.viewDate);
    });

    $scope.reservation = {};
    $scope.goTo = noBackGoTo;
    console.log($state.params);

    var userProfile = UserProfile();
    $scope.reservation.customerName = userProfile.name;
    $scope.reservation.customerMobile = userProfile.mobile;
    $scope.reservation.customerAvatar = userProfile.avatar;

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
      var postData = {};
      postData.bookedStartAt = moment($filter('date')(Date.parse(moment($scope.viewDate._d).endOf('day')._d), "yyyy-MM-dd ") + reservation.bookedStartAt).valueOf();
      postData.hairstylistUid = reservation.hairstylist ? reservation.hairstylist.uid : null;
      postData.hairstylistName = reservation.hairstylist ? reservation.hairstylist.name : null;
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
    };

    $scope.reservationTimeList = RESERVATION_TIME_LIST;

    $scope.mustInputErrorTips = {
      required: '请填写必填项',
    };
    $scope.validate = function () {
      if (!$scope.reservation.price && !$scope.reservation.work && !$scope.reservation.hairstylist) {ionicToast.show('请优先选发型或价格!', 'middle', false, 2000);return false;}
      if (!$scope.reservation.bookedStartAt) {ionicToast.show('请选择预订时间!', 'middle', false, 2000);return false;}
      return true;
    };



    $scope.decrementDate = function () {
      $scope.reservation.bookedStartAt = undefined;
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').subtract(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').subtract(1, 'days');
      setValid($scope.viewDate._d);
    };

    $scope.incrementDate = function () {
      $scope.reservation.bookedStartAt = undefined;
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').add(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').add(1, 'day');
      setValid($scope.viewDate._d);
    };

    function setValid(date) {
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
    }



    // $scope.openPriceListModal = function () {
    //   appModalService.show(
    //     'templates/customer/salon/modal/priceListModal.html',
    //     'PriceListModalCtrl as vm'
    //   ).then(
    //     function (value) {
    //       if (value) {
    //         console.log(value);
    //         $scope.reservation.work = null;
    //         $scope.reservation.price = null;
    //         $scope.reservation.hairstylist = null;
    //         $scope.reservation.price = value.choosedPrice;
    //         $scope.reservation.hairstylist = value.hairstylist;
    //         $scope.reservation.hairstylist.rating = 4;
    //       }
    //     },
    //     function(err) {
    //       Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
    //     }
    //   );
    // };

    //   $scope.openWorkGroupModal = function () {
    //   appModalService.show(
    //     'templates/customer/salon/modal/workGroupModal.html',
    //     'WorkGroupModalCtrl as vm'
    //   ).then(
    //     function (value) {
    //       if (value) {
    //         console.log(value)
    //         $scope.reservation.work = null;
    //         $scope.reservation.price = null;
    //         $scope.reservation.hairstylist = null;
    //         $scope.reservation.work = value;
    //         listService.list('hairstylist:'+value.slave.hairstylistUid).$loaded().then(function (data) {
    //           $scope.reservation.hairstylist = data[0];
    //           $scope.reservation.hairstylist.rating = 4;
    //         })
    //       }
    //     },
    //     function(err) {
    //       Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
    //     }
    //   );
    // };

    

  });