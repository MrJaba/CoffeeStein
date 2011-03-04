(function() {
  var $, Player, bindKeys, castRays, castSingleRay, checkVerticalLines, dc, drawMiniMap, drawRay, facingRight, facingUp, gameCycle, init, initScreen, isBlocking, updateMiniMap;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = function(id) {
    return document.getElementById(id);
  };
  dc = function(tag) {
    return document.createElement(tag);
  };
  this.map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 3, 0, 3, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1], [1, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], [1, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 4, 0, 0, 4, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 4, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 4, 3, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
  this.mapWidth = 0;
  this.mapHeight = 0;
  this.miniMapScale = 8;
  this.frameRate = 30;
  this.screenStrips = [];
  init = function() {
    this.player = new Player();
    this.mapWidth = this.map[0].length;
    this.mapHeight = this.map.length;
    initScreen();
    drawMiniMap();
    return gameCycle();
  };
  initScreen = function() {
    var i, img, screen, strip, _ref, _results;
    screen = $("screen");
    _results = [];
    for (i = 0, _ref = this.screenWidth; (0 <= _ref ? i <= _ref : i >= _ref); i += this.stripWidth) {
      strip = dc("div");
      strip.style.position = "absolute";
      strip.style.left = i + "px";
      strip.style.width = this.stripWidth + "px";
      strip.style.height = "0px";
      strip.style.overflow = "hidden";
      img = new Image();
      img.src = "/img/walls.png";
      img.style.position = "absolute";
      img.style.left = "0px";
      strip.appendChild(img);
      strip.img = img;
      this.screenStrips.push(strip);
      _results.push(screen.appendChild(strip));
    }
    return _results;
  };
  gameCycle = function() {
    this.player.move();
    updateMiniMap();
    castRays();
    return setTimeout(gameCycle, 1000 / this.frameRate);
  };
  drawMiniMap = function() {
    var context, miniMap, wall, x, y, _ref, _results;
    miniMap = $("minimap");
    miniMap.width = this.mapWidth * this.miniMapScale;
    miniMap.height = this.mapHeight * this.miniMapScale;
    miniMap.style.width = (this.mapWidth * this.miniMapScale) + "px";
    miniMap.style.height = (this.mapHeight * this.miniMapScale) + "px";
    context = miniMap.getContext("2d");
    _results = [];
    for (y = 0, _ref = this.mapHeight; (0 <= _ref ? y < _ref : y > _ref); (0 <= _ref ? y += 1 : y -= 1)) {
      _results.push((function() {
        var _ref, _results;
        _results = [];
        for (x = 0, _ref = this.mapWidth; (0 <= _ref ? x < _ref : x > _ref); (0 <= _ref ? x += 1 : x -= 1)) {
          wall = this.map[y][x];
          _results.push(wall > 0 ? (context.fillStyle = "rgb(200,200,200)", context.fillRect(x * this.miniMapScale, y * this.miniMapScale, this.miniMapScale, this.miniMapScale)) : void 0);
        }
        return _results;
      }).call(this));
    }
    return _results;
  };
  updateMiniMap = function() {
    var miniMap, miniMapObjects, objectContext;
    miniMap = $("minimap");
    miniMapObjects = $("minimapobjects");
    objectContext = miniMapObjects.getContext("2d");
    objectContext.clearRect(0, 0, miniMap.width, miniMap.height);
    objectContext.fillRect(this.player.x * this.miniMapScale - 2, this.player.y * this.miniMapScale - 2, 4, 4);
    objectContext.beginPath();
    objectContext.moveTo(this.player.x * this.miniMapScale, this.player.y * this.miniMapScale);
    objectContext.lineTo((player.x + Math.cos(this.player.rotation) * 4) * this.miniMapScale, (this.player.y + Math.sin(this.player.rotation) * 4) * this.miniMapScale);
    objectContext.closePath();
    return objectContext.stroke();
  };
  isBlocking = function(x, y) {
    if (y < 0 || y >= this.mapHeight || x < 0 || x >= this.mapWidth) {
      return true;
    }
    return this.map[Math.floor(y)][Math.floor(x)] !== 0;
  };
  jQuery(document).ready(function() {
    init();
    return bindKeys();
  });
  bindKeys = function() {
    jQuery(document).keydown(__bind(function(event) {
      var e;
      e = event || window.event;
      switch (e.keyCode) {
        case 38:
          return this.player.speed = 1;
        case 40:
          return this.player.speed = -1;
        case 37:
          return this.player.dir = -1;
        case 39:
          return this.player.dir = 1;
      }
    }, this));
    return jQuery(document).keyup(__bind(function(event) {
      var e;
      e = event || window.event;
      switch (e.keyCode) {
        case 38:
        case 40:
          return this.player.speed = 0;
        case 37:
        case 39:
          return this.player.dir = 0;
      }
    }, this));
  };
  Player = (function() {
    function Player(opts) {
      this.x = 16;
      this.y = 10;
      this.dir = 0;
      this.rotation = 0;
      this.speed = 0;
      this.moveSpeed = 0.18;
      this.rotateSpeed = 6 * Math.PI / 180;
    }
    Player.prototype.move = function() {
      var blocking, moveStep, newX, newY, _ref;
      moveStep = this.speed * this.moveSpeed;
      this.rotation += this.dir * this.rotateSpeed;
      newX = this.x + Math.cos(this.rotation) * moveStep;
      newY = this.y + Math.sin(this.rotation) * moveStep;
      blocking = isBlocking(newX, newY);
      if (!blocking) {
        return _ref = [newX, newY], this.x = _ref[0], this.y = _ref[1], _ref;
      }
    };
    return Player;
  })();
  this.screenWidth = 320;
  this.screenHeight = 200;
  this.stripWidth = 4;
  this.fov = 60 * Math.PI / 180;
  this.numRays = Math.ceil(this.screenWidth / this.stripWidth);
  this.fovHalf = this.fov / 2;
  this.viewDist = (this.screenWidth / 2) / Math.tan(this.fov / 2);
  this.twoPI = Math.PI * 2;
  this.numTextures = 4;
  facingRight = function(rayAngle) {
    return rayAngle > this.twoPI * 0.75 || rayAngle < this.twoPI * 0.25;
  };
  facingUp = function(rayAngle) {
    return rayAngle < 0 || rayAngle > Math.PI;
  };
  castRays = function() {
    var rayAngle, rayIndex, rayScreenPosition, rayViewDistance, stripId, _ref, _results;
    stripId = 0;
    _results = [];
    for (rayIndex = 0, _ref = this.numRays; (0 <= _ref ? rayIndex < _ref : rayIndex > _ref); (0 <= _ref ? rayIndex += 1 : rayIndex -= 1)) {
      rayScreenPosition = (-this.numRays / 2 + rayIndex) * this.stripWidth;
      rayViewDistance = Math.sqrt(rayScreenPosition * rayScreenPosition + this.viewDist * this.viewDist);
      rayAngle = Math.asin(rayScreenPosition / rayViewDistance);
      _results.push(castSingleRay(this.player.rotation + rayAngle, stripId++));
    }
    return _results;
  };
  castSingleRay = function(rayAngle, stripId) {
    var angleCos, angleSin, blockDist, dXHor, dYHor, dist, distX, distY, height, right, slope, strip, texX, textureX, top, up, wallType, wallX, wallY, width, x, xHit, y, yHit, _ref;
    rayAngle %= this.twoPI;
    if (rayAngle < 0) {
      rayAngle += this.twoPI;
    }
    angleSin = Math.sin(rayAngle);
    angleCos = Math.cos(rayAngle);
    right = facingRight(rayAngle);
    up = facingUp(rayAngle);
    _ref = checkVerticalLines(right, up, angleSin, angleCos), dist = _ref[0], wallType = _ref[1], textureX = _ref[2];
    slope = angleCos / angleSin;
    dYHor = up ? -1 : 1;
    dXHor = dYHor * slope;
    y = up ? Math.floor(this.player.y) : Math.ceil(this.player.y);
    x = this.player.x + (y - this.player.y) * slope;
    while (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      wallY = Math.floor(y + (up ? -1 : 0));
      wallX = Math.floor(x);
      if (map[wallY][wallX] > 0) {
        distX = x - this.player.x;
        distY = y - this.player.y;
        blockDist = distX * distX + distY * distY;
        if (!dist || blockDist < dist) {
          dist = blockDist;
          xHit = x;
          yHit = y;
          wallType = map[wallY][wallX];
          textureX = x % 1;
          if (up) {
            textureX = 1 - textureX;
          }
        }
        break;
      }
      x += dXHor;
      y += dYHor;
    }
    if (dist) {
      strip = this.screenStrips[stripId];
      dist = Math.sqrt(dist);
      dist = dist * Math.cos(this.player.rotation - rayAngle);
      height = Math.round(this.viewDist / dist);
      width = height * this.stripWidth;
      top = Math.round((this.screenHeight - height) / 2);
      strip.style.height = height + "px";
      strip.style.top = top + "px";
      strip.img.style.height = Math.floor(height * this.numTextures) + "px";
      strip.img.style.width = Math.floor(width * 2) + "px";
      strip.img.style.top = -Math.floor(height * (wallType - 1)) + "px";
      texX = Math.round(textureX * width);
      if (texX > width - this.stripWidth) {
        texX = width - this.stripWidth;
      }
      return strip.img.style.left = -texX + "px";
    }
  };
  checkVerticalLines = function(right, up, angleSin, angleCos) {
    var dXVer, dYVer, dist, distX, distY, slope, textureX, wallType, wallX, wallY, x, xHit, y, yHit;
    slope = angleSin / angleCos;
    dXVer = right ? 1 : -1;
    dYVer = dXVer * slope;
    x = right ? Math.ceil(this.player.x) : Math.floor(this.player.x);
    y = this.player.y + (x - this.player.x) * slope;
    while (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      wallX = Math.floor(x + (right ? 0 : -1));
      wallY = Math.floor(y);
      if (map[wallY][wallX] > 0) {
        distX = x - this.player.x;
        distY = y - this.player.y;
        dist = distX * distX + distY * distY;
        wallType = map[wallY][wallX];
        textureX = y % 1;
        if (!right) {
          textureX = 1 - textureX;
        }
        xHit = x;
        yHit = y;
        break;
      }
      x += dXVer;
      y += dYVer;
    }
    return [dist, wallType, textureX];
  };
  drawRay = function(rayX, rayY) {
    var miniMapObjects, objectContext;
    miniMapObjects = $("minimapobjects");
    objectContext = miniMapObjects.getContext("2d");
    objectContext.strokeStyle = "rgba(0,100,0,0.3)";
    objectContext.lineWidth = 0.5;
    objectContext.beginPath();
    objectContext.moveTo(this.player.x * this.miniMapScale, this.player.y * this.miniMapScale);
    objectContext.lineTo(rayX * this.miniMapScale, rayY * this.miniMapScale);
    objectContext.closePath();
    return objectContext.stroke();
  };
}).call(this);
