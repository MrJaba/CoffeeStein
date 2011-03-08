class Raycaster
  constructor: (opts) ->
    @player = opts.player
    @map = opts.map
    @screenStrips = [];
    @mapWidth = @map[0].length
    @mapHeight = @map.length
    @screenWidth = 320
    @screenHeight = 200
    @stripWidth = 4
    @fov = 60 * Math.PI / 180
    @numRays = Math.ceil(@screenWidth / @stripWidth)
    @viewDist = (@screenWidth/2) / Math.tan((@fov / 2))
    @twoPI = Math.PI * 2
    @numTextures = 4
    @dist = null

  initScreen: () ->
    screen = $("screen")
    for i in [0..@screenWidth] by @stripWidth
      strip = dc("div")
      strip.style.position = "absolute"
      strip.style.left = i + "px"
      strip.style.width = @stripWidth+"px"
      strip.style.height = "0px"
      strip.style.overflow = "hidden"
      img = new Image()
      img.src = "/img/walls.png"
      img.style.position = "absolute"
      img.style.left = "0px"
      strip.appendChild(img)
      strip.img = img; #assign the image to a property on the strip element so we have easy access to the image later
      @screenStrips.push(strip)
      screen.appendChild(strip)

  facingRight: (rayAngle) ->
    (rayAngle > @twoPI * 0.75 || rayAngle < @twoPI * 0.25)

  facingUp: (rayAngle) ->
    (rayAngle < 0 || rayAngle > Math.PI)

  castRays: () ->
    for rayIndex in [0...@numRays]
      #where on the screen does ray go through?
      rayScreenPosition = (-@numRays/2 + rayIndex) * @stripWidth
      #the distance from the viewer to the point on the screen, simple Pythagoras.
      rayViewDistance = Math.sqrt(rayScreenPosition*rayScreenPosition + @viewDist*@viewDist)
      #the angle of the ray, relative to the viewing direction.
      #right triangle: a = sin(A) * c
      rayAngle = Math.asin(rayScreenPosition / rayViewDistance)
      # add the @players viewing direction to get the angle in world space
      this.castSingleRay( @player.rotation + rayAngle, rayIndex )
    
  castSingleRay: (rayAngle, stripId) ->
    @dist = null
    # first make sure the angle is between 0 and 360 degrees
    rayAngle %= @twoPI
    rayAngle += @twoPI if rayAngle < 0

    @angleSin = Math.sin(rayAngle)
    @angleCos = Math.cos(rayAngle)
    right = this.facingRight(rayAngle)
    up = this.facingUp(rayAngle) 

    # first check against the vertical map/wall lines
    # we do this by moving to the right or left edge of the block we're standing in
    # and then moving in 1 map unit steps horizontally. The amount we have to move vertically
    # is determined by the slope of the ray, which is simply defined as sin(angle) / cos(angle).
    this.checkVerticalLines(right, up)

    # now check against horizontal lines. It's basically the same, just "turned around".
    # the only difference here is that once we hit a map block, 
    # we check if there we also found one in the earlier, vertical run. We'll know that if dist != 0.
    # If so, we only register this hit if this distance is smaller.
    this.checkHorizontalLines(right, up)
    this.drawWall(stripId, rayAngle) if @dist
    
  checkVerticalLines: (right, up) ->
    slope = @angleSin / @angleCos  # the slope of the straight line made by the ray
    dXVer = if right then 1 else -1  # we move either 1 map unit to the left or right
    dYVer = dXVer * slope    # how much to move up or down

    x = if right then Math.ceil(@player.x) else Math.floor(@player.x) # starting horizontal position, at one of the edges of the current map block
    y = @player.y + (x - @player.x) * slope # starting vertical position. We add the small horizontal step we just made, multiplied by the slope.

    while (x >= 0 && x < @mapWidth && y >= 0 && y < @mapHeight)
      wallX = Math.floor(x + (if right then 0 else -1))
      wallY = Math.floor(y)
      # is this point inside a wall block?
      if (map[wallY][wallX] > 0)
        distX = x - @player.x
        distY = y - @player.y
        @dist = distX*distX + distY*distY # the distance from the @player to this point, squared.
        @wallType = map[wallY][wallX]
        @textureX = y % 1 # where exactly are we on the wall? textureX is the x coordinate on the texture that we'll use when texturing the wall.
        @textureX = 1 - @textureX unless right # if we're looking to the left side of the map, the texture should be reversed
        xHit = x # save the coordinates of the hit. We only really use these to draw the rays on minimap.
        yHit = y
        break
      x += dXVer
      y += dYVer
  
  checkHorizontalLines: (right, up) ->
    slope = @angleCos / @angleSin
    dYHor = if up then -1 else 1
    dXHor = dYHor * slope
    y = if up then Math.floor(@player.y) else Math.ceil(@player.y)
    x = @player.x + (y - @player.y) * slope
    while (x >= 0 && x < @mapWidth && y >= 0 && y < @mapHeight)
      wallY = Math.floor(y + (if up then -1 else 0))
      wallX = Math.floor(x)
      if (map[wallY][wallX] > 0)
        distX = x - @player.x
        distY = y - @player.y
        blockDist = distX*distX + distY*distY
        if (!@dist || blockDist < @dist)
          @dist = blockDist
          xHit = x
          yHit = y
          @wallType = map[wallY][wallX]        
          @textureX = x % 1
          @textureX = 1 - @textureX if up
        break
      x += dXHor
      y += dYHor
    
  drawWall: (stripId, rayAngle) ->
    strip = @screenStrips[stripId]
    dist = Math.sqrt(@dist)
    #use perpendicular distance to adjust for fish eye
    #distorted_dist = correct_dist / cos(relative_angle_of_ray)
    dist = dist * Math.cos(@player.rotation - rayAngle)
    # now calc the position, height and width of the wall strip
    # "real" wall height in the game world is 1 unit, the distance from the player to the screen is viewDist,
    # thus the height on the screen is equal to wall_height_real * viewDist / dist
    height = Math.round(@viewDist / dist)
    # width is the same, but we have to stretch the texture to a factor of stripWidth to make it fill the strip correctly
    width = height * @stripWidth
    # top placement is easy since everything is centered on the x-axis, so we simply move
    # it half way down the screen and then half the wall height back up.
    top = Math.round((@screenHeight - height) / 2)
    strip.style.height = height+"px"
    strip.style.top = top+"px"
    strip.img.style.height = Math.floor(height * @numTextures)+"px"
    strip.img.style.width = Math.floor(width*2)+"px"
    strip.img.style.top = -Math.floor(height * (@wallType-1))+"px"
    texX = Math.round(@textureX*width)
    texX = width - @stripWidth if (texX > width - @stripWidth)
    strip.img.style.left = -texX + "px"

  #This is used to draw lines representing the cast rays on the minimap
  drawRay: (rayX, rayY) ->
    miniMapObjects = $("minimapobjects")
    objectContext = miniMapObjects.getContext("2d")
    objectContext.strokeStyle = "rgba(0,100,0,0.3)"
    objectContext.lineWidth = 0.5
    objectContext.beginPath()
    objectContext.moveTo(@player.x * @miniMapScale, @player.y * @miniMapScale)
    objectContext.lineTo( rayX * @miniMapScale, rayY * @miniMapScale )
    objectContext.closePath()
    objectContext.stroke()
