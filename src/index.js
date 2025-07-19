// import repl from 'node:repl'

import Game from "./Game.js"

global.game	=new Game( 'conf.json' )

await game.start()

if( ! game.maps.isready() )
	
	game.maps.gendesert()

// game.server.start()

// game.maps.ground.printarr(0)

// zen.map.randomwater()

// repl.start() 
