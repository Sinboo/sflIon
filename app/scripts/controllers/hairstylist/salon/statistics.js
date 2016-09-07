/**
 * Created by wxb on 16/7/2.
 */

'use strict';
angular.module('sflIon')
  .controller('HairstylistSalonStatisticsCtrl', function ($scope, $state, noBackGoTo, listService, JoinList, appModalService, $ionicPopover, appService, $ionicModal) {
    $scope.goTo = noBackGoTo;
    $scope._ = _;

    function initDashboard() {
      chartData();

      $scope.viewDate = new Date();
      $scope.notifyTimes = ['at set time', '15 mins before', '30 mins before', '45 mins before', 'an hour before'];
      $scope.notifications = appService.getNotifications();
      getDateEvents(moment($scope.viewDate._d).startOf('day')._d);

      $scope.decrementDate = function (item) {
        if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').subtract(1, 'days');
        else $scope.viewDate = moment($scope.viewDate._d).startOf('day').subtract(1, 'days');
        getDateEvents($scope.viewDate._d)
      };

      $scope.incrementDate = function (item) {
        if (angular.isUndefined($scope.viewDate._d)) $scope.viewDate = moment($scope.viewDate).startOf('day').add(1, 'days');
        else $scope.viewDate = moment($scope.viewDate._d).startOf('day').add(1, 'day');
        getDateEvents($scope.viewDate._d)
      };
      function getDateEvents(date) {
        var range = moment().range(date, moment(date).endOf('day'));
        $scope.seletedDateEvents = [];
        angular.forEach($scope.notifications, function (value, key) {
          if (moment(value.startsAt).within(range)) {
            $scope.seletedDateEvents.push(value);
          }
        });
      }

      if ($state.is('create-edit-reminder')) {
        $stateParams.reminder !== null ? $scope.reminder = angular.copy($stateParams.reminder) : $scope.reminder = { type: 'Add Task', startsAt: new Date(), endsAt: new Date(), allDay: true, remindTime: [] };
        $stateParams.type !== null ? $scope.reminder.type = angular.copy($stateParams.type) : null;
      }

      // $scope.reminderPopover = $ionicPopover.fromTemplate(reminderTemplate, {
      //   scope: $scope
      // });

      $ionicModal.fromTemplateUrl('templates/dashboard/remind-at-modal.html', {
        scope: $scope,
        animation: 'fade-in-scale'
      }).then(function (modal) {
        $scope.modalRemindAt = modal;
      });
      $scope.openRemindAt = function () {
        $scope.modalRemindAt.show();
      };
      $scope.closeRemindAt = function () {
        $scope.modalRemindAt.hide();
      };

      $scope.notifyCheck = function (index, item) {
        if (angular.isUndefined($scope.reminder.remindTime[index])) {
          $scope.reminder.remindTime[index] = item;
        } else {
          $scope.reminder.remindTime[index] = false;
        }
      }

      $scope.saveReminder = function () {
        if ($scope.reminderForm.$valid) {
          if ($stateParams.reminder === null) {
            $rootScope.notifications.push($scope.reminder);
          } else {
            $rootScope.notifications.splice($rootScope.notifications.indexOf(_.find($rootScope.notifications, function (obj) { return obj == $stateParams.reminder })), 1, $scope.reminder);
          }
        } else {
          appService.showAlert('Form Invalid', '<p class="text-center">A title and start date is required</p>', 'Ok', 'button-assertive', null);
        }
      }

      function chartData() {
        $scope.line_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        $scope.line_data = [
          [65, 59, 80, 81, 56, 55, 40],
          [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.doughnut_labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.doughnut_data = [300, 500, 100];
      }
    }
    initDashboard();

  });