import * as fs	from '../fs.js'
import shMaps	from '../../www/game/shared/maps/Maps.js'

import Ground from './Ground.js'
import Trees from './Trees.js'



export default class Ms extends shMaps
{
	conf	=
	{
		size	:
		{
			maxcells	:40000000
			,
			r	:150
		}
		,
		dir	:"./maps/"
	}

	game


	static Ground	=Ground

	static Trees	=Trees


	constructor( game )
	{
		super()

		this.ground	=new Ground( game )
		this.trees	=new Trees( game )

		this.game	=game
	}
}


///////////////////////////////////////////////////////////////////////////////



Ms.prototype. start	=async function()
{
	var proms	=
	[
		this.gr.read( this.conf.dir )
		,
		this.trees.read( this.conf.dir )
	]

	proms	=await Promise.all(proms)

	if( ! proms[0] )
	{
		console.log( `Ground files were not found` )

		this.gr.gen(this.conf.size.r, this.conf.size.maxcells, this.trees)

		this.save()
	}
	else if( ! proms[1] )
	{
		console.log( `Trees files were not found`)

		this.tr.gen( this.gr )

		this.trees.save(this.conf.dir)
	}
}



Ms.prototype. gen	=function( r, maxc )
{
/*	r	??=this.conf.size.r
	
	maxc	??=this.conf.size.maxcells

	var gr	=this.gr

	var tr	=this.tr*/
}

///////////////////////////////////////////////////////////////////////////////



Ms.prototype. save	=async function()
{
	this.gr.save(this.conf.dir)

	this.trees.save(this.conf.dir)
}




/*
Ms.prototype. parseo	=function( o )
{
	var cell

	for(var x in o )
	{
		for(var y in o[x])
		{
			cell	=o[x][y]

			for(var p1 in cell )
			{
				for(var p2 in cell[p1])
				{
					if( p2 === 'loc' )
					{
						cell[p1][p2]	=new V().seta(cell[p1][p2])
					}
				}
			}
		}
	}
}
*
Ms.prototype. read	=async function()
{
	var files	=await fs.readdir( this.dir )

	for(var filen in files)
	{
		var n	=filen.substring( 0, filen.lastIndexOf('.') )

		var map	=this.o[n]

		if( ! map )	map	=await Map.new( n, this.dir )
	}
}


Ms.prototype. save	=async function()
{
	var g	=this.game

	var path

	for(var n in g.maps.o)
	{
		var map	=g.maps.o[n]

		console.log(`Attempting to save map: ${n}`)

		path	=g.maps.dir+n+'.bin'

		try
		{
			await fs.writeFile( path, Buffer.from(map.getbuf()), {flag:'w'})
		}
		catch(err)
		{
			console.error( `Couldn't write: ${path}` )
		}
		path	=g.maps.dir+n+'.json'
		try
		{
			await fs.writeFile( path, JSON.stringify(map.o), {flag:'w'})
		}
		catch(err)
		{
			console.error( `Couldn't write: ${path}`)
		}
	}
}

Ms.prototype. forcell	=function( fun )
{
	this.fore(( n, map )=>
	{
		map.fore( fun )
	})
}*/


/** When player moves, get the additional cells he sees. */

Ms.prototype. gshiftboards	=function( loc, r, dir )
{
	return { gr :this.gr.newshiftboard( loc, r, dir ),
				tr :this.tr.newshiftboard( loc, r, dir ) }
}