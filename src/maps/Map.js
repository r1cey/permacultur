import ShMap	from "../../www/shared/maps/Map.js"

import Obj	from "./Obj.js"

import * as fs	from '../fs.js'

import Pl	from '../Player.js'

import Loc	from "../../www/shared/Loc.js"



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

/*
	newshiftbufs ( loc, r, delta, timecode )
	{
		var bufs	=[]

		for(var i =0,len= this.bufs.length ;i<len;i++)
		{
			bufs[i]	=this.bufs[i].new
		}


		var cellslen	=(r << 1) + 1
	}
*/


///////////////////////////////////////////////////////////////////////////



Map.prototype. setobj	=function( o )
{

}



var rules	=
{

}