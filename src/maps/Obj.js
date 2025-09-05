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

	var pls	={}

	var o	=await fs.readjson( path+'.json', ( key, val )=>
	{
		if( val?.pl )
		{
			pls[ val.pl ]	=key

			return val
		}
		else	return this.constructor.jrev.fn( key, val )
	} )
	if( ! o )	return

	var proms	=[]

	for(let pln in pls )
	{
		proms.push( (async()=>
		{
			var vstr	=pls[pln]

			var pl	=await map.game.pls.read( pln )

			var h	=map.bin	? map.getloc().h	: pl.loc.h

			pl.loc.setvstr(vstr, h )
			
			o[vstr].pl	=pl
		})() )
	}
	/** Don't forget, the only reason we go through o again is to check
	 * correct locations for each player */

	await Promise.all( proms )

	this.o	=o
}