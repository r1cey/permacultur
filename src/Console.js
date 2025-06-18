import * as rl from "node:readline/promises"

import Loc from "../www/game/shared/Loc.js"


export default class Con
{
	rl	=rl.createInterface({ input :process.stdin, output :process.stdout })

	game


	constructor( game )
	{
		this.game	=game

		this.rl.on( "line", this.online.bind(this))
	}
}



Con.prototype. online	=async function( str )
{
	var arr	=str.split(" ")

	var g	=this.game

	switch(arr[0])
	{
		case "save" :

			g.save()
		break
		case "stop" :

			await g.stop()
		break
		case "additem"	:

			g.additem( ...arr.slice(1) )
		break

	}
}



Con.prototype. out	=function( str )
{
	this.rl.write( str )
}