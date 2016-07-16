/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('ShowWorkListCtrl', function ($scope, noBackGoTo, $location, $ionicPopover, listService, appModalService) {
    $scope.goTo = noBackGoTo;

    listService.list('products:hairCut').$loaded().then(function (data) {
      $scope.products = data;
      console.log(data);
    });
    
    $scope.openProductPreview = function (product) {
      appModalService.show(
        'templates/product/modal/productPreview.html',
        'ProductPreviewModalCtrl as vm',
        product
      ).then(
        function (value) {
          if (value) {
            
          }
        },
        function(err) {
          Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
        }
      );
    };
    
    
    

    // for (var i=0; i<18; i++) {
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
    //   product = JSON.parse(JSON.stringify(product));
    //   listService.list('products', null, 'hairCut').add(product);
    // //
    // }








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



  });