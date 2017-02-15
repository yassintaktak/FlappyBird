
window.onload = function() {
  var canvas = document.getElementById("canvas");
  var width = canvas.width = 389;
  var height = canvas.height = 450;
  var context = canvas.getContext("2d");
  var img = new Image();
  var started = false;
  var player = Math.floor(Math.random()*3);
  var playing = false;
  var jumped = false;
  var gameover = false;
  var player_id=0;

  var mouse = {
    x : 0,
    y : 0,
    down : false
  }
  var player_pos = {
    y : 169,
    x : width/2-34
  }
  var map = new Array();

  for(var i=0; i<500; i++) {
    l1 = Math.random()*200+70;
    map.push({x : i*200+390, len1 : l1, len2 : height-l1-(Math.random()*50+35)});
  }

  function placeAsset(img, fw, fh, x, y, row, col, rw, rh) {
    context.drawImage(img, fw*col, fh*row, fw, fh, x, y, rw, rh);
  }

  window.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  window.onmousedown = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.down = true;
  }
  window.onmouseup = function() {
    mouse.down = false;
  }
  window.onkeydown = function(e) {
    if(e.keyCode == 32) {
      player_id=0;
      jumped = true;
      playing = true;
    }
  }
  window.onkeyup = function(e) {
    if(e.keyCode == 32) {
      player_id=0;
      jumped = false;
      playing = true;
    }
  }
  function inRange(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  }
  function rangeIntersect(min0, max0, min1, max1) {
		return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
	}
	function rectIntersect(r0, r1) {
		return rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  }

  function render() {
    context.clearRect(0, 0, width*300, height);

    var dt = new Date();
    if(dt.getHours() >= 18) {
      co = 1;
    } else {
      co = 0;
    }
    if(!started) {
      placeAsset(img, 292, 450, 0, 0, 0, co, width, height);
      placeAsset(img, 200, 55, width/2-115, 50, 3.2, 3.4, 200, 50);
      placeAsset(img, 124, 60, width/2-67, 150, 3.9, 5.63, 124, 60);
    } else {
      for(i=0; i<50; i++) {
        placeAsset(img, 292, 450, (width-10)*i, 0, 0, co, width, height);
      }
      if(!playing) {
        placeAsset(img, 185, 41, width/2-92, 60, 2.9, 3.2, 185, 41);
        placeAsset(img, 120, 116, width/2-75, 160, 1.45, 4.84, 120, 116);
      }
      switch(player) {
        case 0:
          if(player_id == 0) {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 23.5, 5.7, 40, 30);
          } else if(player_id == 1) {
            placeAsset(img, 40, 30,player_pos.x, player_pos.y, 21.8, 5.7, 40, 30);
          } else {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 32.6, 4.3, 40, 30);
          }
          break;
        case 1:
          if(player_id == 0) {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 32.6, 2.85, 40, 30);
          } else if(player_id == 1) {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 32.6, 1.5, 40, 30);
          } else {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 32.6, 0.1, 40, 30);
          }
          break;
        case 2:
          if(player_id == 0) {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 28.7, 5.65, 40, 30);
          } else if(player_id == 1) {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 27, 5.65, 40, 30);
          } else {
            placeAsset(img, 40, 30, player_pos.x, player_pos.y, 25.25, 5.65, 40, 30);
          }
          break;
      }

      for(var i=0; i<500; i++) {
        bar = map[i];
        placeAsset(img, 62, 280, bar.x, 0, 2.5, 1.73, 62, bar.len1);
        placeAsset(img, 60, 280, bar.x, height-bar.len2, 2.3, 2.75, 60, bar.len2);
      }

      if(playing  && !jumped && !gameover) {
        player_pos.y += 1.8;
      } else if(jumped && !gameover) {
        player_pos.y -= 3;
        player_id=2;
      }
      if(playing && !gameover) {
        context.translate(-.9, 0);
        player_pos.x -= -.9;
      }

      if(playing && !gameover) {
        for(var i=0; i<500; i++) {
          bar = map[i];
          if(rectIntersect({
            x : player_pos.x,
            y : player_pos.y,
            width : 20,
            height : 20
          }, {
            x : bar.x,
            y : 0,
            width : 62,
            height : bar.len1-15
          }) || rectIntersect({
            x : player_pos.x,
            y : player_pos.y,
            width : 20,
            height : 20
          }, {
            x : bar.x,
            y : height-bar.len2,
            width : 60,
            height : bar.len2-15
          })) {
            playing = false;
            gameover = true;
          }
        }
      }

      if(player_pos.y > height) {
        gameover = true;
      }

      if(gameover) {
        placeAsset(img, 185, 41, player_pos.x-50, 60, 2.9, 4.3, 185, 41);
      }
    }
    if(inRange(mouse.x, width/2-67, 150 + 124) && inRange(mouse.y, 150, 150 + 60) && mouse.down && !started) {
      started = true;
    }
    requestAnimationFrame(render);
  }

  img.src = "asset.png";
  img.onload = function() {
    render();
  }

}
