'use strict';

void function () {
  var app = angular.module('sflIon');

  var config = {
    WD_URL: 'https://wxb.wilddogio.com/',
    PAGE_SIZE: 5,
    PRICE_GROUP: {
      wash: '洗吹造型',
      cut: '洗剪造型',
      color: '时尚染发',
      perm: '时尚烫发',
      nursing: '营养护理'
    },
    ORDER_GROUP: {
      booked: "预定",
      underDoing: '进行中',
      completed: '已完成',
      canceled: '已取消'
    },
    N_VIP_PRICE: {
      normalPrice: '普通价',
      vipPrice: 'VIP专享价'
    }


    // 'A': {
    //   price: 249,
    //   notes: '发色自然,柔顺富有光泽'
    // },
    // 'B': {
    //   price: 336,
    //   notes: '内含保湿因子,使秀发损伤减至最小'
    // },
    // 'C': {
    //   price: 499,
    //   notes: '烫发同时给予头发超强滋养,效果真实'
    // },
    // 'D': {
    //   price: '6元/克',
    //   notes: '专业发型师使用,特为亚洲人士发质而设'
    // }


    // 'A': {
    //   price: 249,
    //   notes: '花卷曲度持久,发质自然'
    // },
    // 'B': {
    //   price: 336,
    //   notes: '富含充分滋养成分,花型更健康'
    // },
    // 'C': {
    //   price: 499,
    //   notes: '滋养平衡配方,特效护理,赋予健康弹性'
    // },
    // 'D': {
    //   price: '6元/克',
    //   notes: '全生态配方,烫后发型健康自然'
    // }

    //
    // 'A': {
    //   price: 199,
    //   notes: '花卷曲度持久,发质自然'
    // },
    // 'B': {
    //   price: 299,
    //   notes: '刺激发内蛋白更新,令头发极具弹性和动感'
    // },
    // 'C': {
    //   price: 399,
    //   notes: '自然温和配方,不伤发质,充满弹性与生机'
    // },
    // '生化烫': {
    //   price: 336,
    //   notes: '整体效果柔顺轻盈,特别适合亚洲人的发质'
    // }


    // 'A': {
    //   price: 108,
    //   notes: '补充长期流失的保湿因子及营养,令头发柔顺亮泽'
    // },
    // 'B': {
    //   price: 198,
    //   notes: '专业护发,让受损发质重新恢复生机'
    // },
    // 'A套装': {
    //   price: 398
    // },
    // 'B套装': {
    //   price: 698
    // }
    

    
  };

  angular.forEach(config, function (key, value) {
    app.constant(value, key);
  });
}();























