/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('ReceptionistSalonReservationCtrl', function ($rootScope, $scope, $state, WD_URL, UID, JoinList, noBackGoTo, appService, $ionicPopover, $location, listService, localStorageService, $wilddogArray, appModalService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.viewDate = new Date();
      $scope.now = new Date().getTime();
      initData();
      console.log($rootScope.previousState, $rootScope.previousState == 'customer.createEditReservation')
      if ($rootScope.previousState == 'customer.createEditReservation') {
        $scope.handleMargin = true;
      }
    });
    
    $scope.goTo = noBackGoTo;
    $scope.reservations = [];

    var reservationList = listService.list('order');
    reservationList.$watch(function (event) {
      initData();
    });
    var initData = function () {
      console.log($rootScope.reservationListFlag);
      if (!$rootScope.reservationListFlag) {
        reservationList.$loaded().then(function (data) {
          $rootScope.reservationListFlag = true;
          $scope.reservations = data;
          getReservations(moment($scope.viewDate._d || $scope.viewDate).startOf('day')._d);
        })
      }
      else {
        $scope.reservations = reservationList;
      }
    };

    $scope.showDetail = function (reservation) {
      if (reservation.workId) {
        listService.list('work').$loaded().then(function (works) {
          var work = works.$getRecord(reservation.workId);
          $state.go('customer.workDetail', {work: {workId: reservation.workId, slave1: work}});
        });
      }
      else if (reservation.hairstylistUid) {
        listService.list('hairstylist:' + reservation.hairstylistUid).$loaded().then(function (hairstylist) {
          $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist[0]]});
        });
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
        if (moment(value.bookedStartAt).within(range)) {
          $scope.seletedReservations.push(value);
        }
      });
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
    }



    
    



  });