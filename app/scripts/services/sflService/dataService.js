/**
 * Created by wxb on 16/7/14.
 */
'use strict';

angular.module('sflIon')
  .service('workOfGroup', function (JoinListLoadMore, PAGE_SIZE) {
    var F_SHORT = new JoinListLoadMore('workOfGroup:F_SHORT', 'work', 'workId', 'updateAt', PAGE_SIZE);
    var F_MID = new JoinListLoadMore('workOfGroup:F_MID', 'work', 'workId', 'updateAt', PAGE_SIZE);
    var F_LONG = new JoinListLoadMore('workOfGroup:F_LONG', 'work', 'workId', 'updateAt', PAGE_SIZE);
    var MAN = new JoinListLoadMore('workOfGroup:MAN', 'work', 'workId', 'updateAt', PAGE_SIZE);
    var PERM = new JoinListLoadMore('workOfGroup:PERM', 'work', 'workId', 'updateAt', PAGE_SIZE);
    var COLOR = new JoinListLoadMore('workOfGroup:COLOR', 'work', 'workId', 'updateAt', PAGE_SIZE);

    var groupLoadUtil = {
      F_SHORT : F_SHORT,
      F_MID : F_MID,
      F_LONG : F_LONG,
      MAN : MAN,
      PERM : PERM,
      COLOR : COLOR
    };
    
    this.loadUtil= function (group) {
      return groupLoadUtil[group];
    }
  })
  .service('allHairstylist', function (JoinListLoadMore, PAGE_SIZE) {
    var allHairstylist = new JoinListLoadMore('allHairstylist', 'hairstylist', 'hairstylistUid', 'updateAt', PAGE_SIZE);
    this.loadUtil = function () {
      return allHairstylist;
    }
  })

;


