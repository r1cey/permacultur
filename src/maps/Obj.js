import ShObj	from "../../www/game/shared/maps/Obj.js"

import * as fs	from '../fs.js'

import Loc from "../../www/game/shared/Loc.js"
import tools from "../tools.js"
import newjsontrans from "../../www/game/shared/newjsontransfrm.js"


var jsontr	=newjsontrans(
	{
		dewd	:
		{
			rev:( val )=>new tools.Dewd(val)
		},
		spawns :
		{
			rev:( arr )=>
			{
				for(var i=0,len =arr.length ;i<len;i++)
					arr[i]	=new Loc().fromJSON(arr[i]);

				return arr
			}
		}
	}
)



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

	var o	=await fs.readjson( path+'.json', jsontr.revivr )

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