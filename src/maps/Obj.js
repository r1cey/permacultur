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


/** If successful, returns {[plname]:loc} */

Obj.prototype. read	=async function( path )
{
	var{ map }	=this

	var pls	={}

	var h	=this.map.getloc().h

	var o	=await fs.readjson( path+'.json', ( key, val )=>
	{
		if( val?.pl )
		{
			pls[ val.pl ]	=new Loc().setvstr( key ,h )

			return val
		}
		else	return this.constructor.jrev.revivr( key, val )
	} )
	if( ! o )	return

	console.log( `Have read map obj file: ${this.map.constructor.name}`)

	this.o	=o

	return pls
}