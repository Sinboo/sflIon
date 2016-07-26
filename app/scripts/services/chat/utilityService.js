'use strict';

angular.module('sflIon')
  .service('UtilityService', function() {
    this.convertObjectToArray = function(obj, keyAlias) {
      var arr, key, value;
      arr = [];
      if (keyAlias) {
        for (key in obj) {
          value = obj[key];
          value[keyAlias] = key;
          arr.push(value);
        }
      } else {
        for (key in obj) {
          value = obj[key];
          arr.push(value);
        }
      }
      return arr;
    };
    this.sortByAttribute = function(arr, attributeName) {
      return arr.sort(function(a, b) {
        return a[attributeName] - b[attributeName];
      });
    };
    this.sortByAttributeDescending = function(arr, attributeName) {
      return arr.sort(function(a, b) {
        return b[attributeName] - a[attributeName];
      });
    };
    return this;
  });
