/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('CreateEditReservationCtrl', function ($scope, $state, noBackGoTo, appModalService, listService, localStorageService) {
    $scope.goTo = noBackGoTo;
    $scope.group = $state.params.type;
    console.log($state.params)

    $scope.reservation = {};
    $scope.reservation.bookingTime = {};

    $scope.openProductListModal = function () {
      appModalService.show(
        'templates/customer/salon/modal/productListModal.html',
        'ProductListModalCtrl as vm',
        $scope.group
      ).then(
        function (value) {
          if (value) {
            console.log(value)
            $scope.reservation.productId = value.product.$id;
            $scope.reservation.productGroup = $scope.group;
            $scope.productName = value.product.name;
            $scope.reservation.hairstylistId = value.productServer.uid;
            $scope.hairstylistName = value.productServer.name;
          }
        },
        function(err) {
          Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
        }
      );
    };

    $scope.saveReservation = function (reservation) {
      console.log(reservation);
      reservation.customerId = localStorageService.cookie.get('user').uid.split(':')[1];
      listService.list('orders:booked').add(reservation).then(function (data) {
        console.log(data)
        Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '预订成功!', 2000);
        $state.go('customer.salonReservation');
      })
    };



    // for (var i=0; i<8; i++) {
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
    // //   listService.list('products').add(product);
    // //
    // }

    

  });