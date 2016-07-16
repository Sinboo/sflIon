/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonContactCtrl', function ($scope, $state, noBackGoTo, appModalService, listService, JoinList, UID, $ionicPopup) {
    $scope.goTo = noBackGoTo;

    var list = JoinList('hairstylistOfCustomer:'+UID(), 'hairstylist', 'hairstylistUid', 'updateAt');

    var initData = function () {
      list.$loaded().then(function (data) {
        $scope.contacts = data;
        angular.forEach($scope.contacts, function (item) {
          $.each(item.slave, function (k, v) {
            if (k.indexOf('-') > -1) {
              item.hairstylist = v
            }
          })
        });
        console.log($scope.contacts);
      });
    };
    initData();

    $scope.openHairstylistModal = function () {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistsModal.html',
        'HairstylistsModalCtrl as vm'
      ).then(function (val) {
        console.log(val)
        if (val) {
          listService.list('hairstylistOfCustomer:'+UID()).$add({hairstylistUid: val.hairstylistUid}).then(function (data) {
            initData();
          });
        }
      })
    };

    $scope.showDetail = function (hairstylist) {
      appModalService.show(
        'templates/customer/salon/modal/hairstylistDetailModal.html',
        'HairstylistDetailModalCtrl as vm',
        {hairstylist: [hairstylist.hairstylist]}
      ).then(function (val) {
        console.log(val)
        if (val) {
          appModalService.show(
            'templates/customer/salon/modal/priceListModal.html',
            'PriceListModalCtrl as vm',
            hairstylist
          ).then(function (val) {
            console.log(val);
            $state.go('createEditReservation', {reservation: {hairstylist: hairstylist.hairstylist, price: val}})
          })
        }
      })
    };
    
    $scope.deleteContact = function (contact) {
      var confirmPopup = $ionicPopup.confirm({
        title: '删除联系人?',
        template: '您确定要删除此联系人吗?',
        cancelText: '取消',
        okText: '确定',
        okType: 'button-balanced'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log(contact)
          var list = listService.list('hairstylistOfCustomer:'+UID());
          list.$loaded().then(function () {
            var deleteingContact = list.$indexFor(contact.$id);
            list.$remove(deleteingContact).then(function (data) {
              initData();
            });
          });
        }
      });
    }


  });