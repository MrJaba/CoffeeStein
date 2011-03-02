class Player
  constructor: (opts) ->
    @x = 16  # current x, y position of the player
    @y = 10
    @dir = 0  # the direction that the player is turning, either -1 for left or 1 for right.
    @rotation = 0 # the current angle of rotation
    @speed = 0  # is the playing moving forward (speed = 1) or backwards (speed = -1).
    @moveSpeed = 0.18  # how far (in map units) does the player move each step/update
    @rotateSpeed = 6 * Math.PI / 180  # how much does the player rotate each step/update (in radians)

  move: () ->
    moveStep = @speed * @moveSpeed # player will move this far along the current direction vector
    @rotation += @dir * @rotateSpeed # add rotation if player is rotating (player.dir != 0)
    newX = @x + Math.cos(@rotation) * moveStep # calculate new player position with simple trigonometry
    newY = @y + Math.sin(@rotation) * moveStep
    blocking = isBlocking(newX, newY)
    [@x, @y] = [newX, newY] unless blocking
