import ShObj	from "../../www/shared/maps/Obj.js"

import * as fs	from '../fs.js'

import * as json from "../../www/shared/json.js"




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

	var o	=await fs.readjson( path+'.json', json.newreviver() )

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