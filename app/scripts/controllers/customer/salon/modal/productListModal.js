/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ProductListModalCtrl', function ($scope, WD_URL, $wilddogArray, ListLoadMore, appModalService, parameters, listService, $ionicPopover) {
    var vm = this;
    vm.group = parameters;
    vm.products = [];
    console.log(vm.group)

    var loadUtil = new ListLoadMore('products:'+vm.group, 'updateAtR', 10);
    $scope.loadMore = function () {
      loadUtil.loadMore(function (data) {
        console.log(data)
        vm.products = vm.products.concat(data);
        angular.forEach(vm.products, function (item) {
          listService.list('productServer:' + item.$id).$loaded().then(function (data) {
            item.productServer = data;
          })
        })
        if (data.length == 0) {
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    };

    $scope.loadMore();


    // // create a connection to Firebase
    // var baseRef = new Wilddog(WD_URL).child('products').child('hairCut');
    // // create a scrollable reference
    // var scrollRef = new Wilddog.util.Scroll(baseRef, 'updateAtR');
    //
    // // create a synchronized array on scope
    // vm.products  = $wilddogArray(scrollRef);
    // // load the first three contacts
    // scrollRef.scroll.next(10);
    // console.log(vm.products)
    //
    // // This function is called whenever the user reaches the bottom
    // $scope.loadMore = function() {
    //   var last = vm.products.length;
    //   console.log('yes')
    //   // load the next contact
    //   scrollRef.scroll.next(3);
    //   $scope.$broadcast('scroll.infiniteScrollComplete');
    //   if (last = vm.products.length) {
    //     Materialize.toast('<i class="icon ion-android-alert"></i>' + '没有更多数据了!', 2000);
    //   }
    // };





    // listService.list('products:hairCut').$loaded().then(function (data) {
    //   console.log(data)
    //   $scope.data = data;
    //   angular.forEach(data, function (item) {
    //     $scope.data.save(item)
    //   })
    // })



    
    vm.confirm = function(formData) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistsModal.html',
        'HairstylistsModalCtrl as vm',
        formData.$id
      ).then(
        function (value) {
          if (value) {
            console.log(value)
            $scope.closeModal({
              product: formData,
              productServer: value
            });
          }
        },
        function(err) {
          Materialize.toast('<i class="icon ion-close-round"></i>' + err, 2000);
        }
      );
    };
    vm.cancel = function() {
      $scope.closeModal(null);
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
    }
    
    
  });