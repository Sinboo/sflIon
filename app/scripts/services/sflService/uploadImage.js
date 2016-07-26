/**
 * Created by wxb on 16/7/24.
 */
'use strict';

angular.module('sflIon')
/**
 * 拍照功能
 */
  .factory('Camera', function($q) {
    return {
      getPicture: function(options) {
        var q = $q.defer();
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);

        return q.promise;
      }
    }
  })
  
  .factory('getFileObject', function () {
    return function (dataURI) {
      var byteString, mimestring;

      if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
      } else {
        byteString = decodeURI(dataURI.split(',')[1])
      }

      mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

      var content = new Array();
      for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
      }

      return new Blob([new Uint8Array(content)], {type: mimestring});
    }
  })
