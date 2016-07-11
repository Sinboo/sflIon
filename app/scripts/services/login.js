'use strict';

angular.module('sflIon')
  .service('loginService', function (localStorageService, WD_URL, userGroup) {

    this.initUser = function () {
      function authDataCallback(authData) {
        if (authData) {
          authData.userGroup = userGroup();
          localStorageService.cookie.set('user', authData);
        } else {
          localStorageService.cookie.set('user', {anonymous: true});
        }
      }
      var ref = new Wilddog(WD_URL);
      ref.onAuth(authDataCallback);

      if(!localStorageService.cookie.get('user')){
        localStorageService.cookie.set('user', {anonymous: true});
      }
      if(localStorageService.cookie.get('user') && (new Date().getDate() - localStorageService.cookie.get('user').lastLoginTime ) > 7) {
        localStorageService.cookie.set('user', {anonymous: true});
      }
    };

  });
