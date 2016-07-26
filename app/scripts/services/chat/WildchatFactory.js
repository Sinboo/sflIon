'use strict';

angular.module('sflIon')
  .factory("WildchatFactory", function($q, UtilityService, WD_URL, UserProfile) {
    var WildchatFactory, currentRoom, errorWildchatNotInitialized, errorInvalidAuthData, errorInvalidMessage, errorInvalidRoomId, wilddogRef, wildchatRef, getInvitations, getRoomMetaAndPushToArray, initializeWilddog, initializeWildchat, selectUnansweredInvitations, setCurrentRoom;
    WildchatFactory = {};
    wilddogRef = null;
    wildchatRef = null;
    currentRoom = {
      id: null,
      name: null
    };
    WildchatFactory.initialize = function() {
      initializeWilddog();
      return initializeWildchat();
    };
    WildchatFactory.getAllUsers = function() {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else {
          return wilddogRef.child('users').on('value', function(snapshot) {
            return resolve(snapshot.val());
          });
        }
      });
    };
    WildchatFactory.setUser = function() {
      var uid, username, userProfile;
      userProfile = UserProfile();
      uid = userProfile.uid;
      username = userProfile.name;
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else if ((!uid) || (!username)) {
          return reject(errorInvalidAuthData());
        } else {
          return wildchatRef.setUser(uid, username, function(user) {
            return resolve(user);
          });
        }
      });
    };
    WildchatFactory.getRoomListByUser = function(userid) {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else {
          return wilddogRef.child('users').orderByKey().equalTo(userid).on('value', function(snapshot) {
            return resolve(snapshot.val()[userid].rooms);
          });
        }
      });
    };
    WildchatFactory.getRoomMetadata = function(roomId) {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else {
          return wildchatRef.getRoom(roomId, function(metadata) {
            return resolve(metadata);
          });
        }
      });
    };
    WildchatFactory.createRoom = function(roomName, roomType) {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else {
          return wildchatRef.createRoom(roomName, roomType, function(roomId) {
            return resolve(roomId);
          });
        }
      });
    };
    WildchatFactory.enterRoom = function(roomId, roomName) {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else if ((!roomId) || (!roomName)) {
          return reject(errorInvalidRoomId());
        } else {
          wildchatRef.enterRoom(roomId);
          setCurrentRoom(roomId, roomName);
          return resolve();
        }
      });
    };
    WildchatFactory.getUnansweredInvitations = function(userid) {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else {
          return getInvitations(userid).then(function(invites) {
            var arrInvites, unanswered;
            arrInvites = UtilityService.convertObjectToArray(invites);
            unanswered = selectUnansweredInvitations(arrInvites);
            return resolve(unanswered);
          });
        }
      });
    };
    WildchatFactory.inviteUser = function(userId, roomId) {
      return wildchatRef.inviteUser(userId, roomId);
    };
    WildchatFactory.acceptInvitation = function(inviteId) {
      return $q(function(resolve, reject) {
        return wildchatRef.acceptInvite(inviteId, function(data) {
          return resolve(data);
        });
      });
    };
    WildchatFactory.declineInvitation = function(inviteId) {
      return $q(function(resolve, reject) {
        return wildchatRef.declineInvite(inviteId, function(data) {
          return resolve(data);
        });
      });
    };
    WildchatFactory.getMessages = function(roomId) {
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else {
          return wilddogRef.child('room-messages').orderByKey().equalTo(roomId).on('value', function(snapshot) {
            if (snapshot.val()) {
              return resolve(snapshot.val()[roomId]);
            } else {
              return resolve();
            }
          });
        }
      });
    };
    WildchatFactory.sendMessage = function(roomId, message, messageType) {
      if (messageType == null) {
        messageType = "default";
      }
      return $q(function(resolve, reject) {
        if (!wildchatRef) {
          return reject(errorWildchatNotInitialized());
        } else if ((!roomId) || (!message)) {
          return reject(errorInvalidMessage());
        } else {
          return wildchatRef.sendMessage(roomId, message, messageType, function(data) {
            return resolve(data);
          });
        }
      });
    };
    WildchatFactory.bindToWildchat = function(eventID, callback) {
      return wildchatRef.on(eventID, callback);
    };
    WildchatFactory.addRoomMetadataToInvitations = function(invitations) {
      return $q(function(resolve, reject) {
        var inv, j, len, res;
        res = [];
        for (j = 0, len = invitations.length; j < len; j++) {
          inv = invitations[j];
          getRoomMetaAndPushToArray(inv, res);
        }
        return resolve(res);
      });
    };
    WildchatFactory.getCurrentUser = function() {
      return wildchatRef._user;
    };
    WildchatFactory.getCurrentRoom = function() {
      return currentRoom;
    };
    setCurrentRoom = function(id, name) {
      currentRoom.id = id;
      return currentRoom.name = name;
    };
    getRoomMetaAndPushToArray = function(inv, arr) {
      return WildchatFactory.getRoomMetadata(inv.roomId).then(function(meta) {
        inv.roomName = meta.name;
        return arr.push(inv);
      })["catch"](function(error) {
        inv.roomName = '(Data unavailable)';
        return arr.push(inv);
      });
    };
    getInvitations = function(userid) {
      return $q(function(resolve, reject) {
        return wilddogRef.child('users').orderByKey().equalTo(userid).on('value', function(snapshot) {
          var invitations;
          invitations = snapshot.val()[userid]['invites'];
          if (invitations) {
            return resolve(invitations);
          } else {
            return resolve();
          }
        });
      });
    };
    selectUnansweredInvitations = function(invitations) {
      var i, j, len, unanswered;
      unanswered = [];
      for (j = 0, len = invitations.length; j < len; j++) {
        i = invitations[j];
        if (!i.status) {
          unanswered.push(i);
        }
      }
      return unanswered;
    };
    initializeWilddog = function() {
      return wilddogRef = new Wilddog(WD_URL + '/wildchat');
    };
    initializeWildchat = function() {
      return wildchatRef = new Wildchat(wilddogRef);
    };
    errorWildchatNotInitialized = function() {
      return {
        code: null,
        message: 'Wildchat is uninitialized'
      };
    };
    errorInvalidAuthData = function() {
      return {
        code: null,
        message: 'Invalid authdata'
      };
    };
    errorInvalidRoomId = function() {
      return {
        code: null,
        message: 'Invalid room ID'
      };
    };
    errorInvalidMessage = function() {
      return {
        code: null,
        message: 'Invalid message'
      };
    };
    return WildchatFactory;
  });

