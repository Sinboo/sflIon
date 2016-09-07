/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('ReceptionistSalonReservationCtrl', function ($rootScope, $scope, $state, WD_URL, UID, JoinList, noBackGoTo, appService, $ionicPopover, $ionicPopup, $location, listService, UserProfile, rfc4122, localStorageService, $wilddogArray, appModalService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.viewDate = new Date();
      $scope.now = new Date().getTime();
      initData();
      console.log($rootScope.previousState, $rootScope.previousState == 'receptionist.createEditReservation');
      if ($rootScope.previousState == 'receptionist.createEditReservation') {
        $scope.handleMargin = true;
      }
    });
    
    $scope.goTo = noBackGoTo;
    $scope.reservations = [];
    $scope.userProfile = UserProfile();

    var reservationList = listService.list('order');
    reservationList.$watch(function (event) {
      initData();
    });
    var initData = function () {
      // console.log($rootScope.reservationListFlag);
      if (!$rootScope.reservationListFlag) {
        reservationList.$loaded().then(function (data) {
          $rootScope.reservationListFlag = true;
          $scope.reservations = data;
          getReservations(moment($scope.viewDate._d || $scope.viewDate).startOf('day')._d);
        })
      }
      else {
        $scope.reservations = reservationList;
        getReservations(moment($scope.viewDate._d || $scope.viewDate).startOf('day')._d);
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
      // console.log($scope.seletedReservations)
    }

    $scope.openConversation = function (reservation) {
      console.log(reservation);
      var flag = false;
      var conversationList = listService.list('conversation:'+UID());
      var conversationList2 = listService.list('conversation:'+reservation.customerUid);
      conversationList.$loaded().then(function (data) {
        angular.forEach(data, function (item) {
          if (item.recipientId == reservation.customerUid) {
            $state.go('receptionist.chat', {conversation: item});
            flag = true;
          }
        });
        if (!flag) {
          var conversation = {};
          conversation.conversationId = rfc4122.v4();
          conversation.recipientId = reservation.customerUid;
          conversation.recipientName = reservation.customerName;
          conversation.recipientAvatar = reservation.customerAvatar;
          conversation.recipientMobile = reservation.customerMobile;
          conversation = JSON.parse(JSON.stringify(conversation));
          var conversation2 = {};
          conversation2.conversationId = conversation.conversationId;
          conversation2.recipientId = UID();
          conversation2.recipientName = $scope.userProfile.name;
          conversation2.recipientAvatar = $scope.userProfile.avatar;
          conversation2.recipientMobile = $scope.userProfile.mobile;
          conversation2.lastLeaveAt = 0;
          conversation2 = JSON.parse(JSON.stringify(conversation2));
          conversationList2.add(conversation2).then(function () {
            conversationList.add(conversation).then(function () {
              console.log(conversation);
              $state.go('receptionist.chat', {conversation: conversation});
            })
          })
        }
      });
    };

    $scope.cancelReservation = function (reservation) {
      console.log(reservation)
      $ionicPopup.confirm({
        title: '取消订单?',
        template: '确定取消该订单?',
        buttons: [{ text: '否' }, { text: '是', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        console.log(res);
        if(res == 'ok') {
          appModalService.show(
            'templates/receptionist/salon/modal/cancelReservationReasonModal.html',
            'CancelReservationReasonModalCtrl as vm'
          ).then(function (value) {
            console.log(value);
            if (value) {
              var order = reservationList.$getRecord(reservation.$id);
              order.type = 'canceled';
              order.cancelReason = value.reason || value.otherReason;
              reservationList.save(order).then(function (ref) {
                console.log(ref.key());
                Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '订单取消成功!', 2000);
                $state.go('receptionist.salonReservation');
              });
            }
          })
        }
      });
    };

    $scope.completeReservation = function (reservation) {
      $ionicPopup.confirm({
        title: '完成订单',
        template: '请选择支付方式',
        buttons: [{ text: '现金' }, { text: '手机支付', type: 'button-balanced', onTap: function(e) {return 'ok'}}]
      }).then(function(res) {
        console.log(res);
        if(res == 'ok') {

        }
        else {
          var order = reservationList.$getRecord(reservation.$id);
          order.type = 'completed';
          order.payment = '现金';
          reservationList.save(order).then(function (ref) {
            console.log(ref.key());
            Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '订单完成!', 2000);
            $state.go('receptionist.salonReservation');
          });
        }
      });
    };




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