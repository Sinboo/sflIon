/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ChoosePriceModalCtrl', function ($scope, parameters, listService, N_VIP_PRICE, appModalService, $wilddogAuth, WD_URL) {
    var vm = this;
    vm.group = parameters.group;
    vm.hairstylist = parameters.hairstylist;
    console.log(vm.hairstylist);
    var uid = vm.hairstylist.hairstylistUid || vm.hairstylist.uid;

    if (vm.hairstylist) {
      listService.list('price:'+parameters.group).$loaded().then(function (data) {
        var priceList = [];
        angular.forEach(data, function (item) {
          if (parameters.group == 'wash' || parameters.group == 'cut') {
            if (item.name == '艺术导师') {
              var price = {};
              price.name = item.name;
              price.subName = item.price.notes;
              price.number = item.price.normalPrice;
              price.id = item.$id;
              listService.list('hairstylistUnderPrice:'+price.id).$loaded().then(function (hairstylist) {
                angular.forEach(hairstylist, function (h) {
                  if (uid == h.hairstylistUid) {
                    priceList.push(price);
                  }
                })
              })
            }
            else {
              $.each(item.price, function (k, v) {
                var price = {};
                price.name = item.name;
                price.subName = N_VIP_PRICE[k] ? '-' + N_VIP_PRICE[k] : N_VIP_PRICE[k];
                price.number = v;
                price.id = item.$id;
                listService.list('hairstylistUnderPrice:'+price.id).$loaded().then(function (hairstylist) {
                  angular.forEach(hairstylist, function (h) {
                    if (uid == h.hairstylistUid) {
                      priceList.push(price);
                    }
                  })
                })
              })
            }

          }
          else {
            $.each(item.price, function (k, v) {
              var price = {};
              price.name = item.name + k + '类';
              price.subName = v.notes ? '-' + v.notes : v.notes;
              price.number = v.price;
              price.id = item.$id;
              priceList.push(price);
            })
          }
        });
        vm.priceList = priceList;
      });
    }
    else {
      listService.list('price:'+vm.group).$loaded().then(function (data) {
        var priceList = [];
        angular.forEach(data, function (item) {
          if (parameters.group == 'wash' || parameters.group == 'cut') {
            if (item.name == '艺术导师') {
              var price = {};
              price.name = item.name;
              price.subName = item.price.notes;
              price.number = item.price.normalPrice;
              price.id = item.$id;
              priceList.push(price);
            }
            else {
              $.each(item.price, function (k, v) {
                var price = {};
                price.name = item.name;
                price.subName = N_VIP_PRICE[k] ? '-' + N_VIP_PRICE[k] : N_VIP_PRICE[k];
                price.number = v;
                price.id = item.$id;
                priceList.push(price);
              })
            }

          }
          else {
            $.each(item.price, function (k, v) {
              var price = {};
              price.name = item.name + k + '类';
              price.subName = v.notes ? '-' + v.notes : v.notes;
              price.number = v.price;
              price.id = item.$id;
              priceList.push(price);
            })
          }
        });
        vm.priceList = priceList;
      });
    }

    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };


    
  });