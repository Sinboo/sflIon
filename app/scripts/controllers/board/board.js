/**
 * Created by wxb on 16/7/2.
 */
'use strict';
angular.module('sflIon')
  .controller('BoardCtrl', function ($scope, $location, board) {
    // var defaultImgUrl = 'http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2011/10/26/180060-a-pomeranian-dressed-as-zorro-the-spanish-masked-swordsman-in-the-movi.jpg';
    var defaultImgUrl = 'http://imtailor.b0.upaiyun.com/63082b61-aac0-44f2-a718-b63e5bcc7ea4.jpg';
    $scope.defaultImgUrl = defaultImgUrl;
    var params = $location.search();
    var clearWinListener;

    var watchForWin = function() {
      if (clearWinListener) clearWinListener();

      clearWinListener = $scope.$watch('board.pieces', function(pieces) {
        console.log(pieces);
        if (pieces.reduce(function(winning, pieceNum, pieceIdx) {
            return winning && pieceNum === pieceIdx;
          }, true)) {
          alert('You won in ' + $scope.moves + ' moves at difficulty ' + $scope.board.difficulty + '!');

          init();
        }
      }, true);
    };

    var init = function() {
      $scope.board = board;
      console.log($scope.board);

      $scope.moves = 0;

      $scope.board.init(params.img || defaultImgUrl, parseInt(params.grid, 10) || 4, parseInt(params.difficulty, 10) || 30)
        .then(watchForWin);
    };


    $scope.move = function(idxA, idxB) {
      if ($scope.board.swap(idxA, idxB)) $scope.moves++;
    };

    init();
    
  });