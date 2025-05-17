import ShObj	from "../../www/shared/maps/Obj.js"

// import * as fs	from '../fs.js'

export default class Obj extends ShObj
{

}



/** Parse o and read data from files to fill o */

Obj.prototype. seto	=async function( o, map )
{
	if( !o )	return

	this.o	=o

	var proms	=[]

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

	await Promise.all( proms )
}