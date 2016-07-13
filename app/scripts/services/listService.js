/**
 * Created by wxb on 16/7/1.
 */
'use strict';

angular.module('sflIon')
  .service("listService", function(WD_URL, $wilddogArray, customerList) {
    this.list = function (childName, query) {
      var ref = childName.indexOf(':') !== -1 ? query || new Wilddog(WD_URL).child(childName.split(':')[0]).child(childName.split(':')[1]) : query || new Wilddog(WD_URL).child(childName);
      var list = $wilddogArray(ref);
      return customerList(list);
    };
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
        callback(data);
        _this.first = false;
      })
    };
    return JoinListLoadMore;
  })
  .factory('Paginator', function (WD_URL) {
    function Paginator(childName, limit) {
      this.ref = new Wilddog(WD_URL + childName);
      this.pageNumber = 0;
      this.limit = limit;
      this.lastPageNumber = null;
      this.currentSet = {};
    }

    Paginator.prototype = {
      nextPage: function (callback) {
        if (this.isLastPage()) {
          callback(this.currentSet);
        }
        else {
          var lastKey = getLastKey(this.currentSet);
          // if there is no last key, we need to use undefined as priority
          var pri = lastKey ? null : undefined;
          this.ref.startAt(pri, lastKey)
            .limit(this.limit + (lastKey ? 1 : 0))
            .once('value', this._process.bind(this, {
              cb: callback,
              dir: 'next',
              key: lastKey
            }));
        }
      },

      prevPage: function (callback) {
        console.log('prevPage', this.isFirstPage(), this.pageNumber);
        if (this.isFirstPage()) {
          callback(this.currentSet);
        }
        else {
          var firstKey = getFirstKey(this.currentSet);
          // if there is no last key, we need to use undefined as priority
          this.ref.endAt(null, firstKey)
            .limit(this.limit + 1)
            .once('value', this._process.bind(this, {
              cb: callback,
              dir: 'prev',
              key: firstKey
            }));
        }
      },

      isFirstPage: function () {
        return this.pageNumber === 1;
      },

      isLastPage: function () {
        return this.pageNumber === this.lastPageNumber;
      },

      _process: function (opts, snap) {
        var vals = snap.val(), len = size(vals);
        console.log('_process', opts, len, this.pageNumber, vals);
        if (len < this.limit) {
          // if the next page returned some results, it becomes the last page
          // otherwise this one is
          this.lastPageNumber = this.pageNumber + (len > 0 ? 1 : 0);
        }
        if (len === 0) {
          // we don't know if this is the last page until
          // we try to fetch the next, so if the next is empty
          // then do not advance
          opts.cb(this.currentSet);
        }
        else {
          if (opts.dir === 'next') {
            this.pageNumber++;
            if (opts.key) {
              dropFirst(vals);
            }
          } else {
            this.pageNumber--;
            if (opts.key) {
              dropLast(vals);
            }
          }
          this.currentSet = vals;
          opts.cb(vals);
        }

      }
    }




      function getLastKey(obj) {
      var key;
      if (obj) {
        each(obj, function (v, k) {
          key = k;
        });
      }
      return key;
    }

    function getFirstKey(obj) {
      var key;
      if (obj) {
        each(obj, function (v, k) {
          key = k;
          return true;
        });
      }
      return key;
    }

    function dropFirst(obj) {
      if (obj) {
        delete obj[getFirstKey(obj)];
      }
      return obj;
    }

    function dropLast(obj) {
      if (obj) {
        delete obj[getLastKey(obj)];
      }
      return obj;
    }

    function each(obj, cb) {
      if (obj) {
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            var res = cb(obj[k], k);
            if (res === true) {
              break;
            }
          }
        }
      }
    }

    function size(obj) {
      var i = 0;
      each(obj, function () {
        i++;
      });
      return i;
    }

    return Paginator;
  })