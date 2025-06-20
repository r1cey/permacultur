import ShObj	from "../../www/game/shared/maps/Obj.js"

import * as fs	from '../fs.js'

import tools from "../../www/game/shared/tools.js"
import newjsonrules from "../../www/game/shared/newjsonrules.js"
var json	=newjsonrules(tools)



export default class Obj extends ShObj
{
	rules


	constructor( ...args )
	{
		super( ...args )
		/*
		this.rules	=json.newrules(
			{
				pl	:
				{
					rev	:( val )=> this.map.game.pls.read
				}
			})*/
	}
}



Obj.prototype. read	=async function( path )
{
	var map	=this.map

	var o	=await fs.readjson( path+'.json', json.newrevivr() )

	if( ! o )	return

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

	this.o	=o
}