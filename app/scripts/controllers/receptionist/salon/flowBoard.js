/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('ReceptionistSalonFlowBoardCtrl', function ($scope, $rootScope, $state, noBackGoTo, listService, JoinList, appModalService, $ionicPopover, $ionicPopup, UID, updateWidget) {
    $scope.$on("$ionicView.enter", function(event, data){
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
    $scope.hairstylists = list;
    // list.$watch(function () {
    //   initData();
    // });
    var initData = function () {
      list.$loaded().then(function (data) {
        $scope.hairstylists = data;
        angular.forEach($scope.hairstylists, function (item) {
          item.orderList = JoinList('orderOfHairstylist:' + item.hairstylistUid, 'order', 'orderId', 'updateAt', 'bookedStartAt');
        });
        console.log($scope.hairstylists);
      });
      angular.forEach($scope.hairstylists, function (item) {
        item.orderList = JoinList('orderOfHairstylist:' + item.hairstylistUid, 'order', 'orderId', 'updateAt', 'bookedStartAt');
      });
      console.log($scope.hairstylists);
    };
    initData();

    $scope.selectHairstylist = function (item) {
      console.log(item);
      $ionicPopup.confirm({
        title: '安排发型师',
        template: '指定此发型师进行服务?',
        buttons: [{ text: '否' }, { text: '是', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        if (res === 'ok') {
          var list = listService.list('allHairstylist');
          list.$loaded().then(function () {
            var index = list.$indexFor(item.$id);
            console.log(index);
            list[index] = updateWidget(list[index]);
            list.$save(index).then(function (ref) {
              console.log('yes', ref.key());
              Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '选定成功!', 2000);
              $state.go('receptionist.priceList', {hairstylist: _.values(item.slave)[0]});
            })
          })
        }
      })
    };


    $scope.showDetail = function (hairstylist) {
      $state.go('receptionist.hairstylistDetail', {hairstylist: [hairstylist], type: 3});
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
    
    // $scope.moveItem = function(item, fromIndex, toIndex) {
    //   $scope.hairstylists.splice(fromIndex, 1);
    //   $scope.hairstylists.splice(toIndex, 0, item);
    //   console.log($scope.hairstylists)
    // };


  });