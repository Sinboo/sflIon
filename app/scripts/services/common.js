'use strict';

angular.module('sflIon')
  .factory('cache', function ($cacheFactory) {
    return $cacheFactory('cache');
  })
  .factory('sflIonCache', function ($cacheFactory) {
    return $cacheFactory('sflIonCache');
  })
  .factory('dataSetterGetter', function () {
    var savedData = {};
    function set(key, value) {
      savedData[key] = value;
    }
    function get(key) {
      return savedData[key];
    }
    return {
      set: set,
      get: get
    }
  })
  .factory('noBackGoTo', function ($state, $ionicHistory) {
    return function (page) {
      $state.go(page);
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
    }
  })
  .factory("createWidget", function(UID) {
    return function (data) {
      return angular.extend(data, {
        createAt: new Date().getTime(),
        createById: UID(),
        updateAt: new Date().getTime(),
        updateAtR: new Date().getTime() * -1,
        updateById: UID()
      })
    }
  })
  .factory("updateWidget", function(UID) {
    return function (data) {
      console.log('before', data)
      data.updateAt = new Date().getTime();
      data.updateAtR = new Date().getTime() * -1;
      data.updateById = UID();
      console.log('after', data);
      return data
    }
  })
  .factory('customerList', function (createWidget, updateWidget) {
    return function (list) {
      list.add = function (data) {
        return list.$add(createWidget(data))
      };
      list.save = function (data) {
        return list.$save(updateWidget(data))
      };
      return list;
    };
  })
  .factory('UID', function (localStorageService) {
    return function () {
      return localStorageService.cookie.get('user').uid.split(':')[1];
    }
  })
  .factory('userGroup', function (localStorageService) {
    return function () {
      return localStorageService.cookie.get('user').userGroup;
    }
  })
  .factory('UserProfile', function (listService, UID, userGroup) {
    return listService.list(userGroup()+':'+UID());
  })

  .service('commonService', function ($http, localStorageService, $q, $timeout, $state, $stateParams) {
    this.convertDate = function (d) {
      var date = new Date(d);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate();

      return Y + M + D ;
    };
    this.getDaysInOneMonth =  function(year, month){
      month = parseInt(month, 10);
      var d= new Date(year, month, 0);
      return d.getDate();
    };
    this.reload = function(hideContent) {
      return $state.transitionTo($state.current, $stateParams, {
        reload: true
      }).then(function() {
        hideContent = false;
        return $timeout(function() {
          return hideContent = true;
        },1);
      });
    };
    this.regMobile = function(mobile) {
      return RegExp(/^0?(17[6-7]|13[0-9]|15[0-9]|18[02356789]|14[57])[0-9]{8}$/).test(mobile)
    };
    this.regTel = function(tel) {
      return RegExp(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/).test(tel)
    };
    this.truncateDecimals = function (num, digits) {
      var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

      return parseFloat(finalResult);
    };
    


  });

