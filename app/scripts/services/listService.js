/**
 * Created by wxb on 16/7/1.
 */
'use strict';

angular.module('sflIon')
  .service("listService", function(WD_URL, $wilddogArray, customerList, PAGE_SIZE) {
    this.list = function (childName, query) {
      var ref = childName.indexOf(':') !== -1 ? query || new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]) : query || new Wilddog(WD_URL).child(childName);
      var list = $wilddogArray(ref);
      return customerList(list);
    };
    this.scrollList = function (childName, field) {
      var ref = childName.indexOf(':') !== -1 ? new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]) : new Wilddog(WD_URL).child(childName);
      var scrollRef = new Wilddog.util.Scroll(ref, field);
      // create a synchronized array on scope
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: ref
      }
    };
    this.joinScrollList = function (childName, childName2, masterKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave', 'master.'+masterKey]
      )
        .select('master.'+masterKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave.$value', alias: 'slave'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.join3ScrollList = function (childName, childName2, childName3, masterKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+masterKey],
        [ref3, 'slave2', 'master.'+masterKey]
      )
        .select('master.'+masterKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.join4ScrollList = function (childName, childName2, childName3, childName4, masterKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var ref4 = new Wilddog(WD_URL).child(childName4);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+masterKey],
        [ref3, 'slave2', 'master.'+masterKey],
        [ref4, 'slave3', 'master.'+masterKey]
      )
        .select('master.'+masterKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'},
          {key: 'slave3.$value', alias: 'slave3'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.join4by2keyScrollList = function (childName, childName2, childName3, childName4, secondaryKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var ref4 = new Wilddog(WD_URL).child(childName4);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+secondaryKey],
        [ref3, 'slave2'],
        [ref4, 'slave3']
      )
        .select('master.'+secondaryKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'},
          {key: 'slave3.$value', alias: 'slave3'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.join5by2keyScrollList = function (childName, childName2, childName3, childName4, childName5, secondaryKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var ref4 = new Wilddog(WD_URL).child(childName4);
      var ref5 = new Wilddog(WD_URL).child(childName5);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+secondaryKey],
        [ref3, 'slave2', 'master.'+secondaryKey],
        [ref4, 'slave3'],
        [ref5, 'slave4']
      )
        .select('master.'+secondaryKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'},
          {key: 'slave3.$value', alias: 'slave3'},
          {key: 'slave4.$value', alias: 'slave4'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.join6by2keyScrollList = function (childName, childName2, childName3, childName4, childName5, childName6, secondaryKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var ref4 = new Wilddog(WD_URL).child(childName4);
      var ref5 = new Wilddog(WD_URL).child(childName5);
      var ref6 = new Wilddog(WD_URL).child(childName6);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+secondaryKey],
        [ref3, 'slave2', 'master.'+secondaryKey],
        [ref4, 'slave3', 'master.'+secondaryKey],
        [ref5, 'slave4'],
        [ref6, 'slave5']
      )
        .select('master.'+secondaryKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'},
          {key: 'slave3.$value', alias: 'slave3'},
          {key: 'slave4.$value', alias: 'slave4'},
          {key: 'slave5.$value', alias: 'slave5'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.join5ScrollList = function (childName, childName2, childName3, childName4, childName5, masterKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var ref4 = new Wilddog(WD_URL).child(childName4);
      var ref5 = new Wilddog(WD_URL).child(childName5);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+masterKey],
        [ref3, 'slave2', 'master.'+masterKey],
        [ref4, 'slave3', 'master.'+masterKey],
        [ref5, 'slave4', 'master.'+masterKey]
      )
        .select('master.'+masterKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'},
          {key: 'slave3.$value', alias: 'slave3'},
          {key: 'slave4.$value', alias: 'slave4'}
        )
        .ref();
      var scrollRef = new Wilddog.util.Scroll(norm, field);
      var list = $wilddogArray(scrollRef);
      return {
        list: customerList(list),
        scrollRef: scrollRef,
        ref: norm
      }
    };
    this.pageList = function (childName, field) {
      var ref = childName.indexOf(':') !== -1 ? new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]) : new Wilddog(WD_URL).child(childName);
      var pageRef = new Wilddog.util.Paginate(ref, field, {maxCacheSize: 250, pageSize: PAGE_SIZE});
      // generate a synchronized array using the special page ref
      var list = $wilddogArray(pageRef);
      // store the "page" scope on the synchronized array for easy access
      list.page = pageRef.page;
      // when the page count loads, update local scope vars
      pageRef.page.onPageCount(function(currentPageCount, couldHaveMore) {
        list.pageCount = currentPageCount;
        list.couldHaveMore = couldHaveMore;
      });
      // when the current page is changed, update local scope vars
      pageRef.page.onPageChange(function(currentPageNumber) {
        list.currentPageNumber = currentPageNumber;
      });
      // load the first page
      pageRef.page.next();
      return customerList(list);
    }
  })
  .factory('ListLoadMore', function (listService, WD_URL) {
    function ListLoadMore (childName, field, limit) {
      this.ref = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      this.first = true;
      this.childName = childName;
      this.field = field;
      this.limit = limit;
      this.endPoint = null;
      this.query = null;
      this.hasNext = true;
    }
    ListLoadMore.prototype.loadMore = function (callback) {
      var _this = this;
      this.query = this.field == 'key' ? this.ref.orderByKey().startAt(this.endPoint).limitToFirst(this.limit) : this.ref.orderByChild(this.field).startAt(this.endPoint).limitToFirst(this.limit);
      listService.list(this.childName, this.query).$loaded().then(function (data) {
        _this.endPoint = _this.field == 'key' ? data[data.length-1].$id : data[data.length-1][_this.field];
        if (_this.first === true) {
          _this.limit += 1;
        } else {
          data.shift()
        }
        _this.hasNext = data.length > 0;
        callback(data);
        _this.first = false;
      })
    };
    return ListLoadMore;
  })
  .factory('JoinListLoadMore', function (listService, WD_URL) {
    function JoinListLoadMore (childName, childName2, masterKey, field, limit) {
      this.ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      this.ref2 = new Wilddog(WD_URL).child(childName2);
      this.norm = new Wilddog.util.NormalizedCollection(
        [this.ref1, 'master'],
        [this.ref2, 'slave', 'master.'+masterKey]
      )
        .select('master.'+masterKey, 'master.'+field,
          {key: 'slave.$value', alias: 'slave'}
        )
        .ref();
      this.first = true;
      this.childName = childName;
      this.field = field;
      this.limit = limit;
      this.endPoint = null;
      this.query = null;
      this.hasNext = true;
    }
    JoinListLoadMore.prototype.loadMore = function (callback) {
      var _this = this;
      this.query = this.norm.orderByChild(this.field).startAt(this.endPoint).limitToFirst(this.limit);
      listService.list('', this.query).$loaded().then(function (data) {
        _this.endPoint = data[data.length-1][_this.field];
        if (_this.first === true) {
          _this.limit += 1;
        } else {
          data.shift()
        }
        _this.hasNext = data.length > 0;
        callback(data);
        _this.first = false;
      }).catch(function(error) {
        console.log("Error:", error);
        callback('error');
      });
    };
    return JoinListLoadMore;
  })
  .factory('JoinList', function (listService, WD_URL) {
    function buildNorm(childName, childName2, masterKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var norm;
      if (masterKey == 'theKey') {
        norm = new Wilddog.util.NormalizedCollection(
          [ref1, 'master'],
          [ref2, 'slave']
        )
          .select('master.'+field,
            {key: 'master.$value', alias: 'master'},
            {key: 'slave.$value', alias: 'slave'}
          )
          .ref();
      }
      else {
        norm = new Wilddog.util.NormalizedCollection(
          [ref1, 'master'],
          [ref2, 'slave', 'master.'+masterKey]
        )
          .select('master.'+masterKey, 'master.'+field,
            {key: 'master.$value', alias: 'master'},
            {key: 'slave.$value', alias: 'slave'}
          )
          .ref();
      }
      return norm;
    }

    return function (childName, childName2, masterKey, field) {
      var norm = buildNorm(childName, childName2, masterKey, field);
      var query = norm.orderByChild(field);
      return listService.list('', query)
    };
  })
  .factory('Join3List', function (listService, WD_URL) {
    function buildNorm(childName, childName2, childName3, masterKey, field) {
      var ref1 = childName.indexOf(':') === -1 ? new Wilddog(WD_URL).child(childName) : new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]);
      var ref2 = new Wilddog(WD_URL).child(childName2);
      var ref3 = new Wilddog(WD_URL).child(childName3);
      var norm = new Wilddog.util.NormalizedCollection(
        [ref1, 'master'],
        [ref2, 'slave1', 'master.'+masterKey],
        [ref3, 'slave2', 'master.'+masterKey]
      )
        .select('master.'+masterKey, 'master.'+field,
          {key: 'master.$value', alias: 'master'},
          {key: 'slave1.$value', alias: 'slave1'},
          {key: 'slave2.$value', alias: 'slave2'}
        )
        .ref();
      return norm;
    }

    return function (childName, childName2, childName3, masterKey, field) {
      var norm = buildNorm(childName, childName2, childName3, masterKey, field);
      var query = norm.orderByChild(field);
      return listService.list('', query)
    };
  })

;