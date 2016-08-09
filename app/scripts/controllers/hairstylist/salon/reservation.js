/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('HairstylistSalonReservationCtrl', function ($rootScope, $scope, $state, WD_URL, UID, JoinList, noBackGoTo, appService, $ionicPopover, $location, listService, localStorageService, $wilddogArray, appModalService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      initData();
    });


    $scope.viewDate = new Date();
    $scope.now = new Date().getTime();
    $scope.goTo = noBackGoTo;
    $scope.reservations = [];

    var reservationList = JoinList('orderOfHairstylist:'+UID(), 'order', 'orderId', 'updateAt');
    var initData = function () {
      reservationList.$loaded().then(function (data) {
        $scope.reservations = data;
        console.log(data);
        getReservations(moment($scope.viewDate._d).startOf('day')._d);
      })
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


  });