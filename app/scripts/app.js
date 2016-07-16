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
  'ngCordova',
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
.run(function($ionicPlatform, $rootScope, localStorageService, loginService, $location, $state, $ionicLoading) {
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

  loginService.initUser();

  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '加载中...'})
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
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

.config(function ($ionicConfigProvider, calendarConfig, ChartJsProvider) {

  // $ionicConfigProvider.tabs.style('standard').position('top');
  // $ionicConfigProvider.navBar.alignTitle('center');

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
    // .state('tabs', {
    //   url: '/tabs',
    //   templateUrl: 'templates/common/sidemenu.html',
    //   abstract: true
    // })
    //
    // .state('tabs.news', {
    //   url: '/news',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/news/news.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.post-detail', {
    //   url: '/post-detail',
    //   params: { post: null },
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/news/post.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.comments', {
    //   url: '/comments',
    //   params: { post: null },
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/news/comments.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.likes', {
    //   url: '/likes',
    //   params: { post: null },
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/news/likes.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // //Dashboard
    // .state('tabs.dashboard', {
    //   url: '/dashboard',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/dashboard/dashboard.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.reminders', {
    //   url: '/reminders',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/dashboard/reminders.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('create-edit-reminder', {
    //   url: '/create-edit-reminder',
    //   params: { reminder: null, type: null },
    //   templateUrl: 'templates/dashboard/create-edit-reminder.html',
    //   controller: 'appCtrl'
    // })
    //
    // .state('tabs.contacts', {
    //   url: '/contacts',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/dashboard/contacts.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.history', {
    //   url: '/history',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/dashboard/history.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.shop-front', {
    //   url: '/shop-front',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/shop/shop-front.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.basket', {
    //   url: '/basket',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/shop/basket.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.checkout', {
    //   url: '/checkout',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/shop/checkout.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.thanks', {
    //   url: '/thanks',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/shop/thanks.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    //
    // .state('tabs.calendar', {
    //   url: '/calendar',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/settings/calendar.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.account', {
    //   url: '/account',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/account/account.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.edit-profile', {
    //   url: '/edit-profile',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/account/edit-profile.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.chat', {
    //   url: '/chat',
    //   params: { chat: null },
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/chat/chat.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    // .state('tabs.conversations', {
    //   url: '/conversations',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/chat/conversations.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    //
    //
    //
    // .state('tabs.more', {
    //   url: '/more',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/settings/more.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.cards', {
    //   url: '/cards',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/settings/cards.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.animate', {
    //   url: '/animate',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/settings/animate.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.components', {
    //   url: '/forms',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/settings/components.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })
    // .state('tabs.materialize', {
    //   url: '/materialize',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/settings/materialize.html',
    //       controller: 'appCtrl'
    //     }
    //   }
    // })


      
    .state('customer', {
      url: '^/customer',
      templateUrl: 'templates/common/customerSideMenu.html',
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
    .state('createEditReservation', {
      url: '/createEditReservation',
      params: { reservation: null },
      templateUrl: 'templates/customer/salon/createEditReservation.html',
      controller: 'CreateEditReservationCtrl',
      resolve: {
        userProfile: function(UserProfile){
          return UserProfile;
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
