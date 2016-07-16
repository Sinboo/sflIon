/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonReservationCtrl', function ($scope, WD_URL, UID, JoinList, noBackGoTo, appService, $ionicPopover, $location, listService, localStorageService, $wilddogArray, appModalService) {
    $scope.$on("$ionicView.enter", function(event, data){
      initData();
    });

    $scope.viewDate = new Date();
    $scope.now = new Date().getTime();
    var startOfDay = moment($scope.viewDate).startOf('day')._d;
    $scope.goTo = noBackGoTo;
    $scope.reservations = [];

    var reservationList = JoinList('orderOfCustomer:'+UID(), 'order', 'orderId', 'updateAt');
    var initData = function () {
      reservationList.$loaded().then(function (data) {
        $scope.reservations = data;
        console.log(data);
        getReservations(moment($scope.viewDate._d).startOf('day')._d);
      })
    };

    $scope.showDetail = function (reservation) {
      console.log(reservation)
      if (reservation.workId) {
        listService.list('work').$loaded().then(function (works) {
          var work = works.$getRecord(reservation.workId);
          appModalService.show(
            'templates/customer/salon/modal/workDetailModal.html',
            'WorkDetailModalCtrl as vm',
            {workId: reservation.workId, slave: work}
          )
        });
      }
      else if (reservation.hairstylistUid) {
        listService.list('hairstylist:'+reservation.hairstylistUid).$loaded().then(function (hairstylist) {
          appModalService.show(
            'templates/customer/salon/modal/hairstylistDetailModal.html',
            'HairstylistDetailModalCtrl as vm',
            {hairstylist: hairstylist}
          )
        })
      }
    };





    $scope.decrementDate = function () {
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').subtract(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').subtract(1, 'days');
      getReservations($scope.viewDate._d);
      console.log($scope.now, Date.parse(moment($scope.viewDate._d).endOf('day')._d))
      $scope.outOfDate = $scope.now > Date.parse(moment($scope.viewDate._d).endOf('day')._d);
    };

    $scope.incrementDate = function () {
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').add(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').add(1, 'day');
      getReservations($scope.viewDate._d);
      console.log($scope.now, Date.parse(moment($scope.viewDate._d).endOf('day')._d))
      $scope.outOfDate = $scope.now > Date.parse(moment($scope.viewDate._d).endOf('day')._d);
    };
    function getReservations(date) {
      var range = moment().range(date, moment(date).endOf('day'));
      $scope.seletedReservations = [];
      angular.forEach($scope.reservations, function (value) {
        if (value.slave && moment(value.slave.bookedStartAt).within(range)) {
          $scope.seletedReservations.push(value);
        }
      });
      console.log($scope.seletedReservations)
    }

    $ionicPopover.fromTemplateUrl('templates/customer/salon/pop/addReservationPop.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.addReservation = popover;
    });
    

    moment.locale('zh-cn', {
      months : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthsShort : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weekdays : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      weekdaysShort : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      weekdaysMin : ['日', '一', '二', '三', '四', '五', '六'],
      calendar: {
        lastDay: '[昨天]',
        sameDay: '[今天]',
        nextDay: '[明天, ] dddd MMM Do',
        lastWeek: '[上个] dddd MMM Do',
        nextWeek: 'dddd MMM Do',
        sameElse: 'L'
      },
      longDateFormat : {
        L: "YYYY/MM/DD/"
      },
      ordinal : function (number) {
        var output = "日";
        return number + output;
      }
    });

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
    }



    // var hairstylistUnderPrice = {};
    // hairstylistUnderPrice.hairstylistUid = 1468141414065442;
    // hairstylistUnderPrice = JSON.parse(JSON.stringify(hairstylistUnderPrice));
    // listService.list('hairstylistUnderPrice:-KMJ6iKMC3dlXew_C3bQ').add(hairstylistUnderPrice);


    // listService.list('hairstylist').$loaded().then(function (data) {
    //   console.log(data)
    //   angular.forEach(data, function (item) {
    //     var hairstylistUnderPrice = {};
    //     hairstylistUnderPrice.hairstylistUid = item.$id;
    //     hairstylistUnderPrice = JSON.parse(JSON.stringify(hairstylistUnderPrice));
    //     listService.list('price:nursing').$loaded().then(function (prices) {
    //       angular.forEach(prices, function (priceItem) {
    //         console.log('hairstylistUid:', item.$id)
    //         console.log('priceId:', priceItem.$id)
    //         // listService.list('hairstylistUnderPrice:'+priceItem.$id).add(hairstylistUnderPrice);
    //       })
    //     })
    //     // listService.list('hairstylistUnderPrice:-KMJBqeFuUKz02o88Iy1').add(hairstylistUnderPrice);
    //   })
    // })





    // for (var i=0; i<5; i++) {
    //   var work = {};
    //   work.name = '最具魅力短发';
    //   work.price = 118;
    //   work.discount = 0.9;
    //   work.coverImg = 'http://imtailor.b0.upaiyun.com/AAAB/AAAZ/2016/07/08a6f91f-f860-4de8-808a-baa1a3a0d53e.jpg';
    //   work.carouselImgs = {};
    //   work.carouselImgs.one = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   work.carouselImgs.two = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   work.carouselImgs.three = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   work.carouselImgs.four = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   work.shortDesc = '短发也会有冬天的';
    //   work.description = '正道是阿斯顿发送美丽的故事美丽的故事美丽的故事美丽的故事美丽的故事美丽的故事到弗兰克就爱看的激发了肯德基福利卡极度分裂卡士大夫科技科技科圣诞节疯狂';
    //   work.hairstylistUid = null;
    //   work.type = 'F_SHORT';
    //   work = JSON.parse(JSON.stringify(work));
    //   // listService.list('work').add(work);
    // }
    
    // var workList = listService.list('hairstylist');
    // workList.$loaded().then(function (data) {
    //   angular.forEach(data, function (work) {
    //     listService.list('allHairstylist').add({hairstylistUid: work.$id})
    //   })
    // })
    
    
    



  });