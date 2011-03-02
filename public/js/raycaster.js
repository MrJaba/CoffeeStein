(function() {
  var blockDist, castRays, castSingleRay, dist, distX, distY, drawRay, textureX, wallX, wallY, xHit, yHit;
  this.screenWidth = 320;
  this.stripWidth = 4;
  this.fov = 60 * Math.PI / 180;
  this.numRays = Math.ceil(this.screenWidth / this.stripWidth);
  this.fovHalf = this.fov / 2;
  this.viewDist = (this.screenWidth / 2) / Math.tan(this.fov / 2);
  this.twoPI = Math.PI * 2;
  castRays = function() {
    var rayAngle, rayIndex, rayScreenPosition, rayViewDistance, _results;
    _results = [];
    for (rayIndex = 0; (0 <= numRays ? rayIndex < numRays : rayIndex > numRays); (0 <= numRays ? rayIndex += 1 : rayIndex -= 1)) {
      rayScreenPosition = (-numRays / 2 + rayIndex) * this.stripWidth;
      rayViewDistance = Math.sqrt(rayScreenPosition * rayScreenPosition + viewDist * viewDist);
      rayAngle = Math.asin(rayScreenPosition / rayViewDistance);
      _results.push(castSingleRay(this.player.rotation + rayAngle, rayIndex));
    }
    return _results;
  };
  castSingleRay = function(rayAngle, stripId) {
    var angleCos, angleSin, dX, dY, dist, distX, distY, right, slope, textureX, up, wallX, wallY, x, xHit, y, yHit;
    rayAngle %= this.twoPI;
    if (rayAngle < 0) {
      rayAngle += this.twoPI;
    }
    right = rayAngle > this.twoPI * 0.75 || rayAngle < this.twoPI * 0.25;
    up = rayAngle < 0 || rayAngle > Math.PI;
    angleSin = Math.sin(rayAngle);
    angleCos = Math.cos(rayAngle);
    dist = 0;
    xHit = 0;
    yHit = 0;
    textureX;
    wallX;
    wallY;
    slope = angleSin / angleCos;
    dX = right ? 1 : -1;
    dY = dX * slope;
    x = right ? Math.ceil(this.player.x) : Math.floor(this.player.x);
    y = this.player.y + (x - this.player.x) * slope;
    while (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
      wallX = Math.floor(x + (right ? 0 : -1));
      wallY = Math.floor(y);
      if (map[wallY][wallX] > 0) {
        distX = x - this.player.x;
        distY = y - this.player.y;
        dist = distX * distX + distY * distY;
        textureX = y % 1;
        if (!right) {
          textureX = 1 - textureX;
        }
        xHit = x;
        yHit = y;
        break;
      }
      x += dX;
      y += dY;
    }
    slope = angleCos / angleSin;
    dY = up ? -1 : 1;
    dX = dY * slope;
    y = up ? Math.floor(this.player.y) : Math.ceil(this.player.y);
    return x = this.player.x + (y - this.player.y) * slope;
  };
  while (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
    wallY = Math.floor(y + (up ? -1 : 0));
    wallX = Math.floor(x);
    if (map[wallY][wallX] > 0) {
      distX = x - this.player.x;
      distY = y - this.player.y;
      blockDist = distX * distX + distY * distY;
    }
    if (!dist || blockDist < dist) {
      dist = blockDist;
      xHit = x;
      yHit = y;
      textureX = x % 1;
      if (up) {
        textureX = 1 - textureX;
      }
    }
    break;
    x += dX;
    y += dY;
  }
  if (dist) {
    drawRay(xHit, yHit);
  }
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
