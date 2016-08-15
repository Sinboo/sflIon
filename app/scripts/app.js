// Ionic sflIon App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'sflIon' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'sflIon.controllers' is found in controllers.js
angular.module('sflIon.directives', []);

angular.module('sflIon', [
  'ionic',
  'wilddog',
  'mwl.calendar',
  'angularMoment',
  'ion-sticky',
  'upyun',
  'uuid',
  'angular-drag-drop',
  'ionic-fullscreen',
  'ion-floating-menu',
  'angularValidateWithToast',
  'ionic-toast',
  'ngCordova',
  'ngIOS9UIWebViewPatch',
  'monospaced.elastic',
  'ionic.ui.modalService',
  'LocalStorageModule',
  'ion-datetime-picker',
  'ion-google-place',
  'chart.js',
  'sflIon.directives'
])
  .run(function($ionicPickerI18n) {
    $ionicPickerI18n.weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    $ionicPickerI18n.months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    $ionicPickerI18n.ok = "确定";
    $ionicPickerI18n.cancel = "取消";
  })
.run(function($ionicPlatform, $rootScope, localStorageService, loginService, $location, $state, $ionicLoading, WD_URL, amMoment, objectService, listService, ionicToast) {
  loginService.initUser();

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  $rootScope.$on('$stateChangeSuccess',
    function (event, toState, toParams, fromState, fromParams) {
      $rootScope.previousState = fromState.name;
      $rootScope.currentState = toParams.name;
      //$activityIndicator.stopAnimating();
      $ionicLoading.hide();
      // console.log(fromState, toState)
      // $rootScope.fromLogin = fromState.name == 'tailor.consoleOrderDoing' && toState.name == 'tailor.providerStockQuickQuery';

    });

  $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {
      if (error.state) {
        $state.go('error');
      }
      if (error == "Not Authorized") {
        $state.go("notAuthorized");
      }
    });

  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
      // console.log(fromState, toState)

      if (toState.name == 'authentication') return;

      if (localStorageService.cookie.get('user') == undefined || localStorageService.cookie.get('user').anonymous) {
        event.preventDefault();
        $state.go("authentication");
      }

      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    });

  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '加载中...'})
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  });

  moment.locale('zh-cn', {
    months : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weekdays : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekdaysShort : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    weekdaysMin : ['日', '一', '二', '三', '四', '五', '六'],
    calendar: {
      lastDay: '[昨天]',
      sameDay: '[今天]',
      nextDay: '[明天, ] dddd MMM Do',
      lastWeek: '[上个] dddd MMM Do',
      nextWeek: 'dddd MMM Do',
      sameElse: 'L'
    },
    longDateFormat : {
      L: "YYYY/MM/DD/"
    },
    ordinal : function (number) {
      var output = "日";
      return number + output;
    }
  });

  moment.locale('zh-cn', {
    relativeTime : {
      future: "将于 %s",
      past:   "%s之前",
      s:  "几秒钟",
      m:  "1分钟",
      mm: "%d分钟",
      h:  "1小时",
      hh: "%d小时",
      d:  "1天",
      dd: "%d天",
      M:  "1月",
      MM: "%d月",
      y:  "1年",
      yy: "%d年"
    },
    meridiem : function (hour, minute, isLowercase) {
      if (hour < 9) {
        return "早上";
      } else if (hour < 11 && minute < 30) {
        return "上午";
      } else if (hour < 13 && minute < 30) {
        return "中午";
      } else if (hour < 18) {
        return "下午";
      } else {
        return "晚上";
      }
    }
  });

})
  .config(function (localStorageServiceProvider, $httpProvider) {
    localStorageServiceProvider
      .setPrefix('sflIon');

    $httpProvider.interceptors.push(function($rootScope) {
      return {
        request: function(config) {
          $rootScope.$broadcast('loading:show');
          return config
        },
        response: function(response) {
          $rootScope.$broadcast('loading:hide');
          return response
        }
      }
    })
  })
  .config(['upyunProvider',function(upyunProvider) {
    upyunProvider.config({
      form_api_secret: 'ZeJhPE68fuX7jRkPMeFXOOyBl40=',
      bucket: 'imtailor'
    });
  }])

.config(function ($ionicConfigProvider, calendarConfig, ChartJsProvider) {

  // $ionicConfigProvider.tabs.style('standard').position('top');
  // $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.scrolling.jsScrolling(true);

  ChartJsProvider.setOptions({ colours: ['#26a69a', '#29b6f6', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

  calendarConfig.titleFormats.week = 'MMMM';
  calendarConfig.dateFormatter = 'moment';
  calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';
  calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM';
  calendarConfig.i18nStrings.weekNumber = 'Week {week}';
  calendarConfig.dateFormats.weekDay = 'ddd';
  calendarConfig.dateFormats.day = 'D';
  calendarConfig.displayAllMonthEvents = true;
  calendarConfig.displayEventEndTimes = true;
})

//Uncomment to add styling to sliding box page buttons
// .config(function ($provide) {
//           $provide.decorator('ionPagerDirective', function ($delegate) {
//               var directive = $delegate[0];
//               var template = directive.template;
//               directive.template = '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record" ng-show="$index !== currentSlide"></i><img class="slider-pager-img" src="img/dot_active.png" ng-show="$index == currentSlide"/></span></div>';


//               return $delegate;
//           });
//       })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('receptionist', {
      url: '^/receptionist',
      templateUrl: 'templates/common/receptionistSideMenu.html',
      controller: 'ReceptionistSideMenuCtrl',
      abstract: true
    })
    .state('receptionist.salonReservation', {
      url: '/salonReservation',
      views: {
        'menuContent': {
          templateUrl: 'templates/receptionist/salon/reservation.html',
          controller: 'ReceptionistSalonReservationCtrl'
        }
      }
    })
    .state('receptionist.createEditReservation', {
      url: '/createEditReservation',
      params: { reservation: null, value: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/receptionist/salon/createEditReservation.html',
          controller: 'ReceptionistCreateEditReservationCtrl'
        }
      }
    })
    
    
    .state('hairstylist', {
      url: '^/hairstylist',
      templateUrl: 'templates/common/hairstylistSideMenu.html',
      controller: 'HairstylistSideMenuCtrl',
      abstract: true
    })
    .state('hairstylist.salonReservation', {
      url: '/salonReservation',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/salon/reservation.html',
          controller: 'HairstylistSalonReservationCtrl'
        }
      }
    })
    .state('hairstylist.salonContact', {
      url: '/salonContact',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/salon/contact.html',
          controller: 'HairstylistSalonContactCtrl'
        }
      }
    })
    .state('hairstylist.salonStatistics', {
      url: '/salonStatistics',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/salon/statistics.html',
          controller: 'HairstylistSalonStatisticsCtrl'
        }
      }
    })


    .state('hairstylist.hairstylistDetail', {
      url: '/hairstylistDetail',
      params: { hairstylist: null, choosedPrice: null, type: null, isHairstylist: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/hairstylistDetail.html',
          controller: 'HairstylistDetailCtrl'
        }
      }
    })

    .state('hairstylist.squareList', {
      url: '/squareList',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/squareList.html',
          controller: 'SquareListCtrl'
        }
      }
    })
    .state('hairstylist.squareDetail', {
      url: '/squareDetail',
      params: { square: null, isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/squareDetail.html',
          controller: 'SquareDetailCtrl'
        }
      }
    })
    .state('hairstylist.createEditSquare', {
      url: '/createEditSquare',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/createEditSquare.html',
          controller: 'CreateEditSquareCtrl'
        }
      }
    })
    .state('hairstylist.fashionList', {
      url: '/fashionList',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/fashionList.html',
          controller: 'FashionListCtrl'
        }
      }
    })
    .state('hairstylist.fashionDetail', {
      url: '/fashionDetail',
      params: { fashion: null, isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/fashionDetail.html',
          controller: 'FashionDetailCtrl'
        }
      }
    })
    .state('hairstylist.createEditFashion', {
      url: '/createEditFashion',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/createEditFashion.html',
          controller: 'CreateEditFashionCtrl'
        }
      }
    })
    .state('hairstylist.createEditWork', {
      url: '/createEditWork',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/createEditWork.html',
          controller: 'CreateEditWorkCtrl'
        }
      }
    })
    .state('hairstylist.workList', {
      url: '/workList',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/workList.html',
          controller: 'HairstylistWorkListCtrl'
        }
      }
    })
    .state('hairstylist.workGroup', {
      url: '/workGroup',
      params: {isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/workGroup.html',
          controller: 'WorkGroupCtrl'
        }
      }
    })
    .state('hairstylist.works', {
      url: '/works',
      params: { group: null, hairstylist: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/works.html',
          controller: 'HairstylistWorksCtrl'
        }
      }
    })
    .state('hairstylist.workDetail', {
      url: '/workDetail',
      params: { work: null, isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/workDetail.html',
          controller: 'WorkDetailCtrl'
        }
      }
    })
    .state('hairstylist.comment', {
      url: '/comment',
      params: { workId: null, choosedLike: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/comment.html',
          controller: 'CommentCtrl'
        }
      }
    })




    .state('hairstylist.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account/account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('hairstylist.editProfile', {
      url: '/editProfile',
      views: {
        'menuContent': {
          templateUrl: 'templates/account/editProfile.html',
          controller: 'EditProfileCtrl'
        }
      }
    })

    .state('hairstylist.conversation', {
      url: '/conversation',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat/conversation.html',
          controller: 'ConversationCtrl'
        }
      }
    })
    .state('hairstylist.chat', {
      url: '/chat',
      params: {conversation: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/chat/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })

    .state('hairstylist.customerDetail', {
      url: '/customerDetail',
      params: { customer: null, type: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/salon/customerDetail.html',
          controller: 'CustomerDetailCtrl'
        }
      }
    })
    .state('hairstylist.maintainCustomer', {
      url: '/maintainCustomer',
      params: { customer: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/salon/maintainCustomer.html',
          controller: 'MaintainCustomerCtrl'
        }
      }
    })

    .state('hairstylist.customerMaintains', {
      url: '/customerMaintains',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/customerMaintain/customerMaintains.html',
          controller: 'CustomerMaintainsCtrl'
        }
      }
    })
    .state('hairstylist.addCustomerMaintain', {
      url: '/addCustomerMaintain',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/customerMaintain/addCustomerMaintain.html',
          controller: 'AddCustomerMaintainCtrl'
        }
      }
    })
    
    
    
    
    
    

      
    .state('customer', {
      url: '^/customer',
      templateUrl: 'templates/common/customerSideMenu.html',
      controller: 'CustomerSideMenuCtrl',
      abstract: true
    })
    .state('customer.salonReservation', {
      url: '/salonReservation',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/reservation.html',
          controller: 'SalonReservationCtrl'
        }
      }
    })
    .state('customer.createEditReservation', {
      url: '/createEditReservation',
      params: { reservation: null, value: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/createEditReservation.html',
          controller: 'CreateEditReservationCtrl'
        }
      }
    })
    .state('customer.priceList', {
      url: '/priceList',
      params: { hairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/priceList.html',
          controller: 'PriceListCtrl'
        }
      }
    })
    .state('customer.workGroup', {
      url: '/workGroup',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/workGroup.html',
          controller: 'WorkGroupCtrl'
        }
      }
    })
    .state('customer.hairstylists', {
      url: '/hairstylists',
      params: { price: null, hairstylist: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/hairstylists.html',
          controller: 'HairstylistsCtrl'
        }
      }
    })
    .state('customer.hairstylistDetail', {
      url: '/hairstylistDetail',
      params: { hairstylist: null, choosedPrice: null, type: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/hairstylistDetail.html',
          controller: 'HairstylistDetailCtrl'
        }
      }
    })
    .state('customer.customerDetail', {
      url: '/customerDetail',
      params: { customer: null, type: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/customerDetail.html',
          controller: 'CCustomerDetailCtrl'
        }
      }
    })
    .state('customer.works', {
      url: '/works',
      params: { group: null, hairstylist: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/works.html',
          controller: 'WorksCtrl'
        }
      }
    })
    .state('customer.workDetail', {
      url: '/workDetail',
      params: { work: null, isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/workDetail.html',
          controller: 'WorkDetailCtrl'
        }
      }
    })
    .state('customer.comment', {
      url: '/comment',
      params: { workId: null, choosedLike: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/comment.html',
          controller: 'CommentCtrl'
        }
      }
    })

    .state('customer.salonContact', {
      url: '/salonContact',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/contact.html',
          controller: 'SalonContactCtrl'
        }
      }
    })
    .state('customer.salonBusyStatus', {
      url: '/salonBusyStatus',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/salon/busyStatus.html',
          controller: 'SalonBusyStatusCtrl'
        }
      }
    })
    
    .state('customer.workList', {
      url: '/workList',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/hairstylistAndWork/workList.html',
          controller: 'WorkListCtrl'
        }
      }
    })
    .state('customer.hairstylistList', {
      url: '/hairstylistList',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer/hairstylistAndWork/hairstylistList.html',
          controller: 'HairstylistListCtrl'
        }
      }
    })
    .state('customer.squareList', {
      url: '/squareList',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/squareList.html',
          controller: 'SquareListCtrl'
        }
      }
    })
    .state('customer.squareDetail', {
      url: '/squareDetail',
      params: { square: null, isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/squareDetail.html',
          controller: 'SquareDetailCtrl'
        }
      }
    })
    .state('customer.createEditSquare', {
      url: '/createEditSquare',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/createEditSquare.html',
          controller: 'CreateEditSquareCtrl'
        }
      }
    })
    .state('customer.fashionList', {
      url: '/fashionList',
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/fashionList.html',
          controller: 'FashionListCtrl'
        }
      }
    })
    .state('customer.fashionDetail', {
      url: '/fashionDetail',
      params: { fashion: null, isHairstylist: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/hairstylist/showcase/fashionDetail.html',
          controller: 'FashionDetailCtrl'
        }
      }
    })
    

    .state('customer.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account/account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('customer.editProfile', {
      url: '/editProfile',
      views: {
        'menuContent': {
          templateUrl: 'templates/account/editProfile.html',
          controller: 'EditProfileCtrl'
        }
      }
    })

    .state('customer.conversation', {
      url: '/conversation',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat/conversation.html',
          controller: 'ConversationCtrl'
        }
      }
    })
    .state('customer.chat', {
      url: '/chat',
      params: {conversation: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/chat/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })



    .state('board', {
      url: '/board',
      templateUrl: 'templates/board/board.html',
      controller: 'BoardCtrl'
    })
    
    
    
    .state('authentication', {
      url: '/authentication',
      templateUrl: 'templates/authentication/authentication.html',
      controller: 'AuthenticationCtrl'
    })
    .state('intro', {
      url: '/intro',
      templateUrl: 'templates/intro/intro.html'
    });

  $urlRouterProvider.otherwise('/intro')
});
