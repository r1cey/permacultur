import ShObj	from "../../www/game/shared/maps/Obj.js"

import * as fs	from '../fs.js'

import Loc from "../../www/game/shared/Loc.js"
// import items from "../items.js"
import JRev from "../JsonRevivr.js"




export default class Obj extends ShObj
{
	static jrev	=new JRev().add([
		{
			key :"spawns"
			,
			fromJSON :( arr )=> arr.map(( val )=> new Loc().seta(val) )
		}
	])

	/*constructor( ...args )
	{
		super( ...args )
	}*/
}



Obj.prototype. read	=async function( path )
{
	var{ map }	=this

	var proms	=[]

	var o	=await fs.readjson( path+'.json', this.constructor.jrev.fn )

	if( ! o )	return

	/** Don't forget, the only reason we go through o again is to check
	 * correct locations for each player *
	for(var locst in o)
	{
		var c	=o[locst]

		for(var p in c )
		{
			switch(p)
			{
				case 'pl':

					let cell2save	=c

					proms.push( (async()=>
					{
						var pl	=await map.game.pls.read( c.pl )

						var h	=map.bin	? map.getloc().h	: pl.loc.h

						pl.loc.setvstr(locst, h )
						
						cell2save.pl	=pl
					})())
			}
		}
	}

	await Promise.all( proms )*/

	this.o	=o
}