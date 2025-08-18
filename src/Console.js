import * as rl from "node:readline/promises"

import newjsontr from "../www/game/shared/newjsontransfrm.js"
import tools from "./tools.js"
import Loc from "../www/game/shared/Loc.js"


var rev	=newjsontr(
{
	dewd	:
	{
		rev:( val )=>new tools.Dewd(val)
	},
	seedbag :
	{
		rev:( val )=> val.map(( bag )=> new tools.Seedbag(bag) )
	}
}).revivr


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
	var i	=str.indexOf(" ")

	var act	=str.slice(0, i )

	try{
		var arg	=i>=0 && i<str.length-2 ? JSON.parse(str.slice( i + 1 ), rev ) : null
	}
	catch(err)
	{
		console.error("console parse",str)

		return
	}
	var g	=this.game

	switch(act)
	{
		case "save" :

			g.save()
		break
		case "stop" :

			await g.stop()
		break
		case "additem"	:

			try{
				let map	=g.maps.loc2map( arg.loc )

				map.additem( arg.loc, arg.o )
			}
			catch(err)
			{
				console.error("console", str )
			}
		break
		case "pladdinv" :

			let pl	=g.pls.o[arg.name]

		break
	}
}



Con.prototype. out	=function( str )
{
	this.rl.write( str )
}