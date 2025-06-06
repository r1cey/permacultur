import ShMap	from "../../www/shared/maps/Map.js"

import Obj	from "./Obj.js"

import * as fs	from '../fs.js'

import Pl	from '../Player.js'

import Loc	from "../../www/shared/Loc.js"

import newBo	from "../../www/shared/maps/newBoard.js"
import newBinMShift	from "../../www/shared/maps/newBinMapShift.js"



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

	if( buf )	fs.savebuf( pa+'.bin', buf )

	fs.savejson( pa+'.json' , this.obj.o ,( key, val )=>
	{
		switch( key )
		{
			case 'pl' :

				return val.name
		}
		return val
	})
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


	Map.prototype. newshiftboard	=function( loc, r, delta, timecode )
	{
		var Map	=this.constructor

		var cellslen	=(r << 1) + 1

		var dir	=Loc.dirv2dirh( delta )

		var bo	=new Map.MapShiftBo( cellslen, loc, r, dir, timecode )

		var i	=0

		this.fordiredge(( v )=>
		{
			bo.bin.setcell( i, this.gbincell( v ))
			
			bo.obj.push( this.obj.get(v) )

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