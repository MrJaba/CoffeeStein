bindKeys = () ->
  jQuery(document).keydown (event) =>
    e = event || window.event
    switch e.keyCode
      when 38 then @player.speed = 1 # up, move player forward, ie. increase speed        
      when 40 then @player.speed = -1 # down, move player backward, set negative speed
      when 37 then @player.dir = -1 # left, rotate player left
      when 39 then @player.dir = 1  # right, rotate player right

 	#stop the player movement/rotation when the keys are released
  jQuery(document).keyup (event) =>
    e = event || window.event
    switch e.keyCode
      when 38, 40 then @player.speed = 0
      when 37, 39 then @player.dir = 0