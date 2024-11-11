// import repl from 'node:repl'

import Game from "./Game.js"

global.game	=new Game( 'conf.json' )

game.start()

// game.server.start()

// game.maps.ground.printarr(0)

// zen.map.randomwater()

// repl.start() 
