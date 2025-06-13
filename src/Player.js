import PlMsg from '../www/shared/Player.js'
import V from '../www/shared/Vec.js'

import Loc from './Loc.js'

import * as fs	from './fs.js'

import * as json from "../www/shared/json.js"

/*
const SrvPl	=(c) => class extends c
{
	constructor()
	{
		super()

		// delete this.loc
	}

	setwater( lvl )
	{
		PlMsg.prototype.setwater. call(this, lvl )
	}
	subwater( lvl )
	{
		PlMsg.prototype.subwater. call(this, lvl )
	}
}



class PlSlp extends SrvPl( PlMsg.Vis )
{
	// water	=0.5

	constructor(o, json)
	{
		super()

		delete this.cl

		if(o)	this.set(o, json)
	}
}*/


export default class Player extends PlMsg	//SrvPl( PlMsg )
{	
	game

	map()	{return this.game.maps.fromloc( this.loc )}

	srv()	{return this.game.server }




	constructor( pl, game )
	{
		super( pl )

		this.game	=game
	}

	/*static Slp	=PlSlp

	static _msg	=new PlMsg()

	constructor( o, json, game, map )
	{
		super()

		Object.assign(this,{ game, map })

		if(o)	this.set(o, json )
	}*/
}



///////////////////////////////////////////////////////////////////////////////



Player.prototype. save	=async function( dir )
{
	var pa	=dir+this.name+'.json'

	await fs.savejson( pa, this, json.newreplcr() )
}


/**  */

Player.prototype. conncl	=function( cl )
{
	this.cl	=cl

	cl.send_setpl()

	cl.send_setmap()

	this.game.srv?.send_plconn( this )
}



Player.prototype. clclosed	=function()
{
	this.game.srv?.cls.del( this.name )

	this.cl	=null

	this.game.srv?.send.plconn( this )
}


///////////////////////////////////////////////////////////////////////////////


/** //!!!newloc will be modified!!! */

Player.prototype. mov	=function( newloc )
{
	var pl	=this

	var{ loc }	=pl

	var map	=this.map()

	if( ! map.isplmov( newloc, pl ))
	{
		pl.cl?.send_error( "Can't move there." )

		return
	}

	if( loc.eq( newloc ))
	{
		pl.cl?.send_error( "Already there." )
		
		return
	}

	pl.loc.forlineh( newloc, (loc)=>
	{
		newloc.set(loc)

		return true
	})

	map.obj.del( loc, "pl" )

	// var dir	=Loc.dirv2dirh(loc.subv(newloc).neg())

	var oldloc	=loc

	pl.loc	=newloc

	map.obj.set(newloc).pl	=this

	this.srv()?.send_plmov( this, oldloc )

	if( newloc.h === 0 )
	{
		map	=pl.game.maps.gr

		map.fore(( loc )=>
		{
			if( map.iswater(loc) )
			{
				// pl.setwater( 1 )	// reinstate later

				return true
			}
		}
		,1 ,loc )
	}

	// console.log(`Player ${this.pl.name} moved to ${this.pl.loc.p()}.`)
}



/** I can presend location of tree to not look for it every time
 * @arg hdir	- true is up */

Player.prototype. climb	=function( hdir )
{
	var pl	=this

	var{ loc }	=pl

	var dest	=new Loc().set(loc)
	
	dest.h	=hdir	? 1	: 0

	var destmap	=pl.game.maps.fromloc( dest )

	if( ! destmap.isplmov( dest ))
	{
		pl.cl?.send.error( "Can't climb there" )

		return
	}

	var map	=pl.map()
	
	var tloc	=new Loc()

	for(var dir=0;dir<6;dir++)
	{
		if( map.climbable( tloc.set(loc).neighh(dir) ))
		{
			break
		}
	}
	if( dir === 6 )
	{
		pl.cl.send.error( `No tree to climb` )

		return
	}

	map.deloprop( loc, "pl" )

	loc.h	=dest.h

	destmap.scello(loc).pl	=pl

	pl.srv()?.send.plclimb( pl, hdir )
}




Player.prototype. cl_send	=function( msg )
{
	this.cl.send( JSON.stringify(msg) )
}


/** Supply the object dict of players to search in! */


Player.prototype. forseenpls	=function( pls, fun )
{
	for(var n in pls)
	{
		if( pls[n].seespl( this ))	fun( this, pls[n] )
	}
}
/*
Player.prototype. forisseencls	=function( fun )
{
	var pl	=this

	pl.game.srv.forcls(( cl2 )=>
	{
		if( cl2.pl.seespl(pl) )	fun( cl2, pl )
	})
}
*/
/*
Player.prototype. disconn	=function()
{
	var pl	=this

	pl.cl	=0

	pl.forisseencls(( cl2 )=>
	{
		cl2.s.plconn( pl.name, false )
	})
}
*/


Player.prototype. setwater	=function( lvl )
{
	PlMsg.O.prototype. setwater.call(this, lvl )

	this.cl?.send.json({ water: this.water })
}
Player.prototype. subwater	=function( lvl )
{
	PlMsg.O.prototype. subwater.call(this, lvl )

	this.cl?.send.json({ water: this.water })
}


///////////////////////////////////////////////////////////////////////////////



/*Player. replacer	=function( key, val )
{
	switch( key )
	{
		case "cl" :	return val ? 1 : 0
		break
		case "game" :	return undefined
		break
		default:	return val
	}
}*/