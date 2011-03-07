#DOM helpers
$ = (id) -> document.getElementById(id)
dc = (tag) -> document.createElement(tag)

@map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,3,0,3,0,0,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,3,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
  [1,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,3,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [1,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,4,2,0,2,2,2,2,2,2,2,2,0,2,4,4,0,0,4,0,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
  [1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
  [1,0,0,4,3,3,4,2,2,2,2,2,2,2,2,2,2,2,2,2,4,3,3,4,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

@mapWidth = 0 #number of map blocks in x-direction
@mapHeight = 0 #number of map blocks in y-direction
@miniMapScale = 8 #how many pixels to draw a map block
@frameRate = 30 #FPS

init = () ->
  @player = new Player()
  @raycaster = new Raycaster(player:@player, map:@map)
  @raycaster.initScreen()
  @mapWidth = @map[0].length
  @mapHeight = @map.length  
  drawMiniMap()
  gameCycle()

gameCycle = () ->
  @player.move()
  updateMiniMap()
  @raycaster.castRays()
  setTimeout(gameCycle, 1000/@frameRate)

drawMiniMap = () ->
  miniMap = $("minimap")
  miniMap.width = @mapWidth * @miniMapScale  #resize the internal canvas dimensions 
  miniMap.height = @mapHeight * @miniMapScale
  miniMap.style.width = (@mapWidth * @miniMapScale) + "px" #resize the canvas CSS dimensions
  miniMap.style.height = (@mapHeight * @miniMapScale) + "px"
  #loop through all blocks on the map
  context = miniMap.getContext("2d")
  for y in [0...@mapHeight]
    for x in [0...@mapWidth]
      wall = @map[y][x]
      #if there is a wall block at this (x,y) ...
      if (wall > 0) 
        context.fillStyle = "rgb(200,200,200)"
        # ... then draw a block on the minimap
        context.fillRect(x * @miniMapScale, y * @miniMapScale, @miniMapScale, @miniMapScale)

updateMiniMap = () ->
  miniMap = $("minimap")
  miniMapObjects = $("minimapobjects")
  objectContext = miniMapObjects.getContext("2d")
  objectContext.clearRect(0, 0, miniMap.width, miniMap.height)
  #draw a dot at the current player position
  objectContext.fillRect( @player.x * @miniMapScale - 2, @player.y * @miniMapScale - 2,	4, 4 )
  objectContext.beginPath()
  objectContext.moveTo(@player.x * @miniMapScale, @player.y * @miniMapScale)
  objectContext.lineTo(	(player.x + Math.cos(@player.rotation) * 4) * @miniMapScale,	(@player.y + Math.sin(@player.rotation) * 4) * @miniMapScale )
  objectContext.closePath()
  objectContext.stroke()
  
isBlocking = (x,y) ->
  #first make sure that we cannot move outside the boundaries of the level
  return true if (y < 0 || y >= @mapHeight || x < 0 || x >= @mapWidth)
  #return true if the map block is not 0, ie. if there is a blocking wall.
  @map[Math.floor(y)][Math.floor(x)] != 0

jQuery(document).ready ->
  init()  
  bindKeys()