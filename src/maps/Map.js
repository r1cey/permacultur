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

	obj	=new Obj()
}




Map.prototype. read	=async function( dir ="" )
{
	var pa	=dir + this.constructor.name
/*
	var proms	=[]

	for(var i=0; i<this.constructor.Bufs.length; i++)
	{
		proms.push( fs.readbuf( pa+i+'.bin' ))
	}

	var	files	=await Promise.allSettled(
				[Promise.all(proms), fs.readjson(pa+'.json')])*/

	var	files	=await Promise.all(
				[fs.readbuf( pa+".bin"), fs.readjson(pa+'.json')])
	
	/*for(var i=0; i<files[0].value?.length; i++)
	{
		this.setbuf( files[0].value[i] )
	}*/


	if( files[0] )
	{
		console.log('Has read bin map: '+this.constructor.name )

		this.setbuf( files[0] )
	}

	this.obj.seto( files[1] )

	return Boolean(files[0] )
}



Map.prototype. save	=async function( dir ="")
{
	var pa	=dir+this.constructor.name

	for(var i=0; i<this.bufs.length; i++)
	{
		fs.savebuf( pa+i+'.bin', this.bufs[i].buf )
	}

	fs.savejson( pa+'.json' , this.o ,( key, val )=>
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


/*
Map.new	=async function( name, dir )
{
	var map	=new Map()

	var path	=dir+name

	var buf	=await fs.readbuf( path+'.bin' )

	if( !buf )
	{
		return
	}

	map.setbuf( buf )

	if( map.getloc().toString() !== name )
	{
		console.error( `Filename of map doesn't match the inside name! `+
				`${name} ${map.getloc()}` )
	}

	console.log( `Read: r=${map.r}, cells=${map.cells}`)

	var o	=await fs.readjson( path+'.json' )

	if(o )
	{
		map.o	=o
	}
}*/
