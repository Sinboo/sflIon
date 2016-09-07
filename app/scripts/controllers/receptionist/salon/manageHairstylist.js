/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('ManageHairstylistCtrl', function ($scope, $state, UserProfile, noBackGoTo, upyun, rfc4122, $ionicLoading, ionicToast, listService, objectService, userGroup, UID, updateWidget, localStorageService, $ionicActionSheet, $cordovaCamera, $timeout, appService, getFileObject, HAIRSTYLIST_RANK, HAIRSTYLIST_STAR, PRICE_GROUP) {
    $scope.noBackGoTo = noBackGoTo;
    $scope._ = _;
    $scope.userGroup = userGroup();
    $scope.hairstylist = $state.params.hairstylist || {};
    console.log($scope.hairstylist);
    $scope.hairstylist.priceIds = {};
    $scope.hairstylistStars = HAIRSTYLIST_STAR;
    $scope.hairstylistRanks = HAIRSTYLIST_RANK;
    $scope.PRICE_GROUP = PRICE_GROUP;

    var cutDeleteFlag = undefined;
    var washDeleteFlag = undefined;
    $scope.priceObj = objectService.object('price');
    console.log($scope.priceObj);
    $scope.priceList = listService.list('price');
    console.log($scope.priceList);
    $scope.hairstylistUnderPrice = listService.list('hairstylistUnderPrice');
    console.log($scope.hairstylistUnderPrice);
    $scope.hairstylistUnderPrice.$loaded(function (data) {
      angular.forEach(data, function (item) {
        angular.forEach(_.values(item), function (p) {
          if (p && p.hairstylistUid == $scope.hairstylist.uid) {
            if (p.priceGroup) {
              $scope.hairstylist.priceIds[item.$id] = p.priceGroup;
            }
            else {
              $scope.hairstylist.priceIds[item.$id] = item.$id;
            }
          }
        })
      });
    });


    $scope.mustInputErrorTips = {
      required: '请填写必填项'
    };

    $scope.validate = function (hairstylist) {
      if (!hairstylist.rank) {ionicToast.show('请选择头衔!', 'top', false, 2000);return false;}
      if (!hairstylist.rating) {ionicToast.show('请选择星级!', 'middle', false, 2000);return false;}
      return true;
    };

    $scope.setDeleteFlag = function (k) {
      if (_.has($scope.priceObj.cut, k)) {
        cutDeleteFlag = k
      }
      if (_.has($scope.priceObj.wash, k)) {
        washDeleteFlag = k
      }
    };


    $scope.save = function (hairstylist) {
      console.log(hairstylist.priceIds, 'cutDeleteFlag:', cutDeleteFlag, 'washDeleteFlag:', washDeleteFlag)
      $.each(hairstylist.priceIds, function (k, v) {
        console.log(k, v);
        var list = listService.list('hairstylistUnderPrice:'+k);
        list.$loaded().then(function (data) {
          console.log(data);
          var HUP = _.findWhere(data, {hairstylistUid: $scope.hairstylist.uid});
          console.log(HUP);
          if (!HUP) {
            if (v == 'cut' || v == 'wash') {
              if (k == cutDeleteFlag || k == washDeleteFlag) {
                list.add({hairstylistUid: $scope.hairstylist.uid, priceGroup: v}).then(function () {
                  console.log('add', k)
                })
              }
            }
            else {
              list.add({hairstylistUid: $scope.hairstylist.uid}).then(function () {
                console.log('add', k)
              })
            }
          }
          else {
            var index = list.$indexFor(HUP.$id);
            console.log(index, _.has($scope.priceObj.cut, k), cutDeleteFlag, washDeleteFlag, k);
            if ( _.has($scope.priceObj.cut, k) && (cutDeleteFlag && cutDeleteFlag != k) ) {
              list.$remove(index).then(function () {
                console.log('delete', k);
              });
            }
            if ( _.has($scope.priceObj.wash, k) && (washDeleteFlag && washDeleteFlag != k) ) {
              list.$remove(index).then(function () {
                console.log('delete', k);
              });
            }
          }
        })
      });

      var hairstylistList =  listService.list('hairstylist:'+$scope.hairstylist.uid);
      hairstylistList.$loaded(function (data) {
        hairstylistList[0].rank = hairstylist.rank;
        hairstylistList[0].rating = hairstylist.rating;
        hairstylistList[0] = JSON.parse(JSON.stringify(hairstylistList[0]));
        hairstylistList.$save(0).then(function (ref) {
          console.log('yes', ref.key());
          Materialize.toast('<i class="icon ion-checkmark-round"></i>' + '设置成功!', 2000);
          $state.go('receptionist.salonHairstylistManage');
        });
      });

    };

    
  });