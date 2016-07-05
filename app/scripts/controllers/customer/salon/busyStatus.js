/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('SalonBusyStatusCtrl', function ($scope, noBackGoTo, $location) {
    $scope.goTo = noBackGoTo;
    
    console.log($location.path())


  });