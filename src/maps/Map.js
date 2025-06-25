import ShMap	from "../../www/game/shared/maps/Map.js"

import Obj	from "./Obj.js"

import * as fs	from '../fs.js'

import Pl	from '../player/Player.js'

import Loc	from "../../www/game/shared/Loc.js"

import newBo	from "../../www/game/shared/maps/newBoard.js"
import newBinMShift	from "../../www/game/shared/maps/newBinMapShift.js"



export default class Map extends ShMap
{
	game

	get g()	{return this.game }

	/** define in derived class
	@static
	@var name */

	obj	=new Obj(this)


	constructor( game )
	{
		super()

		this.game	=game
	}
}




Map.prototype. read	=async function( dir ="" )
{
	var pa	=dir + this.constructor.name

	var buf	=await fs.readbuf( pa+".bin")

	if( buf )
	{
		console.log('Has read bin map: '+this.constructor.name )

		this.setbuf( buf )
	}

	await this.obj.read( pa )

	return buf
}



Map.prototype. save	=async function( dir ="")
{
	var pa	=dir+this.constructor.name

	var buf	=this.bin.getbuf()

	var proms	=[]

	if( buf )	proms[0]	=fs.savebuf( pa+'.bin', buf )

	proms[1]	=fs.savejson( pa+'.json' , this.obj.o ,( key, val )=>
		{
			switch( key )
			{
				case 'pl' :

					return val.name
			}
			return val
		})

	return await Promise.allSettled( proms )
}


///////////////////////////////////////////////////////////////////////////



Map.prototype. set_	=function( name, loc, ...vals )
{
	this["set"+name]( loc, ...vals )

	this.game?.server?.send_mapset_( this, name, loc, vals )
}


/** @arg name	-Name of the set method. "_i" will be added automatically */

Map.prototype. set_ic_	=function( name, ic, loc, ...vals )
{
	this["set"+name+"_i"]( ic, ...vals )

	this.game?.server?.send_mapset_( this, name, loc, vals )
}


Map.prototype. newshiftboard	=function( loc, r, dir )
{
	var Map	=this.constructor

	var cellslen	=(r << 1) + 1

	var bo	=new Map.MapShiftBo( cellslen, loc, r, dir )

	var ic	=0

	bo.obj.length	=cellslen

	this.fordiredge(( v )=>
	{
		bo.bin.setcell( ic, this.gbincell( v ))
		
		bo.obj[ic]	= this.obj.get(v)

		ic ++

	},	dir, r, loc)

	return bo
}


///////////////////////////////////////////////////////////////////////////



Map.prototype. setobj	=function( o )
{

}



var rules	=
{

}