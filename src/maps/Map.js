import * as fs	from '../fs.js'

import Pl	from '../Player.js'

import Loc	from "../../www/shared/Loc.js"



var Map	=( Base ) => class extends Base
{
	game

	get g()	{return this.game }

	static name





	async read( dir ="" )
	{
		var pa	=dir + this.constructor.name

		var proms	=[]

		for(var i=0; i<this.constructor.Bufs.length; i++)
		{
			proms.push( fs.readbuf( pa+i+'.bin' ))
		}

		var	files	=await Promise.allSettled(
					[Promise.all(proms), fs.readjson(pa+'.json')])
		
		for(var i=0; i<files[0].value?.length; i++)
		{
			this.setbuf( files[0].value[i] )
		}

		await this.seto( files[1].value )

		if( files[0].value )
		{
			console.log('Read map: '+this.constructor.name )
		}
		return Boolean(files[0].value )
	}



	async save( dir ="")
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


	/** Parse o and read data from files to fill o */

	async seto( o )
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
							var pl	=await this.game.pls.read( c.pl )

							var h	=this.bufs[0]	? this.getloc().h	: pl.loc.h

							pl.loc.setvstr(locst, h )
							
							cell2save.pl	=pl
						})())
				}
			}
		}

		await Promise.all( proms )
	}


	///////////////////////////////////////////////////////////////////////////


	newshiftmap( pl )
	{
		// var newmap	=this.

		for(var i=0, len=this.bufs.length; i<len; i++)
		{
			// this.bufs[i].
		}
	}
}

export default Map


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
