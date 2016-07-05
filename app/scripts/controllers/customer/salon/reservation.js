/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonReservationCtrl', function ($scope, noBackGoTo, appService, $ionicPopover, $location, listService, ORDER_GROUP) {
    $scope.viewDate = new Date();
    $scope.goTo = noBackGoTo;
    $scope.reservations = [];



    $.each(ORDER_GROUP, function (k, v) {
      listService.list('orders:'+k).$loaded().then(function (data) {
        angular.forEach(data, function (item) {
          item.status = k;
          listService.list('products')

        });
        $scope.reservations = $scope.reservations.concat(data);
        console.log($scope.reservations)
      });
    });


    getDateEvents(moment($scope.viewDate._d).startOf('day')._d);
    $scope.decrementDate = function (item) {
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').subtract(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').subtract(1, 'days');
      getDateEvents($scope.viewDate._d)
    };

    $scope.incrementDate = function (item) {
      if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').add(1, 'days');
      else $scope.viewDate = moment($scope.viewDate._d).startOf('day').add(1, 'day');
      getDateEvents($scope.viewDate._d)
    };
    function getDateEvents(date) {
      var range = moment().range(date, moment(date).endOf('day'));
      $scope.seletedDateEvents = [];
      angular.forEach($scope.notifications, function (value, key) {
        if (moment(value.startsAt).within(range)) {
          $scope.seletedDateEvents.push(value);
        }
      });
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




    // for (var i=0; i<5; i++) {
    //   var product = {};
    //   product.name = '最新韩式空气刘海';
    //   product.price = 188;
    //   product.discount = 0.8;
    //   product.coverImg = 'http://imtailor.b0.upaiyun.com/AAAB/AAAZ/2016/07/08a6f91f-f860-4de8-808a-baa1a3a0d53e.jpg';
    //   product.carouselImgs = {};
    //   product.carouselImgs.one = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   product.carouselImgs.two = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   product.carouselImgs.three = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   product.carouselImgs.four = 'http://img2.imgtn.bdimg.com/it/u=1940010301,1280011837&fm=21&gp=0.jpg';
    //   product.shortDesc = '美丽的故事美丽的故事美丽的故事美丽的故事';
    //   product.detailDesc = '正道是阿斯顿发送美丽的故事美丽的故事美丽的故事美丽的故事美丽的故事美丽的故事到弗兰克就爱看的激发了肯德基福利卡极度分裂卡士大夫科技科技科圣诞节疯狂';
    //   product.hairstylistIds = null;
    //   product.group = 'hairCut';
    //   product = JSON.parse(JSON.stringify(product));
    //   listService.products().add(product);
    //
    // }
    
    



  });