/**
 * Created by wxb on 16/7/1.
 */
'use strict';

angular.module('sflIon')
  .service("objectService", function(WD_URL, $wilddogObject) {
    this.object = function (childName) {
      var ref = childName.indexOf(':') !== -1 ? new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]) : new Wilddog(WD_URL).child(childName);
      var object = $wilddogObject(ref);
      return object;
    };
  })
   