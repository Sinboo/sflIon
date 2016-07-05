'use strict';

void function () {
  var app = angular.module('sflIon');

  var config = {
    WD_URL: 'https://wxb.wilddogio.com/',
    PRODUCT_GROUP: {
      hairCut: '剪发',
      perm: '烫染',
      hairExtension: '接发',
      hairCare: '护理类'
    },
    ORDER_GROUP: {
      booked: "预定",
      underDoing: '进行中',
      completed: '已完成',
      canceled: '已取消'
    }

    
  };

  angular.forEach(config, function (key, value) {
    app.constant(value, key);
  });
}();























