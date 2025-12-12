import * as fs	from '../fs.js'
import shMaps	from '../../www/game/shared/maps/Maps.js'

import Ground from './Ground.js'
import Trees from './Canopy.js'

import { ensuredir }	from "../fs.js"



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
		super( Ground ,Trees )

		this.game	=game
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Returns obj with correct player locations.
 * { [plname] :loc } */

Ms.prototype. start	=async function()
{
	var dir	=this.conf.dir

	if( ! (await ensuredir(dir) && await this.game.pls.init() ) )
	{
		return false
	}
	var pllocs	=await Promise.all(
		[
			this.gr.read( this.conf.dir )
			,
			this.trees.read( this.conf.dir )
		])
	if( ! this.gr.bin )
	{
		// console.log( `Ground files were not found` )
	}
	else if( ! this.trees.bin )
	{
		console.log( `Generating new trees map from ground map.`)

		this.tr.gen( this.gr )

		this.trees.save(this.conf.dir)
	}
	var errorlocs	=Ms.mergepllocs( pllocs )

	var errormaps	=new Set()

	for(var[ pln ,plloc ] of errorlocs )
	{
		var map	=this.loc2map( plloc )

		errormaps.add( map )

		delete map.obj.g(plloc).pl
	}
	for(var map of errormaps )
	{
		map.save( this.conf.dir )
	}
	return pllocs[0]
}



Ms.prototype. genriver	=function()
{
	this.gr.genriver( this.conf.size.r, this.conf.size.maxcells )

	this.save()
}

Ms.prototype. gendesert	=function()
{
	this.game.mode	="desert"

	this.gr.gendesert( this.conf.size.r, this.conf.size.maxcells )

	this.tr.gen( this.gr )

	this.save()
}


///////////////////////////////////////////////////////////////////////////////



Ms.prototype. save	=async function()
{
	var proms	=
	[
		this.gr.save(this.conf.dir)
		,
		this.trees.save(this.conf.dir)
	]
	return await Promise.allSettled( proms )
}




/*
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


///////////////////////////////////////////////////////////////////////////////


Ms.prototype. newitem	=function( path ,item )
{
	
}


///////////////////////////////////////////////////////////////////////////////


/** @arg [] pllocs
 * Merges locs into first array member. Returns errorlocs if conflicts happen. */

Ms.mergepllocs	=function( pllocs )
{
	var errlocs	=[]

	var root	=pllocs[0]

	for(var i= 1 ;i< pllocs.length ;i++)
	{
		for( pln in pllocs[i] )
		{
			if( root[pln] )
			{
				errlocs.push([ pln ,pllocs[i][pln] ])
			}
			else
			{
				root[pln]	=pllocs[i][pln]
			}
		}
	}
	return errlocs
}