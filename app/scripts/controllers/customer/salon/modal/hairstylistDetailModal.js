/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('HairstylistDetailModalCtrl', function ($scope, parameters, JoinList, dataSetterGetter, listService, N_VIP_PRICE, appModalService, $wilddogAuth, WD_URL) {
    var vm = this;
    vm.type = 1;
    vm.hairstylist = parameters.hairstylist[0];
    console.log(vm.hairstylist);

    listService.list('like:'+vm.hairstylist.uid).$loaded().then(function (likes) {
      vm.hairstylist.likes = likes;
    });

    vm.works = JoinList('workOfHairstylsit:'+vm.hairstylist.uid, 'work', 'workId', 'updateAt');


    vm.confirm = function(formData) {
      $scope.closeModal(formData);
    };
    vm.cancel = function() {
      $scope.closeModal(null);
    };

    // var hairstylist = listService.list('hairstylist');
    // hairstylist.$loaded().then(function (data) {
    //   console.log(data)
    //   angular.forEach(data, function (hairstylist) {
    //     listService.list('workOfHairstylsit:'+hairstylist.$id).$add({workId: '-KMZRde25Xk7z2xnXqzh'})
    //   })
    // })
    
  });