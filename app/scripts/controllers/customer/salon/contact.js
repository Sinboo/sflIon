/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonContactCtrl', function ($scope, $state, noBackGoTo, appModalService, listService, JoinList, UID, $ionicPopup, $ionicPopover) {
    $scope.goTo = noBackGoTo;
    $scope._ = _;

    $scope.contacts = JoinList('hairstylistOfCustomer:'+UID(), 'hairstylist', 'hairstylistUid', 'updateAt');
    console.log($scope.contacts);

    $scope.openHairstylist = function () {
      $state.go('customer.hairstylists');
    };

    $scope.showDetail = function (hairstylist) {
      $state.go('customer.hairstylistDetail', {hairstylist: [hairstylist]});
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
          var list1 = listService.list('hairstylistOfCustomer:'+UID());
          list1.$loaded().then(function () {
            var deletingContact = list1.$indexFor(contact.$id);
            list1.$remove(deletingContact);
          });
          var list2 = listService.list('customerOfHairstylist:'+contact.hairstylistUid);
          list2.$loaded().then(function (data) {
            var customerOfHairstylist = _.findWhere(data, {customerUid: UID()});
            var key = customerOfHairstylist.$id;
            console.log(customerOfHairstylist, key)
            var deletingContact = list2.$indexFor(key);
            list2.$remove(deletingContact);
          });
        }
      });
    }

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